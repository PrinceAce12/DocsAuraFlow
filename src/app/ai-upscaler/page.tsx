'use client';

import { useState, useRef } from 'react';
import { Upload, Download, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AIUpscaler() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<number>(2);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setProcessedImage('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpscale = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scaleFactor', scaleFactor.toString());

      const response = await fetch('/api/upscale-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upscale image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error('Upscale error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upscale image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage || !file) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `upscaled_${scaleFactor}x_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setPreview('');
    setProcessedImage('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Image Upscaler
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enhance your images with AI-powered upscaling technology
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload Image to Upscale
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Supports JPG, PNG, WebP (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Scale Factor Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scale Factor
                  </label>
                  <select
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isProcessing}
                  >
                    <option value={2}>2x (Double)</option>
                    <option value={3}>3x (Triple)</option>
                    <option value={4}>4x (Quadruple)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpscale}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {isProcessing ? 'Upscaling...' : 'Upscale Image'}
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Original Image
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <img
                      src={preview}
                      alt="Original"
                      className="w-full h-auto max-h-96 object-contain rounded"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                </div>

                {/* Upscaled Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Upscaled Image ({scaleFactor}x)
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    {isProcessing ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Processing image...
                        </p>
                      </div>
                    ) : processedImage ? (
                      <div className="w-full">
                        <img
                          src={processedImage}
                          alt="Upscaled"
                          className="w-full h-auto max-h-96 object-contain rounded"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Upscaled {scaleFactor}x
                          </p>
                          <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500">
                        Upscaled image will appear here
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
