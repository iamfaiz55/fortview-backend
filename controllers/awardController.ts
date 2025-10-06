import asyncHandler from 'express-async-handler';
import Award from '../models/Award';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all awards
// @route   GET /api/awards
// @access  Public
export const getAwards = asyncHandler(async (req: Request, res: Response) => {
  const { active, year, category, page = 1, limit = 12 } = req.query;

  let query: any = {};
  
  if (active === 'true') {
    query.isActive = true;
  }
  
  if (year) {
    query.year = parseInt(year as string, 10);
  }
  
  if (category) {
    query.category = category;
  }

  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination info
  const totalCount = await Award.countDocuments(query);

  // Get paginated results
  const awards = await Award.find(query)
    .sort({ year: -1, order: 1, createdAt: -1 })
    .select('-__v')
    .skip(skip)
    .limit(limitNum)
    .lean(); // Use lean() for better performance

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  const response = {
    success: true,
    data: awards,
    count: awards.length,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalCount,
      hasNextPage,
      hasPrevPage,
      limit: limitNum
    }
  };

  res.json(response);
});

// @desc    Get single award
// @route   GET /api/awards/:id
// @access  Public
export const getAward = asyncHandler(async (req: Request, res: Response) => {
  const award = await Award.findById(req.params.id).select('-__v');

  if (!award) {
    res.status(404);
    throw new Error('Award not found');
  }

  const response = {
    success: true,
    data: award,
  };

  res.json(response);
});

// @desc    Create new award
// @route   POST /api/awards
// @access  Private/Admin
export const createAward = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { 
    title, 
    description, 
    year, 
    organization, 
    category, 
    order 
  } = req.body;

  // Check if image is uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.file.buffer, 'awards');

    // Get the next order number if not provided
    let awardOrder = order;
    if (!awardOrder && awardOrder !== 0) {
      const lastAward = await Award.findOne().sort({ order: -1 });
      awardOrder = lastAward ? lastAward.order + 1 : 1;
    }

    const award = await Award.create({
      title,
      description,
      year: parseInt(year, 10),
      organization,
      category,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: awardOrder,
    });

    res.status(201).json({
      success: true,
      data: award,
    });
  } catch (error: any) {
    // Clean up uploaded image if database save fails
    if (req.file && req.file.buffer) {
      try {
        await deleteFromCloudinary(req.file.buffer.toString());
      } catch (cleanupError) {
        console.error('Error cleaning up image:', cleanupError);
      }
    }
    
    res.status(500);
    throw new Error('Error uploading image or saving award');
  }
});

// @desc    Update award
// @route   PUT /api/awards/:id
// @access  Private/Admin
export const updateAward = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const award = await Award.findById(req.params.id);

  if (!award) {
    res.status(404);
    throw new Error('Award not found');
  }

  const { 
    title, 
    description, 
    year, 
    organization, 
    category, 
    order,
    isActive 
  } = req.body;

  // Update basic fields
  if (title) award.title = title;
  if (description) award.description = description;
  if (year) award.year = parseInt(year, 10);
  if (organization !== undefined) award.organization = organization;
  if (category !== undefined) award.category = category;
  if (order !== undefined) award.order = order;
  if (isActive !== undefined) award.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image if exists
      if (award.image?.publicId) {
        await deleteFromCloudinary(award.image.publicId);
      }
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'awards');
      award.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await award.save();
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    throw error;
  }

  res.json({
    success: true,
    data: award,
  });
});

// @desc    Delete award
// @route   DELETE /api/awards/:id
// @access  Private/Admin
export const deleteAward = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const award = await Award.findById(req.params.id);

  if (!award) {
    res.status(404);
    throw new Error('Award not found');
  }

  try {
    // Delete image from Cloudinary if exists
    if (award.image?.publicId) {
      await deleteFromCloudinary(award.image.publicId);
    }

    // Delete from database
    await Award.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Award deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting award');
  }
});

// @desc    Reorder awards
// @route   PUT /api/awards/reorder
// @access  Private/Admin
export const reorderAwards = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      Award.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await Award.find()
      .sort({ order: 1, year: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering awards');
  }
});

// @desc    Toggle award active status
// @route   PATCH /api/awards/:id/toggle
// @access  Private/Admin
export const toggleAwardStatus = asyncHandler(async (req: RequestWithUser, res) => {
  const award = await Award.findById(req.params.id);

  if (!award) {
    res.status(404);
    throw new Error('Award not found');
  }

  award.isActive = !award.isActive;
  await award.save();

  res.json({
    success: true,
    data: award,
  });
});
