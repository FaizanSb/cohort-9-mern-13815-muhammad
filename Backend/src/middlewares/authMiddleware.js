import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, invalid token', 401));
  }
};