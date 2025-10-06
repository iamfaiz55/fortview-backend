import { Request, Response } from 'express';
import Gallery, { IGallery } from '../models/Gallery';
import { uploadToCloudinary } from '../utils/cloudinary';

// Get all gallery items
export const getAllGalleryItems = async (req: Request, res: Response) => {
  try {
    const galleryItems = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Error fetching gallery items' });
  }
};

// Get active gallery items (same as all for now)
export const getActiveGalleryItems = async (req: Request, res: Response) => {
  try {
    const galleryItems = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Error fetching gallery items' });
  }
};

// Get gallery item by ID
export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findById(id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Error fetching gallery item' });
  }
};

// Create new gallery item
export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either image or video' });
    }

    // Validate that media is provided
    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    let mediaData;

    // Handle media upload
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'gallery');
      mediaData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (uploadError) {
      console.error('Error uploading media:', uploadError);
      return res.status(500).json({ message: 'Error uploading media' });
    }

    const newGalleryItem = new Gallery({
      type,
      media: mediaData,
      // order will be auto-incremented by pre-save hook
    });

    const savedGalleryItem = await newGalleryItem.save();
    res.status(201).json(savedGalleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Error creating gallery item' });
  }
};

// Update gallery item
export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    
    const updateData: any = {};

    // Only update fields that are provided
    if (type) updateData.type = type;

    // Handle media upload if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'gallery');
        updateData.media = {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error('Error uploading media:', uploadError);
        return res.status(500).json({ message: 'Error uploading media' });
      }
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Error updating gallery item' });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findByIdAndDelete(id);

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Error deleting gallery item' });
  }
};


// Reorder gallery items
export const reorderGalleryItems = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order } objects

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    const updatePromises = items.map(({ id, order }: { id: string; order: number }) =>
      Gallery.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedItems = await Gallery.find().sort({ order: 1, createdAt: -1 });

    res.json(updatedItems);
  } catch (error) {
    console.error('Error reordering gallery items:', error);
    res.status(500).json({ message: 'Error reordering gallery items' });
  }
};
