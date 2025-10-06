import express from 'express';
import { getContacts, deleteContact, createContact } from '../controllers/contactController';
import { protect, admin } from '../middleware/auth';

const contactRouter = express.Router();

// Public create endpoint
contactRouter.post('/contacts', createContact);

// Admin endpoints
contactRouter.get('/contacts', protect, admin, getContacts);
contactRouter.delete('/contacts/:id', protect, admin, deleteContact);

export default contactRouter;


