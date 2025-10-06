import express from 'express';
import { 
  getGalleryItems, 
  getGalleryItem, 
  createGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem, 
  reorderGalleryItems,
  toggleGalleryItemStatus 
} from '../controllers/homeGalleryController';
import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';
// import { upload } from '../middleware/upload';

const homeGalleryRouter = express.Router();

// Public routes
homeGalleryRouter.get('/', getGalleryItems);
homeGalleryRouter.get('/:id', getGalleryItem);

// Protected admin routes
homeGalleryRouter.post('/', protect, admin, upload.single('image'), createGalleryItem);
homeGalleryRouter.put('/:id', protect, admin, upload.single('image'), updateGalleryItem);
homeGalleryRouter.delete('/:id', protect, admin, deleteGalleryItem);
homeGalleryRouter.put('/reorder', protect, admin, reorderGalleryItems);
homeGalleryRouter.patch('/:id/toggle', protect, admin, toggleGalleryItemStatus);

export default homeGalleryRouter;
