import asyncHandler from 'express-async-handler';
import Carousel from '../models/Carousel';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any; // Changed to any to match Passport user object
}

// @desc    Get all carousel items
// @route   GET /api/carousel
// @access  Public
export const getCarouselItems = asyncHandler(async (req, res) => {
  const { active } = req.query;
  
  let query = {};
  if (active === 'true') {
    query = { isActive: true };
  }

  const carousels = await Carousel.find(query)
    .sort({ order: 1 })
    .select('-__v');

  res.json({
    success: true,
    count: carousels.length,
    data: carousels,
  });
});

// @desc    Get single carousel item
// @route   GET /api/carousel/:id
// @access  Public
export const getCarouselItem = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findById(req.params.id).select('-__v');

  if (!carousel) {
    res.status(404);
    throw new Error('Carousel item not found');
  }

  res.json({
    success: true,
    data: carousel,
  });
});

// @desc    Create new carousel item
// @route   POST /api/carousel
// @access  Private/Admin
export const createCarouselItem = asyncHandler(async (req: RequestWithUser, res) => {
  const { title, description, buttonText, buttonLink, order } = req.body;

  // Check if files are uploaded
  if (!req.files || !('desktopImage' in req.files) || !('mobileImage' in req.files)) {
    res.status(400);
    throw new Error('Desktop and mobile images are required');
  }

  const desktopFile = req.files['desktopImage'][0];
  const mobileFile = req.files['mobileImage'][0];

  if (!desktopFile || !mobileFile) {
    res.status(400);
    throw new Error('Desktop and mobile images are required');
  }

  try {
    // Upload images to Cloudinary
    const [desktopResult, mobileResult] = await Promise.all([
      uploadToCloudinary(desktopFile.buffer, 'carousel/desktop'),
      uploadToCloudinary(mobileFile.buffer, 'carousel/mobile'),
    ]);

    // Get the next order number if not provided
    let itemOrder = order;
    if (!itemOrder) {
      const lastItem = await Carousel.findOne().sort({ order: -1 });
      itemOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const carousel = await Carousel.create({
      title,
      description,
      desktopImage: {
        url: desktopResult.secure_url,
        publicId: desktopResult.public_id,
      },
      mobileImage: {
        url: mobileResult.secure_url,
        publicId: mobileResult.public_id,
      },
      buttonText,
      buttonLink,
      order: itemOrder,
    });

    res.status(201).json({
      success: true,
      data: carousel,
    });
  } catch (error: any) {
    // Clean up uploaded images if database save fails
    if (desktopFile && desktopFile.buffer) {
      try {
        await deleteFromCloudinary(desktopFile.buffer.toString());
      } catch (cleanupError) {
        console.error('Error cleaning up desktop image:', cleanupError);
      }
    }
    if (mobileFile && mobileFile.buffer) {
      try {
        await deleteFromCloudinary(mobileFile.buffer.toString());
      } catch (cleanupError) {
        console.error('Error cleaning up mobile image:', cleanupError);
      }
    }
    
    res.status(500);
    throw new Error('Error uploading images or saving carousel item');
  }
});

// @desc    Update carousel item
// @route   PUT /api/carousel/:id
// @access  Private/Admin
export const updateCarouselItem = asyncHandler(async (req: RequestWithUser, res) => {
  const carousel = await Carousel.findById(req.params.id);

  if (!carousel) {
    res.status(404);
    throw new Error('Carousel item not found');
  }

  const { title, description, buttonText, buttonLink, order, isActive } = req.body;

  // Update basic fields
  if (title) carousel.title = title;
  if (description) carousel.description = description;
  if (buttonText !== undefined) carousel.buttonText = buttonText;
  if (buttonLink !== undefined) carousel.buttonLink = buttonLink;
  if (order !== undefined) carousel.order = order;
  if (isActive !== undefined) carousel.isActive = isActive;

  // Handle image updates
  if (req.files) {
    try {
      // Update desktop image if provided
      if ('desktopImage' in req.files && req.files['desktopImage'][0]) {
        const desktopFile = req.files['desktopImage'][0];
        
        // Delete old desktop image
        await deleteFromCloudinary(carousel.desktopImage.publicId);
        
        // Upload new desktop image
        const desktopResult = await uploadToCloudinary(desktopFile.buffer, 'carousel/desktop');
        carousel.desktopImage = {
          url: desktopResult.secure_url,
          publicId: desktopResult.public_id,
        };
      }

      // Update mobile image if provided
      if ('mobileImage' in req.files && req.files['mobileImage'][0]) {
        const mobileFile = req.files['mobileImage'][0];
        
        // Delete old mobile image
        await deleteFromCloudinary(carousel.mobileImage.publicId);
        
        // Upload new mobile image
        const mobileResult = await uploadToCloudinary(mobileFile.buffer, 'carousel/mobile');
        carousel.mobileImage = {
          url: mobileResult.secure_url,
          publicId: mobileResult.public_id,
        };
      }
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating images');
    }
  }

  await carousel.save();

  res.json({
    success: true,
    data: carousel,
  });
});

// @desc    Delete carousel item
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
export const deleteCarouselItem = asyncHandler(async (req: RequestWithUser, res) => {
  const carousel = await Carousel.findById(req.params.id);

  if (!carousel) {
    res.status(404);
    throw new Error('Carousel item not found');
  }

  try {
    // Delete images from Cloudinary
    await Promise.all([
      deleteFromCloudinary(carousel.desktopImage.publicId),
      deleteFromCloudinary(carousel.mobileImage.publicId),
    ]);

    // Delete from database
    await Carousel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Carousel item deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting carousel item');
  }
});

// @desc    Reorder carousel items
// @route   PUT /api/carousel/reorder
// @access  Private/Admin
export const reorderCarouselItems = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      Carousel.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedCarousels = await Carousel.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedCarousels,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering carousel items');
  }
});
