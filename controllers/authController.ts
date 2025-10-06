import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateToken } from '../utils/auth';

import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any; // Changed to any to match Passport user object
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
console.log("name, email, password", name, email, password);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: 'admin', // For now, all registered users are admins
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({message:"login success",user:{
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,},
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req:RequestWithUser, res):Promise<any> => {
  // req.user is now the full user object from Passport, no need to query database
  res.json(req.user);
});

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = asyncHandler(async (req:RequestWithUser, res) => {
  // req.user is now the full user object from Passport
  if (req.user) {
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});