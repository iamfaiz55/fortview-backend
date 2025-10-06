import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// Get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ order: 1, date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Get active events (for public display)
export const getActiveEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ order: 1, date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({ message: 'Error fetching active events' });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      price,
      capacity,
      category,
      isActive
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category) {
      return res.status(400).json({ message: 'Title, description, date, time, location, and category are required' });
    }

    // Validate that image is provided
    if (!req.file) {
      return res.status(400).json({ message: 'Event image is required' });
    }

    let imageData;

    // Handle image upload
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'events');
      imageData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      return res.status(500).json({ message: 'Error uploading image' });
    }

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      image: imageData,
      price: price ? parseFloat(price) : undefined,
      capacity: capacity ? parseInt(capacity) : undefined,
      category,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      price,
      capacity,
      category,
      isActive
    } = req.body;
    
    const updateData: any = {};

    // Only update fields that are provided
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (location) updateData.location = location;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (category) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image upload if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'events');
        updateData.image = {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error('Error uploading new image:', uploadError);
        return res.status(500).json({ message: 'Error uploading new image' });
      }
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete from Cloudinary
    if (event.image.publicId) {
      await deleteFromCloudinary(event.image.publicId);
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

// Toggle event active status
export const toggleEventStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.json(event);
  } catch (error) {
    console.error('Error toggling event status:', error);
    res.status(500).json({ message: 'Error toggling event status' });
  }
};

// Reorder events
export const reorderEvents = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order } objects

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    const updatePromises = items.map(({ id, order }: { id: string; order: number }) =>
      Event.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedEvents = await Event.find().sort({ order: 1, date: 1 });

    res.json(updatedEvents);
  } catch (error) {
    console.error('Error reordering events:', error);
    res.status(500).json({ message: 'Error reordering events' });
  }
};
