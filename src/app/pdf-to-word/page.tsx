"use client";

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ConversionProgress from '@/components/ConversionProgress';
import DownloadSection from '@/components/DownloadSection';
import { HeaderAd, InContentAd, FooterAd } from '@/components/AdSense';
import Link from 'next/link';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedFile(null);
    setError(null);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/convert/pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      setConvertedFile(blob);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedFile(null);
    setError(null);
    setProgress(0);
    setIsConverting(false);
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              PDF to Word Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert your PDF documents to editable Word files quickly and easily. 
              Upload your PDF and get a Word document in seconds.
            </p>
          </div>
          
          {/* In-content Ad */}
          <div className="mb-8">
            <InContentAd />
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {!file && (
              <FileUpload onFileSelect={handleFileSelect} acceptedTypes=".pdf" />
            )}

            {file && !convertedFile && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
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

                {isConverting && (
                  <ConversionProgress progress={progress} />
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isConverting ? 'Converting...' : 'Convert to Word'}
                </button>
              </div>
            )}

            {convertedFile && (
              <DownloadSection 
                convertedFile={convertedFile} 
                originalFileName={file?.name || 'document'}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Ad before Features */}
          <div className="mt-12 mb-8">
            <InContentAd />
          </div>
          
          {/* Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Conversion</h3>
              <p className="text-gray-600 dark:text-gray-300">Convert your PDFs to Word documents in seconds with our optimized processing.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">Preserve formatting, images, and text layout during conversion.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">Your files are processed securely and deleted after conversion.</p>
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
