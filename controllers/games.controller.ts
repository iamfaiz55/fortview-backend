import asyncHandler from 'express-async-handler';
import Game from '../models/Game';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { Request, Response } from 'express';
// import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: any;
  file?: Express.Multer.File;
}

// @desc    Get all games
// @route   GET /api/games
// @access  Public
export const getGames = asyncHandler(async (req: Request, res: Response) => {
  const { active, category, upcoming, page = 1, limit = 12 } = req.query;

  let query: any = {};
  if (active === 'true') query.isActive = true;
  if (upcoming === 'true') query.isUpcoming = true;
  if (category) query.categories = category;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const totalCount = await Game.countDocuments(query);

  const games = await Game.find(query)
    .sort({ order: 1, createdAt: -1 })
    .select('-__v')
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalPages = Math.ceil(totalCount / limitNum);

  res.json({
    success: true,
    data: games,
    count: games.length,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalCount,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      limit: limitNum,
    },
  });
});

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
export const getGame = asyncHandler(async (req: Request, res: Response) => {
  const game = await Game.findById(req.params.id).select('-__v');
  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }
  res.json({ success: true, data: game });
});

// @desc    Create new game
// @route   POST /api/games
// @access  Private/Admin
export const createGame = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { title, description, categories, isActive, isUpcoming } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  // Parse categories array from FormData
  let categoriesArr: string[] = [];
  if (categories) {
    if (Array.isArray(categories)) {
      categoriesArr = categories;
    } else if (typeof categories === 'string') {
      try {
        categoriesArr = JSON.parse(categories);
      } catch {
        categoriesArr = [categories];
      }
    }
  } else {
    // Handle categories[0], categories[1], etc.
    const arr: string[] = [];
    let idx = 0;
    while (req.body[`categories[${idx}]`]) {
      arr.push(req.body[`categories[${idx}]`]);
      idx++;
    }
    if (arr.length > 0) categoriesArr = arr;
  }

  try {
    const imageResult = await uploadToCloudinary(req.file.buffer, 'games');
    const game = await Game.create({
      title,
      description,
      categories: categoriesArr.length ? categoriesArr : ['common'],
      isActive: isActive !== undefined ? isActive : true,
      isUpcoming: isUpcoming !== undefined ? isUpcoming : false,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      },
    });

    res.status(201).json({ success: true, data: game });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error uploading image or saving game');
  }
});

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private/Admin
export const updateGame = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  const { title, description, categories, isActive, isUpcoming } = req.body;

  // Parse categories array from FormData
  let categoriesArr: string[] | undefined = undefined;
  if (categories) {
    if (Array.isArray(categories)) {
      categoriesArr = categories;
    } else if (typeof categories === 'string') {
      try {
        categoriesArr = JSON.parse(categories);
      } catch {
        categoriesArr = [categories];
      }
    }
  } else {
    const arr: string[] = [];
    let idx = 0;
    while (req.body[`categories[${idx}]`]) {
      arr.push(req.body[`categories[${idx}]`]);
      idx++;
    }
    if (arr.length > 0) categoriesArr = arr;
  }

  if (title) game.title = title;
  if (description) game.description = description;
  if (categoriesArr) game.categories = categoriesArr;
  if (isActive !== undefined) game.isActive = isActive;
  if (isUpcoming !== undefined) game.isUpcoming = isUpcoming;

  // Handle image update
  if (req.file) {
    try {
      await deleteFromCloudinary(game.image.publicId);
      const imageResult = await uploadToCloudinary(req.file.buffer, 'games');
      game.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
      };
    } catch (error: any) {
      res.status(500);
      throw new Error('Error updating image');
    }
  }

  await game.save();
  res.json({ success: true, data: game });
});

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private/Admin
export const deleteGame = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  try {
    await deleteFromCloudinary(game.image.publicId);
    await Game.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Game deleted successfully' });
  } catch (error: any) {
    res.status(500);
    throw new Error('Error deleting game');
  }
});

// @desc    Toggle game active status
// @route   PATCH /api/games/:id/toggle
// @access  Private/Admin
export const toggleGameStatus = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }
  game.isActive = !game.isActive;
  await game.save();
  res.json({ success: true, data: game });
});