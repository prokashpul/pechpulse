import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: 'Write your masterpiece here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });

      // Custom Image Handler to upload local images
      const toolbar = quillRef.current.getModule('toolbar');
      // @ts-ignore: Quill types may vary for addHandler
      toolbar.addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const range = quillRef.current?.getSelection(true);
              if (quillRef.current && reader.result) {
                // If we have a selection, insert at index. If not, append to end?
                // getSelection(true) usually forces focus or returns last position.
                const index = range ? range.index : (quillRef.current.getLength() || 0);
                quillRef.current.insertEmbed(index, 'image', reader.result);
                // Move cursor after the image
                quillRef.current.setSelection(index + 1);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      });

      quillRef.current.on('text-change', () => {
        // Get HTML content
        const html = quillRef.current?.root.innerHTML || '';
        onChange(html);
      });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      // To avoid cursor jumping when user is typing, we check focus.
      // If editor has focus, we assume the mismatch is due to local typing latency or similar 
      // and do NOT overwrite unless the value is drastically different (handled by parent logic usually).
      // However, for AI generation, the editor might not have focus (focus on "Generate" button),
      // so this update will correctly apply the AI content.
      const hasFocus = quillRef.current.hasFocus();
      if (!hasFocus) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return <div ref={containerRef} />;
};