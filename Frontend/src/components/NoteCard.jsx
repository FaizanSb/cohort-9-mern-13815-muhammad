import { useState } from 'react';
import toast from 'react-hot-toast';
import { summarizeNote } from '../api/notesApi';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    // Agar summary already generate ho chuki hai, dobara API call na karo — bas toggle karo
    if (summary) {
      setShowSummary((prev) => !prev);
      return;
    }

    setIsSummarizing(true);
    try {
      const res = await summarizeNote(note._id);
      setSummary(res.data.summary);
      setShowSummary(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to summarize');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2 truncate">{note.title}</h3>

      <div
        className="prose prose-sm max-w-none line-clamp-3"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {showSummary && summary && (
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm text-gray-700">
          <p className="font-medium text-purple-700 mb-1">✨ AI Summary</p>
          {summary}
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="text-purple-600 text-sm hover:underline disabled:opacity-50"
          >
            {isSummarizing ? 'Summarizing...' : summary ? (showSummary ? 'Hide Summary' : 'Show Summary') : '✨ Summarize'}
          </button>
          <button onClick={() => onEdit(note)} className="text-blue-600 text-sm hover:underline">
            Edit
          </button>
          <button onClick={() => onDelete(note._id)} className="text-red-500 text-sm hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;