import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotes, createNote, updateNote, deleteNote, togglePin } from '../api/notesApi';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent'); // 'recent' | 'alpha_asc' | 'alpha_desc'

  const debounceRef = useRef(null);

  const loadNotes = useCallback(async (search, sort) => {
    setLoading(true);
    try {
      const res = await fetchNotes({ search, sort: sort === 'recent' ? undefined : sort });
      setNotes(res.data.notes);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sort change hote hi turant fetch
  useEffect(() => {
    loadNotes(searchTerm, sortOption);
  }, [sortOption]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search type karte waqt debounce (300ms wait)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadNotes(value, sortOption);
    }, 300);
  };

  const handleSave = async (data) => {
    try {
      if (editingNote) {
        await updateNote(editingNote._id, data);
        toast.success('Note updated');
      } else {
        await createNote(data);
        toast.success('Note created');
      }
      setModalOpen(false);
      setEditingNote(null);
      loadNotes(searchTerm, sortOption);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      toast.success('Note deleted');
      loadNotes(searchTerm, sortOption);
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await togglePin(id);
      loadNotes(searchTerm, sortOption); // list refresh, pinned note upar chali jayegi
    } catch (err) {
      toast.error('Failed to pin/unpin note');
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
          >
            + New Note
          </button>
          <button
            onClick={logout}
            className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Last Updated</option>
          <option value="alpha_asc">Title: A-Z</option>
          <option value="alpha_desc">Title: Z-A</option>
        </select>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Loading your notes...</p>
        </div>
      ) : notes.length === 0 ? (
        searchTerm ? (
          // No search results state
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No matches found</h3>
            <p className="text-gray-400 text-sm mb-4">
              Nothing matches "<span className="font-medium text-gray-600">{searchTerm}</span>"
            </p>
            <button
              onClick={() => handleSearchChange('')}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          // Truly empty state
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="180" height="140" viewBox="0 0 180 140" className="mb-6">
              <rect x="30" y="20" width="90" height="70" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" transform="rotate(-8 75 55)" />
              <rect x="55" y="35" width="90" height="70" rx="8" fill="#FDF4FF" stroke="#F5D0FE" strokeWidth="2" transform="rotate(6 100 70)" />
              <rect x="45" y="45" width="90" height="70" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              <line x1="58" y1="62" x2="112" y2="62" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
              <line x1="58" y1="75" x2="122" y2="75" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
              <line x1="58" y1="88" x2="100" y2="88" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
              <circle cx="140" cy="100" r="14" fill="#3B82F6" />
              <line x1="140" y1="94" x2="140" y2="106" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="134" y1="100" x2="146" y2="100" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No notes yet</h3>
            <p className="text-gray-400 text-sm mb-5 max-w-xs">
              Capture your first thought, idea, or reminder — it only takes a second.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              + Create your first note
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
            let pinnedCount = 0;
            return notes.map((note) => {
              const pinnedIndex = note.pinned ? pinnedCount++ : null;
              return (
                <NoteCard
                  key={note._id}
                  note={note}
                  pinnedIndex={pinnedIndex}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              );
            });
          })()}
        </div>
      )}

      <NoteModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingNote(null); }}
        onSave={handleSave}
        initialData={editingNote}
      />
    </div>
  );
};

export default Dashboard;