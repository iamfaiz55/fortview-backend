import asyncHandler from 'express-async-handler';
// import SpaWellness from '../models/SpaWellness.ts';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { Request } from 'express';
import SpaAndWellness from '../models/SpaAndWellness';

interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Get all spa & wellness items
// @route   GET /api/spa-wellness
// @access  Public
export const getSpaWellnessItems = asyncHandler(async (req, res) => {
  const { active } = req.query;

  let query = {};
  if (active === 'true') {
    query = { isActive: true };
  }

  const items = await SpaAndWellness.find(query)
    .sort({ order: 1 })
    .select('-__v');

  res.json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc    Get single spa & wellness item
// @route   GET /api/spa-wellness/:id
// @access  Public
export const getSpaWellnessItem = asyncHandler(async (req, res) => {
  const item = await SpaAndWellness.findById(req.params.id).select('-__v');

  if (!item) {
    res.status(404);
    throw new Error('Spa & Wellness item not found');
  }

  res.json({
    success: true,
    data: item,
  });
});

// @desc    Create new spa & wellness item
// @route   POST /api/spa-wellness
// @access  Private/Admin
export const createSpaWellnessItem = asyncHandler(async (req: RequestWithUser, res) => {
  const { name, description, location, services, contact, rating, order } = req.body;

  if (!req.files || !('image' in req.files)) {
    res.status(400);
    throw new Error('Image is required');
  }

  const imageFile = req.files['image'][0];

  if (!imageFile) {
    res.status(400);
    throw new Error('Image is required');
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(imageFile.buffer, 'spaWellness');

    // Get the next order number if not provided
    let itemOrder = order;
    if (!itemOrder) {
      const lastItem = await SpaAndWellness.findOne().sort({ order: -1 });
      itemOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const spaWellness = await SpaAndWellness.create({
      name,
      description,
      location,
      services,
      contact,
      rating,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
      order: itemOrder,
    });

    res.status(201).json({
      success: true,
      data: spaWellness,
    });
  } catch (error: any) {
    if (imageFile && imageFile.buffer) {
      try {
        await deleteFromCloudinary(imageFile.buffer.toString());
      } catch (cleanupError) {
        console.error('Error cleaning up image:', cleanupError);
      }
    }
    res.status(500);
    throw new Error('Error uploading image or saving spa & wellness item');
  }
});

// @desc    Update spa & wellness item
// @route   PUT /api/spa-wellness/:id
// @access  Private/Admin
export const updateSpaWellnessItem = asyncHandler(async (req: RequestWithUser, res) => {
  const item = await SpaAndWellness.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Spa & Wellness item not found');
  }

  const { name, description, location, services, contact, rating, order, isActive } = req.body;

  if (name) item.name = name;
  if (description) item.description = description;
  if (location) item.location = location;
  if (services) item.services = services;
  if (contact !== undefined) item.contact = contact;
  if (rating !== undefined) item.rating = rating;
  if (order !== undefined) item.order = order;
  if (isActive !== undefined) item.isActive = isActive;

  // Handle image update
  if (req.files && 'image' in req.files && req.files['image'][0]) {
    const imageFile = req.files['image'][0];
    try {
      await deleteFromCloudinary(item.image.publicId);
      const imageResult = await uploadToCloudinary(imageFile.buffer, 'spaWellness');
      item.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  await item.save();

  res.json({
    success: true,
    data: item,
  });
});

// @desc    Delete spa & wellness item
// @route   DELETE /api/spa-wellness/:id
// @access  Private/Admin
export const deleteSpaWellnessItem = asyncHandler(async (req: RequestWithUser, res) => {
  const item = await SpaAndWellness.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Spa & Wellness item not found');
  }

  try {
    await deleteFromCloudinary(item.image.publicId);
    await SpaAndWellness.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Spa & Wellness item deleted successfully',
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting spa & wellness item');
  }
});

// @desc    Reorder spa & wellness items
// @route   PUT /api/spa-wellness/reorder
// @access  Private/Admin
export const reorderSpaWellnessItems = asyncHandler(async (req: RequestWithUser, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  try {
    const updatePromises = items.map((item: { id: string; order: number }) =>
      SpaAndWellness.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    const updatedItems = await SpaAndWellness.find()
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error reordering spa & wellness items');
  }
});