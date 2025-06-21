'use client'

import { useState } from 'react'
import FileUpload from '../../components/FileUpload'
import ConversionProgress from '../../components/ConversionProgress'
import DownloadSection from '../../components/DownloadSection'
import { HeaderAd, InContentAd, FooterAd } from '@/components/AdSense'
import Link from 'next/link'

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setError(null)
    setDownloadUrl(null)
    setProgress(0)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(uploadedFile)
  }

  const handleRemoveBackground = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove background')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (error) {
      console.error('Error removing background:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setDownloadUrl(null)
    setProgress(0)
    setError(null)
    setIsProcessing(false)
    setPreview(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header Ad */}
      <HeaderAd />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Background Remover</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Remove backgrounds from images with precision. Upload your image and get a clean, transparent background in seconds.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            &ldquo;Perfect for product photos, portraits, and creative projects&rdquo;
          </p>
        </div>

        {/* In-content Ad */}
        <div className="mb-8">
          <InContentAd />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {!file && (
              <FileUpload
                onFileSelect={handleFileUpload}
                acceptedTypes="image/*"
                maxSize={10 * 1024 * 1024} // 10MB
                title="Upload Image"
                description="Select an image to remove its background"
              />
            )}

            {file && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Selected: {file.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    >
                      {isProcessing ? 'Removing Background...' : 'Remove Background'}
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isProcessing}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {isProcessing && <ConversionProgress progress={progress} />}
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
              </div>
            )}

            {downloadUrl && (
              <DownloadSection
                downloadUrl={downloadUrl}
                fileName={`no-bg-${file?.name?.replace(/\.[^/.]+$/, '')}.png`}
                onReset={handleReset}
                title="Background Removed Successfully!"
                description="Your image with transparent background is ready for download."
              />
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
            
            {!file ? (
              <div className="text-center py-16 text-gray-500">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg">Upload an image to see preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Original Image</h3>
                  <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                    {preview && (
                      <img 
                        src={preview} 
                        alt="Original" 
                        className="w-full h-auto max-h-64 object-contain mx-auto"
                      />
                    )}
                  </div>
                </div>
                
                {downloadUrl && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Background Removed</h3>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img 
                        src={downloadUrl} 
                        alt="Background Removed" 
                        className="w-full h-auto max-h-64 object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Upload an image (JPG, PNG, WebP supported)</li>
            <li>Click "Remove Background" to process your image</li>
            <li>Download the result with transparent background as PNG</li>
          </ol>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Works best with images that have clear subject-background distinction</li>
              <li>Maximum file size: 10MB</li>
              <li>Output format: PNG with transparency</li>
              <li>Keep file sizes reasonable for better processing speed</li>
            </ul>
          </div>
        </div>

        {/* Footer Ad */}
        <div className="mt-12">
          <FooterAd />
        </div>
      </div>
    </div>
  )
}
