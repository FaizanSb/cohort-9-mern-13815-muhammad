import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
  allowedTags: ['p', 'strong', 'em', 's', 'h2', 'ul', 'ol', 'li', 'br'],
  allowedAttributes: {},
};

// @route GET /api/notes
// Sirf logged-in user ki notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/notes/:id
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return next(new AppError('Note not found', 404));
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // HTML content ko sanitize karo
    const cleanContent = sanitizeHtml(content, sanitizeOptions);

    const note = await Note.create({
      title,
      content: cleanContent,
      user: req.userId,
    });

    logger.info(
      { userId: req.userId, noteId: note._id },
      'Note created'
    );

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/notes/:id
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Pehle check karo note exist karti hai AUR isi user ki hai
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return next(new AppError('Note not found', 404));
    }

    note.title = title ?? note.title;

    // Content ko sanitize karke save karo
    note.content = content
      ? sanitizeHtml(content, sanitizeOptions)
      : note.content;

    await note.save();

    logger.info(
      { userId: req.userId, noteId: note._id },
      'Note updated'
    );

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/notes/:id
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return next(new AppError('Note not found', 404));
    }

    logger.info(
      { userId: req.userId, noteId: req.params.id },
      'Note deleted'
    );

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};