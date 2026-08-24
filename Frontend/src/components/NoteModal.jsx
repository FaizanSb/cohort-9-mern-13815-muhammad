import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

const NoteModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Load initial note data whenever modal opens or note changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else {
      setTitle('');
      setContent('');
    }

    // Every time modal opens, start in normal mode
    setIsFocusMode(false);
    setShowHint(true);
  }, [initialData, isOpen]);

  // Show focus-mode hint for 2 seconds
  useEffect(() => {
    if (!isFocusMode) return;

    setShowHint(true);

    const timer = setTimeout(() => {
      setShowHint(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isFocusMode]);

  // Check whether editor contains actual text
  const getPlainText = useCallback(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    return tempDiv.textContent?.trim() || '';
  }, [content]);

  // Save note
  const doSave = useCallback(async () => {
    const plainText = getPlainText();

    if (!plainText) {
      toast.error('Note content cannot be empty');
      return false;
    }

    if (isSaving) {
      return false;
    }

    setIsSaving(true);

    try {
      await onSave({
        title: title.trim(),
        content,
      });

      return true;
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');

      return false;
    } finally {
      setIsSaving(false);
    }
  }, [content, getPlainText, isSaving, onSave, title]);

  // Exit focus mode and save
  const exitFocusMode = useCallback(async () => {
    if (isSaving) return;

    const saved = await doSave();

    // Only exit focus mode if save was successful
    if (saved) {
      setIsFocusMode(false);
    }
  }, [doSave, isSaving]);

  // Escape key handler
  useEffect(() => {
    if (!isFocusMode) return;

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      event.stopPropagation();

      exitFocusMode();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isFocusMode, exitFocusMode]);

  // Normal form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    const saved = await doSave();

    if (saved) {
      onClose();
    }
  };

  // Enter focus mode
  const enterFocusMode = () => {
    setShowHint(true);
    setIsFocusMode(true);
  };

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // FOCUS MODE
  // =========================================================

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-white">
        {/* Focus Mode Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Untitled note"
              className="w-full border-none bg-transparent text-xl font-semibold text-gray-800 outline-none placeholder:text-gray-300"
            />
          </div>

          <button
            type="button"
            onClick={exitFocusMode}
            disabled={isSaving}
            className="ml-4 rounded-md px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Exit Focus'}
          </button>
        </div>

        {/* Hint */}
        <div
          className={`pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 text-xs text-gray-400 transition-opacity duration-700 ${
            showHint ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Press{' '}
          <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-gray-500">
            Esc
          </kbd>{' '}
          to save & exit
        </div>

        {/* Editor */}
        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-6 py-10 sm:px-12 md:px-24">
          <div className="w-full max-w-3xl">
            <RichTextEditor
              value={content}
              onChange={setContent}
              minimal
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NORMAL MODE
  // =========================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? 'Edit Note' : 'New Note'}
          </h3>

          <button
            type="button"
            onClick={enterFocusMode}
            disabled={isSaving}
            title="Enter focus mode"
            className="flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⛶ Focus Mode
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="mb-3 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Rich Text Editor */}
        <div className="mb-4">
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteModal;