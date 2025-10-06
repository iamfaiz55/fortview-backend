import asyncHandler from 'express-async-handler';
import HomeGalleryItem from '../models/HomeGallerySection';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all gallery items
// @route   GET /api/home-gallery
// @access  Public
export const getGalleryItems = asyncHandler(async (req:Request, res:Response) => {
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
  const totalCount = await HomeGalleryItem.countDocuments(query);

  // Get paginated results
  const galleryItems = await HomeGalleryItem.find(query)
    .sort({ order: 1, createdAt: -1 })
    .select('-__v')
    .skip(skip)
    .limit(limitNum)
    .lean(); // Use lean() for better performance
console.log("galleryItems",galleryItems )
  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  const response = {
    success: true,
    data: galleryItems,
    count: galleryItems.length,
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
  // await CacheService.set(cacheKey, response, CACHE_TTL.GALLERY_ITEMS);

  res.json(response);
});

// @desc    Get single gallery item
// @route   GET /api/home-gallery/:id
// @access  Public
export const getGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  // Generate cache key
  // const cacheKey = CacheService.generateKey(`${CACHE_KEYS.GALLERY_ITEM}:${req.params.id}`);

  // Try to get from cache first
  // const cachedData = await CacheService.get(cacheKey);
  // if (cachedData) {
  //   res.json(cachedData);
  //   return;
  // }

  const galleryItem = await HomeGalleryItem.findById(req.params.id).select('-__v');

  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery item not found');
  }

  const response = {
    success: true,
    data: galleryItem,
  };

  // Cache the response
  // await CacheService.set(cacheKey, response, CACHE_TTL.GALLERY_ITEMS);

  res.json(response);
});

// @desc    Create new gallery item
// @route   POST /api/home-gallery
// @access  Private/Admin
export const createGalleryItem = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { 
    title, 
    description, 
    detailedDescription, 
    category, 
    capacity, 
    area, 
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
      // Handle case where features might be sent as JSON string
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
    const imageResult = await uploadToCloudinary(req.file.buffer, 'home-gallery');

    // Get the next order number if not provided
    let itemOrder = order;
    if (!itemOrder && itemOrder !== 0) {
      const lastItem = await HomeGalleryItem.findOne().sort({ order: -1 });
      itemOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const galleryItem = await HomeGalleryItem.create({
      title,
      description,
      detailedDescription,
      category,
      capacity,
      area,
      features: features || [],
      rating: rating ? parseFloat(rating) : undefined,
      icon,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: itemOrder,
    });

    // Invalidate cache
    // await CacheService.delPattern(`${CACHE_KEYS.GALLERY_ITEMS}*`);

    res.status(201).json({
      success: true,
      data: galleryItem,
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
    throw new Error('Error uploading image or saving gallery item');
  }
});

// @desc    Update gallery item
// @route   PUT /api/home-gallery/:id
// @access  Private/Admin
export const updateGalleryItem = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const galleryItem = await HomeGalleryItem.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery item not found');
  }

  const { 
    title, 
    description, 
    detailedDescription, 
    category, 
    capacity, 
    area, 
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
      // Handle case where features might be sent as JSON string
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
  if (title) galleryItem.title = title;
  if (description) galleryItem.description = description;
  if (detailedDescription) galleryItem.detailedDescription = detailedDescription;
  if (category) galleryItem.category = category;
  if (capacity) galleryItem.capacity = capacity;
  if (area) galleryItem.area = area;
  if (features) galleryItem.features = features;
  if (rating !== undefined) galleryItem.rating = parseFloat(rating);
  if (icon) galleryItem.icon = icon;
  if (order !== undefined) galleryItem.order = order;
  if (isActive !== undefined) galleryItem.isActive = isActive;

  // Handle image update
  if (req.file) {
    try {
      // Delete old image
      await deleteFromCloudinary(galleryItem.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer, 'home-gallery');
      galleryItem.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  try {
    await galleryItem.save();
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
    data: galleryItem,
  });
});

// @desc    Delete gallery item
// @route   DELETE /api/home-gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const galleryItem = await HomeGalleryItem.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery item not found');
  }

  try {
    // Delete image from Cloudinary
    await deleteFromCloudinary(galleryItem.image.publicId);

    // Delete from database
    await HomeGalleryItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting gallery item');
  }
});

// @desc    Reorder gallery items
// @route   PUT /api/home-gallery/reorder
// @access  Private/Admin
export const reorderGalleryItems = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      HomeGalleryItem.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await HomeGalleryItem.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering gallery items');
  }
});

// @desc    Toggle gallery item active status
// @route   PATCH /api/home-gallery/:id/toggle
// @access  Private/Admin
export const toggleGalleryItemStatus = asyncHandler(async (req: RequestWithUser, res) => {
  const galleryItem = await HomeGalleryItem.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery item not found');
  }

  galleryItem.isActive = !galleryItem.isActive;
  await galleryItem.save();

  res.json({
    success: true,
    data: galleryItem,
  });
});
