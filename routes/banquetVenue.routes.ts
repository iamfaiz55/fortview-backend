import express from 'express';
import {
  getAllBanquetVenues,
  getActiveBanquetVenues,
  getBanquetVenueById,
  createBanquetVenue,
  updateBanquetVenue,
  deleteBanquetVenue,
  toggleBanquetVenueStatus,
  reorderBanquetVenues
} from '../controllers/banquetVenueController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveBanquetVenues);

// Protected routes (authentication required)
router.get('/', protect, getAllBanquetVenues);
router.get('/:id', protect, getBanquetVenueById);
router.post('/', protect, upload.array('images', 10), createBanquetVenue);
router.put('/:id', protect, upload.array('images', 10), updateBanquetVenue);
router.delete('/:id', protect, deleteBanquetVenue);
router.patch('/:id/toggle', protect, toggleBanquetVenueStatus);
router.patch('/reorder', protect, reorderBanquetVenues);

export default router;
