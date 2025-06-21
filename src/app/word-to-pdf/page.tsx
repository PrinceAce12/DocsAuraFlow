'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ConversionProgress from '@/components/ConversionProgress';
import DownloadSection from '@/components/DownloadSection';
import { HeaderAd, SidebarAd, FooterAd } from '@/components/AdSense';
import Link from 'next/link';

export default function WordToPdfPage() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsConverting(true);
    setProgress(0);
    setDownloadUrl(null);
    setFileName(file.name.replace(/\.(docx?|rtf)$/i, '.pdf'));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const formData = new FormData();
      formData.append('word', file);

      const response = await fetch('/api/convert/word-to-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setProgress(100);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert Word to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setProgress(0);
    setDownloadUrl(null);
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Ad */}
      <HeaderAd />
      
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DS</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Document & Image Suite
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Word to PDF Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Convert your Word documents to PDF format quickly and easily
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {!downloadUrl ? (
              <React.Fragment>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  acceptedTypes=".doc,.docx,.rtf"
                  maxSize={10 * 1024 * 1024}
                  title="Select Word Document"
                  description="Choose a .doc, .docx, or .rtf file to convert to PDF"
                />
                
                {isConverting && (
                  <div className="mt-8">
                    <ConversionProgress progress={progress} />
                  </div>
                )}
              </React.Fragment>
            ) : (
              <DownloadSection
                downloadUrl={downloadUrl}
                fileName={fileName}
                onReset={handleReset}
                title="Word to PDF Conversion Complete!"
                description="Your Word document has been successfully converted to PDF."
              />
            )}
            </div>
          </div>
          
          {/* Sidebar with ads */}
          <div className="lg:w-80 space-y-6">
            <SidebarAd />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Other Tools
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/pdf-to-word" 
                  className="block p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-200">PDF to Word</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Convert PDF to editable Word</div>
                </Link>
                <Link 
                  href="/text-to-word" 
                  className="block p-3 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                  <div className="font-medium text-green-900 dark:text-green-200">Text to Word</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Convert plain text to Word</div>
                </Link>
                <Link 
                  href="/pdf-form-filler" 
                  className="block p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <div className="font-medium text-purple-900 dark:text-purple-200">PDF Form Filler</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Fill PDF forms easily</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Ad */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <FooterAd />
        </div>
      </div>
    </div>
  );
}
