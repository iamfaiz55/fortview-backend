import express from 'express';
import {
  getSelfiePoints,
  getSelfiePoint,
  createSelfiePoint,
  updateSelfiePoint,
  deleteSelfiePoint,
  reorderSelfiePoints,
  toggleSelfiePointStatus,
} from '../controllers/selfiePointController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const selfiePointRouter = express.Router();

// Public routes
selfiePointRouter.get('/', getSelfiePoints);
selfiePointRouter.get('/:id', getSelfiePoint);

// Protected routes (Admin only)
selfiePointRouter.post('/', protect, upload.single('image'), createSelfiePoint);
selfiePointRouter.put('/:id', protect, upload.single('image'), updateSelfiePoint);
selfiePointRouter.delete('/:id', protect, deleteSelfiePoint);
selfiePointRouter.put('/reorder', protect, reorderSelfiePoints);
selfiePointRouter.patch('/:id/toggle', protect, toggleSelfiePointStatus);

export default selfiePointRouter;
