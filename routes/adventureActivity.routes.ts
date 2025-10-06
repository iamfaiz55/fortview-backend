import express from 'express';
import {
  getAdventureActivities,
  getAdventureActivity,
  createAdventureActivity,
  updateAdventureActivity,
  deleteAdventureActivity,
  toggleAdventureActivityStatus,
  reorderAdventureActivities,
  getAdventureActivityStats
} from '../controllers/adventureActivityController';
// import { authenticateToken } from '../middleware/auth';
import upload from '../middleware/upload';
import { protect } from '../middleware/auth';
// import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAdventureActivities);
router.get('/stats', getAdventureActivityStats);
router.get('/:id', getAdventureActivity);

// Protected routes (authentication required)
router.post('/', protect, upload.single('image'), createAdventureActivity);
router.put('/:id', protect, upload.single('image'), updateAdventureActivity);
router.delete('/:id', protect, deleteAdventureActivity);
router.patch('/:id/toggle', protect, toggleAdventureActivityStatus);
router.put('/reorder', protect, reorderAdventureActivities);

export default router;
