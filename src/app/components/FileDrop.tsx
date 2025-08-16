'use client';
import { useRef } from 'react';

export default function FileDrop({ onText }: { onText: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    onText(text);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await handleFile(files[0]);
  };

  return (
    <div className="border border-dashed rounded p-4 text-sm">
      <p className="mb-2">Upload a transcript (.txt) or paste below:</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="p-6 border rounded mb-2 text-center cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        Drop file here or click to choose
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}
