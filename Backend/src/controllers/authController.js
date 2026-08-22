import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

// @route POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Directly try to create user
    const user = await User.create({ name, email, password });

    generateToken(res, user._id);

    logger.info({ userId: user._id }, 'New user registered');

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle duplicate key error (MongoDB unique index violation)
    if (error.code === 11000) {
      logger.warn(
        { email: req.body.email },
        'Signup attempt with existing email'
      );

      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Handle other errors (validation, etc.)
    logger.error({ error: error.message }, 'Signup error');

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn({ email }, 'Failed login attempt');
      return next(new AppError('Invalid email or password', 401));
    }

    generateToken(res, user._id);

    logger.info({ userId: user._id }, 'User logged in');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    logger.info({ userId: req.userId }, 'User logged out');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};