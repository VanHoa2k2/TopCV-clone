"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TiptapEditor = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className = "",
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g., when loading data for edit)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-editor border border-gray-300 rounded ${className}`}>
      <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-bold ${
            editor.isActive("bold") ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm italic ${
            editor.isActive("italic") ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          H2
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose max-w-none focus:outline-none"
      />
    </div>
  );
};

export default TiptapEditor;
