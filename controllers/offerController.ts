import { Request, Response } from 'express';
import Offer, { IOffer } from '../models/Offer';
import { uploadToCloudinary } from '../utils/cloudinary';

// Get all offers
export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find().sort({ order: 1, createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Error fetching offers' });
  }
};

// Get active offers
export const getActiveOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching active offers:', error);
    res.status(500).json({ message: 'Error fetching active offers' });
  }
};

// Get offer by ID
export const getOfferById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Error fetching offer' });
  }
};

// Create new offer
export const createOffer = async (req: Request, res: Response) => {
  try {
    const { isActive, order } = req.body;

    // Validate that image is provided
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    let imageData;

    // Handle image upload
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'offers');
      imageData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      return res.status(500).json({ message: 'Error uploading image' });
    }

    const newOffer = new Offer({
      image: imageData,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Error creating offer' });
  }
};

// Update offer
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive, order } = req.body;
    const updateData: any = {};

    // Only update fields that are provided
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    // Handle image upload if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'offers');
        updateData.image = {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const offer = await Offer.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Error updating offer' });
  }
};

// Delete offer
export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Error deleting offer' });
  }
};

// Toggle offer active status
export const toggleOfferStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.json(offer);
  } catch (error) {
    console.error('Error toggling offer status:', error);
    res.status(500).json({ message: 'Error toggling offer status' });
  }
};

// Reorder offers
export const reorderOffers = async (req: Request, res: Response) => {
  try {
    const { offers } = req.body; // Array of { id, order } objects

    if (!Array.isArray(offers)) {
      return res.status(400).json({ message: 'Offers must be an array' });
    }

    const updatePromises = offers.map(({ id, order }: { id: string; order: number }) =>
      Offer.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedOffers = await Offer.find().sort({ order: 1, createdAt: -1 });

    res.json(updatedOffers);
  } catch (error) {
    console.error('Error reordering offers:', error);
    res.status(500).json({ message: 'Error reordering offers' });
  }
};
