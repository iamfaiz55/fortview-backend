import express from 'express';
import {
  getAllOffers,
  getActiveOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  reorderOffers
} from '../controllers/offerController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';
// import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveOffers);

// Protected routes (authentication required)
router.get('/', protect, getAllOffers);
router.get('/:id', protect, getOfferById);
router.post('/', protect, upload.single('image'), createOffer);
router.put('/:id', protect, upload.single('image'), updateOffer);
router.delete('/:id', protect, deleteOffer);
router.patch('/:id/toggle', protect, toggleOfferStatus);
router.patch('/reorder', protect, reorderOffers);

export default router;
