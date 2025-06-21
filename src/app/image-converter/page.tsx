'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ConversionProgress from '@/components/ConversionProgress'
import DownloadSection from '@/components/DownloadSection'
import { HeaderAd, InContentAd, FooterAd } from '@/components/AdSense'
import Link from 'next/link'

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<{ url: string; filename: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>('png')
  const [preview, setPreview] = useState<string | null>(null)

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']

  const handleFileSelect = (selectedFile: File) => {
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, GIF, BMP, TIFF)')
      return
    }
    setFile(selectedFile)
    setError(null)
    setConvertedFile(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('outputFormat', outputFormat)

    try {
      const response = await fetch('/api/convert/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const originalName = file.name.split('.')[0]
      const filename = `${originalName}.${outputFormat}`

      setConvertedFile({ url, filename })
    } catch (error) {
      console.error('Conversion error:', error)
      setError('Failed to convert image. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setConvertedFile(null)
    setError(null)
    setIsConverting(false)
    setPreview(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      {/* Header Ad */}
      <HeaderAd />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Converter</h1>
          <p className="text-xl text-gray-600">Convert images between different formats quickly and easily</p>
        </div>

        {/* In-content Ad */}
        <div className="mb-8">
          <InContentAd />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {!file && (
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={acceptedTypes}
                title="Upload Image"
                description="Drag and drop your image file here, or click to browse"
                supportedFormats="JPEG, PNG, WEBP, GIF, BMP, TIFF"
              />
            )}

            {file && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Choose Output Format</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['png', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'].map((format) => (
                      <label
                        key={format}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          outputFormat === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={outputFormat === format}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="sr-only"
                        />
                        <span className="font-medium uppercase">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isConverting ? 'Converting...' : 'Convert Image'}
                </button>
              </div>
            )}

            {isConverting && <ConversionProgress progress={75} />}

            {convertedFile && (
              <DownloadSection
                fileUrl={convertedFile.url}
                fileName={convertedFile.filename}
                onReset={handleReset}
                title="Image Converted Successfully!"
                description={`Your image has been converted to ${outputFormat.toUpperCase()} format.`}
              />
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-8">
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
                
                {convertedFile && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Converted Image ({outputFormat.toUpperCase()})</h3>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img 
                        src={convertedFile.url} 
                        alt="Converted" 
                        className="w-full h-auto max-h-64 object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
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
