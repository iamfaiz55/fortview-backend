import express from 'express';
import { registerUser, loginUser, getMe, verifyToken } from '../controllers/authController';
import { protect } from '../middleware/auth';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', protect, getMe);
authRouter.get('/verify', protect, verifyToken);

export default authRouter;