'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, RotateCw, RotateCcw, Crop, Sliders, Palette, RefreshCw, Image as ImageIcon } from 'lucide-react'

interface EditOptions {
  brightness?: number
  contrast?: number
  saturation?: number
  rotation?: number
  blur?: number
  sharpen?: boolean
  grayscale?: boolean
  sepia?: boolean
  width?: number
  height?: number
  quality?: number
  format?: string
}

export default function ImageEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [editedPreview, setEditedPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // Edit controls state
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [blur, setBlur] = useState(0)
  const [sharpen, setSharpen] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [sepia, setSepia] = useState(false)
  const [width, setWidth] = useState<number | undefined>()
  const [height, setHeight] = useState<number | undefined>()
  const [quality, setQuality] = useState(90)
  const [format, setFormat] = useState('jpeg')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setError(null)
    setDownloadUrl(null)
    setEditedPreview(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalPreview(result)
      setEditedPreview(result)
      
      // Get original dimensions
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleFileSelect(file)
      } else {
        setError('Please select an image file')
      }
    }
  }, [handleFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const resetToDefaults = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setBlur(0)
    setSharpen(false)
    setGrayscale(false)
    setSepia(false)
    setQuality(90)
    setFormat('jpeg')
    if (selectedFile) {
      // Reset dimensions to original
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = originalPreview!
    }
  }

  const applyEdits = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const editOptions: EditOptions = {
        brightness: brightness !== 100 ? brightness : undefined,
        contrast: contrast !== 100 ? contrast : undefined,
        saturation: saturation !== 100 ? saturation : undefined,
        rotation: rotation !== 0 ? rotation : undefined,
        blur: blur > 0 ? blur : undefined,
        sharpen: sharpen || undefined,
        grayscale: grayscale || undefined,
        sepia: sepia || undefined,
        width: width,
        height: height,
        quality: quality,
        format: format
      }
      
      formData.append('options', JSON.stringify(editOptions))

      const response = await fetch('/api/edit-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to edit image')
      }

      // Get the edited image blob
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      setEditedPreview(url)
      setDownloadUrl(url)
      
      // Get filename from response headers
      const contentDisposition = response.headers.get('content-disposition')
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) {
          setDownloadFilename(match[1])
        }
      } else {
        const extension = format === 'jpeg' ? 'jpg' : format
        setDownloadFilename(`edited-${selectedFile.name.replace(/\.[^/.]+$/, '')}.${extension}`)
      }

    } catch (err) {
      console.error('Error editing image:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while editing the image')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (downloadUrl && downloadFilename) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = downloadFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Image Editor</h1>
          </div>
          <p className="text-xl text-gray-600">Edit, enhance, and transform your images with professional tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Controls</h2>
              
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload an Image</p>
                  <p className="text-gray-500">Drag & drop or click to select</p>
                  <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, GIF, WebP</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Color Adjustments */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Color & Lighting</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brightness: {brightness}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contrast: {contrast}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={(e) => setContrast(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Saturation: {saturation}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={saturation}
                          onChange={(e) => setSaturation(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transform */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Transform</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rotation: {rotation}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                          <input
                            type="number"
                            value={width || ''}
                            onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Auto"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                          <input
                            type="number"
                            value={height || ''}
                            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Effects */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Effects</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blur: {blur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={blur}
                          onChange={(e) => setBlur(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sharpen}
                            onChange={(e) => setSharpen(e.target.checked)}
                            className="mr-2"
                          />
                          Sharpen
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={grayscale}
                            onChange={(e) => setGrayscale(e.target.checked)}
                            className="mr-2"
                          />
                          Grayscale
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sepia}
                            onChange={(e) => setSepia(e.target.checked)}
                            className="mr-2"
                          />
                          Sepia
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Output Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Output</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                        <select
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="jpeg">JPEG</option>
                          <option value="png">PNG</option>
                          <option value="webp">WebP</option>
                        </select>
                      </div>
                      {format === 'jpeg' || format === 'webp' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quality: {quality}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={applyEdits}
                      disabled={isProcessing}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        'Apply Edits'
                      )}
                    </button>
                    
                    {downloadUrl && (
                      <button
                        onClick={downloadImage}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Edited Image
                      </button>
                    )}
                    
                    <button
                      onClick={resetToDefaults}
                      className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!selectedFile ? (
                <div className="text-center py-16 text-gray-500">
                  <ImageIcon className="h-24 w-24 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Upload an image to start editing</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Original</h3>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      {originalPreview && (
                        <img 
                          src={originalPreview} 
                          alt="Original" 
                          className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Edited */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Edited</h3>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      {editedPreview && (
                        <img 
                          src={editedPreview} 
                          alt="Edited" 
                          className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
