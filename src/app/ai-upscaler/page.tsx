'use client';

import { useState, useRef } from 'react';
import { Upload, Download, Zap, ArrowLeft, Image as ImageIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { HeaderAd, InContentAd, FooterAd } from '@/components/AdSense';

export default function AIUpscaler() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<number>(2);
  const [error, setError] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const [processedDimensions, setProcessedDimensions] = useState<{width: number, height: number} | null>(null);
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
    setProcessedDimensions(null);

    // Create preview and get dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setProcessedDimensions({ 
          width: img.width * scaleFactor, 
          height: img.height * scaleFactor 
        });
      };
      img.src = result;
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
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      
      // Update processed dimensions
      if (originalDimensions) {
        setProcessedDimensions({
          width: originalDimensions.width * scaleFactor,
          height: originalDimensions.height * scaleFactor
        });
      }
    } catch (error) {
      console.error('Upscaling error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during upscaling');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
    const link = document.createElement('a');
    link.href = processedImage;
      link.download = `upscaled_${scaleFactor}x_${file?.name?.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview('');
    setProcessedImage('');
    setError('');
    setOriginalDimensions(null);
    setProcessedDimensions(null);
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Ad */}
      <HeaderAd />
      
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Image Upscaler
              </span>
            </Link>
          <Link 
            href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
              ← Back to Home
          </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-16 w-16 text-purple-600 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Image Upscaler
          </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enhance your images with AI-powered upscaling. Increase resolution up to 4x while maintaining quality and detail.
          </p>
        </div>

          {/* In-content Ad */}
          <div className="mb-8">
            <InContentAd />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ImageIcon className="h-6 w-6 mr-3 text-purple-600" />
                  Upload Image
                </h2>

          {!file ? (
            <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
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
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-purple-600" />
                        Upscaling Settings
                      </h3>
                      
                      <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Scale Factor: {scaleFactor}x
                  </label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="range"
                              min="1"
                              max="4"
                              step="0.5"
                    value={scaleFactor}
                              onChange={(e) => {
                                const newScale = parseFloat(e.target.value);
                                setScaleFactor(newScale);
                                if (originalDimensions) {
                                  setProcessedDimensions({
                                    width: originalDimensions.width * newScale,
                                    height: originalDimensions.height * newScale
                                  });
                                }
                              }}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]">
                              {scaleFactor}x
                            </span>
                          </div>
                        </div>

                        {originalDimensions && processedDimensions && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white dark:bg-gray-600 rounded p-3">
                              <p className="text-gray-500 dark:text-gray-400">Original</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {originalDimensions.width} × {originalDimensions.height}
                              </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3">
                              <p className="text-purple-600 dark:text-purple-400">Upscaled</p>
                              <p className="font-medium text-purple-900 dark:text-purple-100">
                                {processedDimensions.width} × {processedDimensions.height}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                  <button
                    onClick={handleUpscale}
                    disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Upscaling...
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Upscale Image
                          </>
                        )}
                  </button>

                      {processedImage && (
                  <button
                          onClick={handleDownload}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
                  >
                          <Download className="h-5 w-5 mr-2" />
                          Download
                  </button>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                      </div>
                    )}
                </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preview</h2>
              
              {!file ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <ImageIcon className="h-24 w-24 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg">Upload an image to see preview</p>
                </div>
              ) : (
                <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Original Image</h3>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
                    <img
                      src={preview}
                      alt="Original"
                        className="w-full h-auto max-h-64 object-contain mx-auto"
                    />
                    </div>
                </div>

                  {processedImage && (
                <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Upscaled Image ({scaleFactor}x)
                  </h3>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
                        <img
                          src={processedImage}
                          alt="Upscaled"
                          className="w-full h-auto max-h-64 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced AI algorithms for superior image quality and detail preservation.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">Upscale images up to 4x while maintaining sharpness and clarity.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick processing with instant preview and download capabilities.</p>
            </div>
          </div>

          {/* Footer Ad */}
          <div className="mt-12">
            <FooterAd />
          </div>
        </div>
      </div>
    </div>
  );
}
