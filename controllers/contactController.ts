import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Contact from '../models/Contact';

// @desc    Create contact submission
// @route   POST /api/contacts
// @access  Public
export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, mobile, message } = req.body as {
    name?: string; email?: string; mobile?: string; message?: string;
  };

  if (!name || !email || !mobile || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const contact = await Contact.create({ name, email, mobile, message });
  res.status(201).json({ success: true, data: contact });
});

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json(contacts);
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  await contact.deleteOne();
  res.json({ success: true });
});


