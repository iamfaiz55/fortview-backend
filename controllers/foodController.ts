import asyncHandler from 'express-async-handler';
import Food from '../models/Food';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
export const getFoods = asyncHandler(async (req: Request, res: Response) => {
  const { active, category, page = 1, limit = 12 } = req.query;

  let query: any = {};
  
  if (active === 'true') {
    query.isActive = true;
  }
  
  if (category) {
    query.category = category;
  }

  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination info
  const totalCount = await Food.countDocuments(query);

  // Get paginated results
  const foods = await Food.find(query)
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
    data: foods,
    count: foods.length,
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

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
export const getFood = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.findById(req.params.id).select('-__v');

  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const response = {
    success: true,
    data: food,
  };

  res.json(response);
});

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { 
    name, 
    description, 
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
    const imageResult = await uploadToCloudinary(req.file.buffer, 'foods');

    // Get the next order number if not provided
    let foodOrder = order;
    if (!foodOrder && foodOrder !== 0) {
      const lastFood = await Food.findOne().sort({ order: -1 });
      foodOrder = lastFood ? lastFood.order + 1 : 1;
    }

    const food = await Food.create({
      name,
      description,
      category,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: foodOrder,
    });

    res.status(201).json({
      success: true,
      data: food,
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
    throw new Error('Error uploading image or saving food');
  }
});

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const { 
    name, 
    description, 
    category, 
    order,
    isActive 
  } = req.body;

  // Update basic fields
  if (name) food.name = name;
  if (description !== undefined) food.description = description;
  if (category) food.category = category;
  if (order !== undefined) food.order = order;
  if (isActive !== undefined) food.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image
      await deleteFromCloudinary(food.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'foods');
      food.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await food.save();
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
    data: food,
  });
});

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  try {
    // Delete image from Cloudinary
    await deleteFromCloudinary(food.image.publicId);

    // Delete from database
    await Food.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Food deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting food');
  }
});

// @desc    Reorder foods
// @route   PUT /api/foods/reorder
// @access  Private/Admin
export const reorderFoods = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      Food.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await Food.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering foods');
  }
});

// @desc    Toggle food active status
// @route   PATCH /api/foods/:id/toggle
// @access  Private/Admin
export const toggleFoodStatus = asyncHandler(async (req: RequestWithUser, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  food.isActive = !food.isActive;
  await food.save();

  res.json({
    success: true,
    data: food,
  });
});
