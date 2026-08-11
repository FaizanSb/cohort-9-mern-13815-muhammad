import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

// @route GET /api/notes  (sirf logged-in user ki notes)
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/notes/:id
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return next(new AppError('Note not found', 404));
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.userId });

    logger.info({ userId: req.userId, noteId: note._id }, 'Note created');
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/notes/:id
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Pehle check karo note exist karti hai AUR isi user ki hai
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return next(new AppError('Note not found', 404));

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();

    logger.info({ userId: req.userId, noteId: note._id }, 'Note updated');
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/notes/:id
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return next(new AppError('Note not found', 404));

    logger.info({ userId: req.userId, noteId: req.params.id }, 'Note deleted');
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};