import express from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  reorderActivities,
  toggleActivityStatus
} from '../controllers/activityController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';
// import { authenticateToken } from '../middleware/auth';
// import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getActivities);
router.get('/:id', getActivity);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createActivity);
router.put('/:id', protect, upload.single('image'), updateActivity);
router.delete('/:id', protect, deleteActivity);
router.put('/reorder', protect, reorderActivities);
router.patch('/:id/toggle', protect, toggleActivityStatus);

export default router;
