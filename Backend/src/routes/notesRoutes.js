import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

router.use(protect); // ye SAARI notes routes ko protect kar deta hai ek hi line mein

router.get('/', getNotes);
router.get('/:id', [param('id').isMongoId().withMessage('invalid notes id')],validateRequest,getNoteById);

router.post(
  '/',
  [
    body('title')
      .isString()
      .bail()
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('content')
      .isString()
      .bail()
      .trim()
      .notEmpty()
      .withMessage('Content is required'),
  ],
  validateRequest,
  createNote
);

router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid note ID'),

    body('title')
      .isString()
      .bail()
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('content')
      .isString()
      .bail()
      .trim()
      .notEmpty()
      .withMessage('Content is required'),
  ],
  validateRequest,
  updateNote
);
router.delete('/:id', deleteNote);

export default router;