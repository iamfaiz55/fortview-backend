import express from 'express';

import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';
import { createGame, deleteGame, getGame, getGames, toggleGameStatus, updateGame } from '../controllers/games.controller';

const gameRouter = express.Router();

// Public routes
gameRouter.get('/', getGames);
gameRouter.get('/:id', getGame);

// Protected admin routes
gameRouter.post('/', protect, admin, upload.single('image'), createGame);
gameRouter.put('/:id', protect, admin, upload.single('image'), updateGame);
gameRouter.delete('/:id', protect, admin, deleteGame);
gameRouter.patch('/:id/toggle', protect, admin, toggleGameStatus);

export default gameRouter;