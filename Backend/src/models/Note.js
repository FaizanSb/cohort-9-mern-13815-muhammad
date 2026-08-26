import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;