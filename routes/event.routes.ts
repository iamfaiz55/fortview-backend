import express from 'express';
import {
  getAllEvents,
  getActiveEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  reorderEvents
} from '../controllers/eventController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveEvents);

// Protected routes (authentication required)
router.get('/', protect, getAllEvents);
router.get('/:id', protect, getEventById);
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.patch('/:id/toggle', protect, toggleEventStatus);
router.patch('/reorder', protect, reorderEvents);

export default router;
