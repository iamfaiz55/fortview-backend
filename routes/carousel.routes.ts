import express from 'express';
import {
  getCarouselItems,
  getCarouselItem,
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  reorderCarouselItems,
} from '../controllers/carouselController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';


const carouselRouter = express.Router();

// Public routes
carouselRouter.get('/', getCarouselItems);
carouselRouter.get('/:id', getCarouselItem);

// Protected routes (Admin only)
carouselRouter.post('/', protect, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), createCarouselItem);

carouselRouter.put('/:id', protect, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), updateCarouselItem);

carouselRouter.delete('/:id', protect, deleteCarouselItem);

carouselRouter.put('/reorder', protect, reorderCarouselItems);

export default carouselRouter;
