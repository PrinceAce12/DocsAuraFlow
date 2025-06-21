"use client";

import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string | string[];
  maxSize?: number;
  title?: string;
  description?: string;
  supportedFormats?: string;
  accept?: string;
  children?: React.ReactNode;
}

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes = '.pdf',
  maxSize = 50 * 1024 * 1024,
  title = 'Upload your PDF file',
  description = 'Drag and drop your PDF file here, or click to browse',
  supportedFormats = 'Supports PDF files up to 50MB',
  accept,
  children 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      if (file.size > maxSize) {
        alert(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        alert(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize]);

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept || (Array.isArray(acceptedTypes) ? acceptedTypes.join(',') : acceptedTypes)}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isDragOver ? `Drop your file here` : title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {supportedFormats}
            </p>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
}
