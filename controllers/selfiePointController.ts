import asyncHandler from 'express-async-handler';
import SelfiePoint from '../models/SelfiePoint';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
// import { CacheService, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all selfie points
// @route   GET /api/selfie-points
// @access  Public
export const getSelfiePoints = asyncHandler(async (req: Request, res: Response) => {
  const { active, page = 1, limit = 12 } = req.query;
  

 

  let query: any = {};
  
  if (active === 'true') {
    query.isActive = true;
  }

  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination info
  const totalCount = await SelfiePoint.countDocuments(query);

  // Get paginated results
  const selfiePoints = await SelfiePoint.find(query)
    .sort({ order: 1, createdAt: -1 })
    .select('-__v')
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  const response = {
    success: true,
    data: selfiePoints,
    count: selfiePoints.length,
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

// @desc    Get single selfie point
// @route   GET /api/selfie-points/:id
// @access  Public
export const getSelfiePoint = asyncHandler(async (req: Request, res: Response) => {
  

  const selfiePoint = await SelfiePoint.findById(req.params.id).select('-__v');

  if (!selfiePoint) {
    res.status(404);
    throw new Error('Selfie point not found');
  }

  const response = {
    success: true,
    data: selfiePoint,
  };

  


  res.json(response);
});

// @desc    Create new selfie point
// @route   POST /api/selfie-points
// @access  Private/Admin
export const createSelfiePoint = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { title, description, order } = req.body;

  // Check if image is uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.file.buffer, 'selfie-points');

    // Get the next order number if not provided
    let itemOrder = order;
    if (!itemOrder && itemOrder !== 0) {
      const lastItem = await SelfiePoint.findOne().sort({ order: -1 });
      itemOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const selfiePoint = await SelfiePoint.create({
      title,
      description,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: itemOrder,
    });



    res.status(201).json({
      success: true,
      data: selfiePoint,
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
    throw new Error('Error uploading image or saving selfie point');
  }
});

// @desc    Update selfie point
// @route   PUT /api/selfie-points/:id
// @access  Private/Admin
export const updateSelfiePoint = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const selfiePoint = await SelfiePoint.findById(req.params.id);

  if (!selfiePoint) {
    res.status(404);
    throw new Error('Selfie point not found');
  }

  const { title, description, order, isActive } = req.body;

  // Update basic fields
  if (title) selfiePoint.title = title;
  if (description) selfiePoint.description = description;
  if (order !== undefined) selfiePoint.order = order;
  if (isActive !== undefined) selfiePoint.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image
      await deleteFromCloudinary(selfiePoint.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'selfie-points');
      selfiePoint.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await selfiePoint.save();
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
    data: selfiePoint,
  });
});

// @desc    Delete selfie point
// @route   DELETE /api/selfie-points/:id
// @access  Private/Admin
export const deleteSelfiePoint = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const selfiePoint = await SelfiePoint.findById(req.params.id);

  if (!selfiePoint) {
    res.status(404);
    throw new Error('Selfie point not found');
  }

  try {
    // Delete image from Cloudinary
    await deleteFromCloudinary(selfiePoint.image.publicId);

    // Delete from database
    await SelfiePoint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Selfie point deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting selfie point');
  }
});

// @desc    Reorder selfie points
// @route   PUT /api/selfie-points/reorder
// @access  Private/Admin
export const reorderSelfiePoints = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      SelfiePoint.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await SelfiePoint.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering selfie points');
  }
});

// @desc    Toggle selfie point active status
// @route   PATCH /api/selfie-points/:id/toggle
// @access  Private/Admin
export const toggleSelfiePointStatus = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const selfiePoint = await SelfiePoint.findById(req.params.id);

  if (!selfiePoint) {
    res.status(404);
    throw new Error('Selfie point not found');
  }

  selfiePoint.isActive = !selfiePoint.isActive;
  await selfiePoint.save();

  res.json({
    success: true,
    data: selfiePoint,
  });
});
