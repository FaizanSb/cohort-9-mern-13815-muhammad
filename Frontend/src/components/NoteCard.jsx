const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2 truncate">{note.title}</h3>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
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