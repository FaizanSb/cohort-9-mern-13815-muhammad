import express from 'express';
import { body } from 'express-validator';
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
router.get('/:id', getNoteById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  createNote
);

router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;