import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotes, createNote, updateNote, deleteNote } from '../api/notesApi';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await fetchNotes();
      setNotes(res.data.notes);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
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
      loadNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      toast.success('Note deleted');
      loadNotes();
    } catch (err) {
      toast.error('Failed to delete note');
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <div className="flex gap-3">
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + New Note
          </button>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet — create your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onEdit={openEditModal} onDelete={handleDelete} />
          ))}
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