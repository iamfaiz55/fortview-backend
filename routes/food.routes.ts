import express from 'express';
import { 
  getFoods, 
  getFood, 
  createFood, 
  updateFood, 
  deleteFood, 
  reorderFoods,
  toggleFoodStatus 
} from '../controllers/foodController';
import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';

const foodRouter = express.Router();

// Public routes
foodRouter.get('/', getFoods);
foodRouter.get('/:id', getFood);

// Protected admin routes
foodRouter.post('/', protect, admin, upload.single('image'), createFood);
foodRouter.put('/:id', protect, admin, upload.single('image'), updateFood);
foodRouter.delete('/:id', protect, admin, deleteFood);
foodRouter.put('/reorder', protect, admin, reorderFoods);
foodRouter.patch('/:id/toggle', protect, admin, toggleFoodStatus);

export default foodRouter;
