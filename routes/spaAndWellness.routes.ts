import express from 'express';

import { protect } from '../middleware/auth';
import upload from '../middleware/upload';
import { createSpaWellnessItem, deleteSpaWellnessItem, getSpaWellnessItem, getSpaWellnessItems, reorderSpaWellnessItems, updateSpaWellnessItem } from '../controllers/spaAndWellness.controller';

const spaWellnessRouter = express.Router();

// Public routes
spaWellnessRouter.get('/', getSpaWellnessItems);
spaWellnessRouter.get('/:id', getSpaWellnessItem);

// Protected routes (Admin only)
spaWellnessRouter.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
]), createSpaWellnessItem);

spaWellnessRouter.put('/:id', protect, upload.fields([
  { name: 'image', maxCount: 1 },
]), updateSpaWellnessItem);

spaWellnessRouter.delete('/:id', protect, deleteSpaWellnessItem);

spaWellnessRouter.put('/reorder', protect, reorderSpaWellnessItems);

export default spaWellnessRouter;