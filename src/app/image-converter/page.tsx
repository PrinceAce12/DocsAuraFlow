'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ConversionProgress from '@/components/ConversionProgress'
import DownloadSection from '@/components/DownloadSection'

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<{ url: string; filename: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>('png')

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']

  const handleFileSelect = (selectedFile: File) => {
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, GIF, BMP, TIFF)')
      return
    }
    setFile(selectedFile)
    setError(null)
    setConvertedFile(null)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Converter</h1>
          <p className="text-xl text-gray-600">Convert images between different formats quickly and easily</p>
        </div>

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

          {file && !isConverting && !convertedFile && (
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Convert Image
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
      </div>
    </div>
  )
}
