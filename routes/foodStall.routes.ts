import express from 'express';
import { 
  getFoodStalls, 
  getFoodStall, 
  createFoodStall, 
  updateFoodStall, 
  deleteFoodStall, 
  reorderFoodStalls,
  toggleFoodStallStatus 
} from '../controllers/foodStallController';
import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';

const foodStallRouter = express.Router();

// Public routes
foodStallRouter.get('/', getFoodStalls);
foodStallRouter.get('/:id', getFoodStall);

// Protected admin routes
foodStallRouter.post('/', protect, admin, upload.single('image'), createFoodStall);
foodStallRouter.put('/:id', protect, admin, upload.single('image'), updateFoodStall);
foodStallRouter.delete('/:id', protect, admin, deleteFoodStall);
foodStallRouter.put('/reorder', protect, admin, reorderFoodStalls);
foodStallRouter.patch('/:id/toggle', protect, admin, toggleFoodStallStatus);

export default foodStallRouter;
