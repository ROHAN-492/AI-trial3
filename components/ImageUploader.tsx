
import React, { useRef, useState, useCallback } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../constants';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  imagePreviewUrl: string | null;
  disabled: boolean;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 group-hover:text-primary transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, imagePreviewUrl, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleContainerClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
     if (!disabled) setIsDragging(true); // Keep highlighting while dragging over
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (ACCEPTED_IMAGE_TYPES.includes(files[0].type)) {
        onFileSelect(files[0]);
      } else {
        // Optionally, show an error message for invalid file type on drop
        console.warn("Invalid file type dropped");
      }
    }
  }, [onFileSelect, disabled]);


  return (
    <div className="space-y-4">
      <div
        className={`group relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ease-in-out
                    ${isDragging ? 'border-primary bg-slate-700/50 scale-105' : 'border-slate-600 hover:border-primary'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleContainerClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className="hidden"
          disabled={disabled}
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Selected preview" className="mx-auto max-h-64 rounded-md object-contain" />
        ) : (
          <div className="space-y-2">
            <UploadIcon />
            <p className="text-slate-300 group-hover:text-primary transition-colors">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
