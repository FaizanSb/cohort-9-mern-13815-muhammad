import { useState } from 'react';
import toast from 'react-hot-toast';
import { summarizeNote } from '../api/notesApi';

// 5 pastel colors — background + left border accent, cycle hote hain
const PIN_COLORS = [
  { bg: 'bg-green-50', border: 'border-l-green-400' },
  { bg: 'bg-pink-50', border: 'border-l-pink-400' },
  { bg: 'bg-blue-50', border: 'border-l-blue-400' },
  { bg: 'bg-purple-50', border: 'border-l-purple-400' },
  { bg: 'bg-orange-50', border: 'border-l-orange-400' },
];

const NoteCard = ({ note, pinnedIndex, onEdit, onDelete, onTogglePin }) => {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const isPinned = note.pinned;
  const colorSet = isPinned ? PIN_COLORS[pinnedIndex % PIN_COLORS.length] : null;

  const handleSummarize = async () => {
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
    <div
      className={`rounded-lg shadow p-4 hover:shadow-md transition-shadow border-l-4 ${
        isPinned ? `${colorSet.bg} ${colorSet.border}` : 'bg-white border-l-transparent'
      }`}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-semibold text-lg truncate flex-1">{note.title}</h3>
        <button
          onClick={() => onTogglePin(note._id)}
          title={isPinned ? 'Unpin note' : 'Pin note'}
          className={`text-lg leading-none shrink-0 transition-opacity ${
            isPinned ? 'opacity-100' : 'opacity-30 hover:opacity-60'
          }`}
        >
          📌
        </button>
      </div>

      <div
        className="prose prose-sm max-w-none line-clamp-3"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {showSummary && summary && (
        <div className="mt-3 p-3 bg-purple-100/60 border border-purple-200 rounded-md text-sm text-gray-700">
          <p className="font-medium text-purple-700 mb-1">✨ AI Summary</p>
          {summary}
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-3">
          <button onClick={handleSummarize} disabled={isSummarizing} className="text-purple-600 text-sm hover:underline disabled:opacity-50">
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