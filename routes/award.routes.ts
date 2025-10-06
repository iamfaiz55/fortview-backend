import express from 'express';
import { 
  getAwards, 
  getAward, 
  createAward, 
  updateAward, 
  deleteAward, 
  reorderAwards,
  toggleAwardStatus 
} from '../controllers/awardController';
import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';

const awardRouter = express.Router();

// Public routes
awardRouter.get('/', getAwards);
awardRouter.get('/:id', getAward);

// Protected admin routes
awardRouter.post('/', protect, admin, upload.single('image'), createAward);
awardRouter.put('/:id', protect, admin, upload.single('image'), updateAward);
awardRouter.delete('/:id', protect, admin, deleteAward);
awardRouter.put('/reorder', protect, admin, reorderAwards);
awardRouter.patch('/:id/toggle', protect, admin, toggleAwardStatus);

export default awardRouter;
