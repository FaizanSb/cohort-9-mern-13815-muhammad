import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

const NoteModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    // Plain text check — khali <p></p> bhi "content hai" lag sakta hai, isliye strip karke check karo
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!plainText) return;

    setIsSaving(true);
    try {
      await onSave({ title, content });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-bold mb-4">{initialData ? 'Edit Note' : 'New Note'}</h3>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="mb-4">
          <RichTextEditor
            value={content}
            onChange={(html) => setContent(html)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteModal;