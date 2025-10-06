import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = asyncHandler(async (req: Request, res: Response) => {
  const { active, category, difficulty, page = 1, limit = 12 } = req.query;
  
  // Generate cache key
  const cacheKey = CacheService.generateKey(CACHE_KEYS.ACTIVITIES, {
    active,
    category,
    difficulty,
    page,
    limit
  });

  // Try to get from cache first
  const cachedData = await CacheService.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  let query: any = {};
  
  if (active === 'true') {
    query.isActive = true;
  }
  
  if (category) {
    query.category = category;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination info
  const totalCount = await Activity.countDocuments(query);

  // Get paginated results
  const activities = await Activity.find(query)
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
    data: activities,
    count: activities.length,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalCount,
      hasNextPage,
      hasPrevPage,
      limit: limitNum
    }
  };

  // Cache the response
  await CacheService.set(cacheKey, response, CACHE_TTL.ACTIVITIES);

  res.json(response);
});

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivity = asyncHandler(async (req: Request, res: Response) => {
  // Generate cache key
  const cacheKey = CacheService.generateKey(`${CACHE_KEYS.ACTIVITY}:${req.params.id}`);

  // Try to get from cache first
  const cachedData = await CacheService.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  const activity = await Activity.findById(req.params.id).select('-__v');

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  const response = {
    success: true,
    data: activity,
  };

  // Cache the response
  await CacheService.set(cacheKey, response, CACHE_TTL.ACTIVITIES);

  res.json(response);
});

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private/Admin
export const createActivity = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { 
    title, 
    description, 
    detailedDescription, 
    category, 
    duration,
    difficulty,
    ageGroup,
    rating, 
    icon,
    order 
  } = req.body;

  // Handle features array from FormData
  let features: string[] = [];
  if (req.body.features) {
    if (Array.isArray(req.body.features)) {
      features = req.body.features;
    } else if (typeof req.body.features === 'string') {
      try {
        features = JSON.parse(req.body.features);
      } catch {
        features = [req.body.features];
      }
    }
  } else {
    // Handle features[0], features[1], etc. format
    const featuresArray: string[] = [];
    let index = 0;
    while (req.body[`features[${index}]`]) {
      featuresArray.push(req.body[`features[${index}]`]);
      index++;
    }
    if (featuresArray.length > 0) {
      features = featuresArray;
    }
  }

  // Check if image is uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.file.buffer, 'activities');

    // Get the next order number if not provided
    let activityOrder = order;
    if (!activityOrder && activityOrder !== 0) {
      const lastActivity = await Activity.findOne().sort({ order: -1 });
      activityOrder = lastActivity ? lastActivity.order + 1 : 1;
    }

    const activity = await Activity.create({
      title,
      description,
      detailedDescription,
      category,
      duration,
      difficulty,
      ageGroup,
      features: features || [],
      rating: rating ? parseFloat(rating) : undefined,
      icon,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: activityOrder,
    });

    // Invalidate cache
    await CacheService.delPattern(`${CACHE_KEYS.ACTIVITIES}*`);

    res.status(201).json({
      success: true,
      data: activity,
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
    throw new Error('Error uploading image or saving activity');
  }
});

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
export const updateActivity = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  const { 
    title, 
    description, 
    detailedDescription, 
    category, 
    duration,
    difficulty,
    ageGroup,
    rating, 
    icon,
    order,
    isActive 
  } = req.body;

  // Handle features array from FormData
  let features: string[] | undefined = undefined;
  if (req.body.features) {
    if (Array.isArray(req.body.features)) {
      features = req.body.features;
    } else if (typeof req.body.features === 'string') {
      try {
        features = JSON.parse(req.body.features);
      } catch {
        features = [req.body.features];
      }
    }
  } else {
    // Handle features[0], features[1], etc. format
    const featuresArray: string[] = [];
    let index = 0;
    while (req.body[`features[${index}]`]) {
      featuresArray.push(req.body[`features[${index}]`]);
      index++;
    }
    if (featuresArray.length > 0) {
      features = featuresArray;
    }
  }

  // Update basic fields
  if (title) activity.title = title;
  if (description) activity.description = description;
  if (detailedDescription) activity.detailedDescription = detailedDescription;
  if (category) activity.category = category;
  if (duration) activity.duration = duration;
  if (difficulty) activity.difficulty = difficulty;
  if (ageGroup) activity.ageGroup = ageGroup;
  if (features) activity.features = features;
  if (rating !== undefined) activity.rating = parseFloat(rating);
  if (icon) activity.icon = icon;
  if (order !== undefined) activity.order = order;
  if (isActive !== undefined) activity.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image
      await deleteFromCloudinary(activity.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'activities');
      activity.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await activity.save();
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    throw error;
  }

  // Invalidate cache
  await CacheService.delPattern(`${CACHE_KEYS.ACTIVITIES}*`);

  res.json({
    success: true,
    data: activity,
  });
});

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
export const deleteActivity = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  try {
    // Delete image from Cloudinary
    await deleteFromCloudinary(activity.image.publicId);

    // Delete from database
    await Activity.findByIdAndDelete(req.params.id);

    // Invalidate cache
    await CacheService.delPattern(`${CACHE_KEYS.ACTIVITIES}*`);

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error deleting activity');
  }
});

// @desc    Reorder activities
// @route   PUT /api/activities/reorder
// @access  Private/Admin
export const reorderActivities = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      Activity.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await Activity.find()
      .sort({ order: 1 })
      .select('-__v');

    // Invalidate cache
    await CacheService.delPattern(`${CACHE_KEYS.ACTIVITIES}*`);

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error reordering activities');
  }
});

// @desc    Toggle activity active status
// @route   PATCH /api/activities/:id/toggle
// @access  Private/Admin
export const toggleActivityStatus = asyncHandler(async (req: RequestWithUser, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  activity.isActive = !activity.isActive;
  await activity.save();

  // Invalidate cache
  await CacheService.delPattern(`${CACHE_KEYS.ACTIVITIES}*`);

  res.json({
    success: true,
    data: activity,
  });
});
