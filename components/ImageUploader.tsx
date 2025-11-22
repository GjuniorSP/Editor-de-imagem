import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  }, [onImageSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        w-full h-64 md:h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center p-6 text-center
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      
      <div className={`
        rounded-full p-4 mb-4 transition-transform duration-300
        ${isDragging ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'}
      `}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h3 className="text-lg font-medium text-slate-200 mb-1">
        {isDragging ? 'Drop it like it\'s hot' : 'Upload an image'}
      </h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Drag and drop your image here, or click to browse files.
      </p>
    </div>
  );
};