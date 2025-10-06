import asyncHandler from 'express-async-handler';
import FoodStall from '../models/FoodStall';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all food stalls
// @route   GET /api/food-stalls
// @access  Public
export const getFoodStalls = asyncHandler(async (req: Request, res: Response) => {
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
  const totalCount = await FoodStall.countDocuments(query);

  // Get paginated results
  const foodStalls = await FoodStall.find(query)
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
    data: foodStalls,
    count: foodStalls.length,
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

// @desc    Get single food stall
// @route   GET /api/food-stalls/:id
// @access  Public
export const getFoodStall = asyncHandler(async (req: Request, res: Response) => {
  const foodStall = await FoodStall.findById(req.params.id).select('-__v');

  if (!foodStall) {
    res.status(404);
    throw new Error('Food stall not found');
  }

  const response = {
    success: true,
    data: foodStall,
  };

  res.json(response);
});

// @desc    Create new food stall
// @route   POST /api/food-stalls
// @access  Private/Admin
export const createFoodStall = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { 
    title, 
    description, 
    location, 
    order 
  } = req.body;

  // Check if image is uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.file.buffer, 'food-stalls');

    // Get the next order number if not provided
    let stallOrder = order;
    if (!stallOrder && stallOrder !== 0) {
      const lastStall = await FoodStall.findOne().sort({ order: -1 });
      stallOrder = lastStall ? lastStall.order + 1 : 1;
    }

    const foodStall = await FoodStall.create({
      title,
      description,
      location,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: stallOrder,
    });

    res.status(201).json({
      success: true,
      data: foodStall,
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
    throw new Error('Error uploading image or saving food stall');
  }
});

// @desc    Update food stall
// @route   PUT /api/food-stalls/:id
// @access  Private/Admin
export const updateFoodStall = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const foodStall = await FoodStall.findById(req.params.id);

  if (!foodStall) {
    res.status(404);
    throw new Error('Food stall not found');
  }

  const { 
    title, 
    description, 
    location, 
    order,
    isActive 
  } = req.body;

  // Update basic fields
  if (title) foodStall.title = title;
  if (description !== undefined) foodStall.description = description;
  if (location !== undefined) foodStall.location = location;
  if (order !== undefined) foodStall.order = order;
  if (isActive !== undefined) foodStall.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image
      await deleteFromCloudinary(foodStall.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'food-stalls');
      foodStall.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await foodStall.save();
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
    data: foodStall,
  });
});

// @desc    Delete food stall
// @route   DELETE /api/food-stalls/:id
// @access  Private/Admin
export const deleteFoodStall = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const foodStall = await FoodStall.findById(req.params.id);

  if (!foodStall) {
    res.status(404);
    throw new Error('Food stall not found');
  }

  try {
    // Delete image from Cloudinary
    await deleteFromCloudinary(foodStall.image.publicId);

    // Delete from database
    await FoodStall.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Food stall deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting food stall');
  }
});

// @desc    Reorder food stalls
// @route   PUT /api/food-stalls/reorder
// @access  Private/Admin
export const reorderFoodStalls = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      FoodStall.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await FoodStall.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering food stalls');
  }
});

// @desc    Toggle food stall active status
// @route   PATCH /api/food-stalls/:id/toggle
// @access  Private/Admin
export const toggleFoodStallStatus = asyncHandler(async (req: RequestWithUser, res) => {
  const foodStall = await FoodStall.findById(req.params.id);

  if (!foodStall) {
    res.status(404);
    throw new Error('Food stall not found');
  }

  foodStall.isActive = !foodStall.isActive;
  await foodStall.save();

  res.json({
    success: true,
    data: foodStall,
  });
});
