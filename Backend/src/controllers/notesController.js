import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';
import sanitizeHtml from 'sanitize-html';
import genAI from '../config/gemini.js'; // Fixed: 'gemeni' -> 'gemini'

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

    // Update title if provided
    if (title !== undefined) {
      note.title = title;
    }

    // Update content if provided and sanitize it
    if (content !== undefined) {
      note.content = sanitizeHtml(content, sanitizeOptions);
    }

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

// @route POST /api/notes/:id/summarize
export const summarizeNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) {
      return next(new AppError('Note not found', 404));
    }

    // Extract plain text from HTML content
    const plainText = sanitizeHtml(note.content, { 
      allowedTags: [], 
      allowedAttributes: {} 
    }).trim();

    if (!plainText || plainText.length < 20) {
      return next(new AppError('Note is too short to summarize', 400));
    }

    // Generate summary using Gemini
    const result = await genAI.models.generateContent({
      model: 'gemini-3.6-flash', // Fixed: 'gemini-2.5-flash' -> 'gemini-2.0-flash' (or use 'gemini-pro')
      contents: `Summarize the following note in 2-3 concise sentences:\n\n${plainText}`,
    });
    
    // Fixed: response.text extraction
    const summary = result.text || result.candidates?.[0]?.content || 'Unable to generate summary';

    logger.info({ userId: req.userId, noteId: note._id }, 'Note summarized');

    res.status(200).json({ 
      success: true, 
      summary 
    });
  } catch (error) {
    // Better error handling
    console.error('Summarization error:', error);
    
    if (error.status === 401 || error.status === 403) {
      return next(new AppError('AI service authentication failed. Please check your API key.', 500));
    }
    
    if (error.message?.includes('API key')) {
      return next(new AppError('Invalid or missing Gemini API key', 500));
    }
    
    next(error);
  }
};