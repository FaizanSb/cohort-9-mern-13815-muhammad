import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const RichTextEditor = ({ value, onChange, minimal = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: minimal
          ? 'Just start writing...'
          : 'Write your note...',
      }),
    ],

    content: value || '',

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class: minimal
          ? 'prose prose-lg max-w-none min-h-[calc(100vh-150px)] focus:outline-none text-gray-800 leading-relaxed'
          : 'prose prose-sm max-w-none min-h-[150px] px-3 py-2 focus:outline-none',
      },
    },
  });

  // Sync external value with TipTap editor
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    const newContent = value || '';

    if (newContent !== currentContent) {
      editor.commands.setContent(newContent, false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={
        minimal
          ? 'w-full'
          : 'rounded-md border focus-within:ring-2 focus-within:ring-blue-500'
      }
    >
      {!minimal && <Toolbar editor={editor} />}

      <EditorContent editor={editor} />
    </div>
  );
};

const Toolbar = ({ editor }) => {
  const btnClass = (active) =>
    `rounded px-2 py-1 text-sm font-medium transition ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-wrap gap-1 border-b px-2 py-1">
      {/* Bold */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
        className={btnClass(editor.isActive('bold'))}
      >
        Bold
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
        className={btnClass(editor.isActive('italic'))}
      >
        Italic
      </button>

      {/* Strike */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleStrike().run()
        }
        className={btnClass(editor.isActive('strike'))}
      >
        Strike
      </button>

      <div className="mx-1 w-px bg-gray-200" />

      {/* H2 */}
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
        className={btnClass(
          editor.isActive('heading', { level: 2 })
        )}
      >
        H2
      </button>

      {/* Bullet List */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        className={btnClass(editor.isActive('bulletList'))}
      >
        • List
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
        className={btnClass(editor.isActive('orderedList'))}
      >
        1. List
      </button>

      <div className="mx-1 w-px bg-gray-200" />

      {/* Undo */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().undo().run()
        }
        disabled={!editor.can().undo()}
        className={`${btnClass(false)} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Undo
      </button>

      {/* Redo */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().redo().run()
        }
        disabled={!editor.can().redo()}
        className={`${btnClass(false)} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Redo
      </button>
    </div>
  );
};

export default RichTextEditor;