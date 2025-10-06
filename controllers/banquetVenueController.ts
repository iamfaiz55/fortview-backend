import { Request, Response } from 'express';
import BanquetVenue, { IBanquetVenue } from '../models/BanquetVenue';
import { uploadToCloudinary } from '../utils/cloudinary';

// Get all banquet venues
export const getAllBanquetVenues = async (req: Request, res: Response) => {
  try {
    const venues = await BanquetVenue.find().sort({ order: 1, createdAt: -1 });
    res.json(venues);
  } catch (error) {
    console.error('Error fetching banquet venues:', error);
    res.status(500).json({ message: 'Error fetching banquet venues' });
  }
};

// Get active banquet venues
export const getActiveBanquetVenues = async (req: Request, res: Response) => {
  try {
    const venues = await BanquetVenue.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(venues);
  } catch (error) {
    console.error('Error fetching active banquet venues:', error);
    res.status(500).json({ message: 'Error fetching active banquet venues' });
  }
};

// Get banquet venue by ID
export const getBanquetVenueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const venue = await BanquetVenue.findById(id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Banquet venue not found' });
    }
    
    res.json(venue);
  } catch (error) {
    console.error('Error fetching banquet venue:', error);
    res.status(500).json({ message: 'Error fetching banquet venue' });
  }
};

// Create new banquet venue
export const createBanquetVenue = async (req: Request, res: Response) => {
  try {
    const {
      title,
      capacity,
      area,
      ac,
      description,
      features,
      pricing,
      location,
      isActive,
      order
    } = req.body;

    // Validate required fields
    if (!title || !capacity || !area || !ac || !description) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    let images: Array<{ url: string; publicId: string }> = [];

    // Handle multiple image uploads
    if (req.files && Array.isArray(req.files)) {
      try {
        const uploadPromises = req.files.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.buffer, 'banquet-venues')
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        images = uploadResults.map(result => ({
          url: result.secure_url,
          publicId: result.public_id
        }));
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        return res.status(500).json({ message: 'Error uploading images' });
      }
    }

    // Parse features and pricing if they are strings
    let parsedFeatures = features;
    let parsedPricing = pricing;

    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(f => f.trim());
      }
    }

    if (typeof pricing === 'string') {
      try {
        parsedPricing = JSON.parse(pricing);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    const newVenue = new BanquetVenue({
      title,
      capacity,
      area,
      ac,
      description,
      images,
      features: parsedFeatures,
      pricing: parsedPricing,
      location,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    const savedVenue = await newVenue.save();
    res.status(201).json(savedVenue);
  } catch (error) {
    console.error('Error creating banquet venue:', error);
    res.status(500).json({ message: 'Error creating banquet venue' });
  }
};

// Update banquet venue
export const updateBanquetVenue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle multiple image uploads
    if (req.files && Array.isArray(req.files)) {
      try {
        const uploadPromises = req.files.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.buffer, 'banquet-venues')
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        const newImages = uploadResults.map(result => ({
          url: result.secure_url,
          publicId: result.public_id
        }));

        // If there are existing images, append new ones
        if (updateData.existingImages) {
          const existingImages = JSON.parse(updateData.existingImages);
          updateData.images = [...existingImages, ...newImages];
        } else {
          updateData.images = newImages;
        }
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        return res.status(500).json({ message: 'Error uploading images' });
      }
    }

    // Parse features and pricing if they are strings
    if (updateData.features && typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = updateData.features.split(',').map((f: any) => f.trim());
      }
    }

    if (updateData.pricing && typeof updateData.pricing === 'string') {
      try {
        updateData.pricing = JSON.parse(updateData.pricing);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    const venue = await BanquetVenue.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!venue) {
      return res.status(404).json({ message: 'Banquet venue not found' });
    }

    res.json(venue);
  } catch (error) {
    console.error('Error updating banquet venue:', error);
    res.status(500).json({ message: 'Error updating banquet venue' });
  }
};

// Delete banquet venue
export const deleteBanquetVenue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const venue = await BanquetVenue.findByIdAndDelete(id);

    if (!venue) {
      return res.status(404).json({ message: 'Banquet venue not found' });
    }

    res.json({ message: 'Banquet venue deleted successfully' });
  } catch (error) {
    console.error('Error deleting banquet venue:', error);
    res.status(500).json({ message: 'Error deleting banquet venue' });
  }
};

// Toggle banquet venue active status
export const toggleBanquetVenueStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const venue = await BanquetVenue.findById(id);

    if (!venue) {
      return res.status(404).json({ message: 'Banquet venue not found' });
    }

    venue.isActive = !venue.isActive;
    await venue.save();

    res.json(venue);
  } catch (error) {
    console.error('Error toggling banquet venue status:', error);
    res.status(500).json({ message: 'Error toggling banquet venue status' });
  }
};

// Reorder banquet venues
export const reorderBanquetVenues = async (req: Request, res: Response) => {
  try {
    const { venues } = req.body; // Array of { id, order } objects

    if (!Array.isArray(venues)) {
      return res.status(400).json({ message: 'Venues must be an array' });
    }

    const updatePromises = venues.map(({ id, order }: { id: string; order: number }) =>
      BanquetVenue.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedVenues = await BanquetVenue.find().sort({ order: 1, createdAt: -1 });

    res.json(updatedVenues);
  } catch (error) {
    console.error('Error reordering banquet venues:', error);
    res.status(500).json({ message: 'Error reordering banquet venues' });
  }
};
