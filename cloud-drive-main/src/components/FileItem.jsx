import React from 'react';

export default function FileItem({ file, onDelete }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded shadow-sm bg-white">
      <span>{file.name}</span>
      <button
        className="text-red-500 hover:underline"
        onClick={() => onDelete(file.name)}
      >
        Delete
      </button>
    </div>
  );
}
