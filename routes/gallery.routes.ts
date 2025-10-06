import express from 'express';
import {
  getAllGalleryItems,
  getActiveGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems
} from '../controllers/galleryController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveGalleryItems);

// Protected routes (authentication required)
router.get('/',  getAllGalleryItems);
router.get('/:id',  getGalleryItemById);
router.post('/', protect, upload.single('media'), createGalleryItem);
router.put('/:id', protect, upload.single('media'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);
router.patch('/reorder', protect, reorderGalleryItems);

export default router;
