import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const optionsStr = formData.get('options') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Parse options
    let options: EditOptions = {}
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr)
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid options format' },
          { status: 400 }
        )
      }
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Start Sharp pipeline
    let pipeline = sharp(buffer)

    // Get original image metadata
    const metadata = await pipeline.metadata()

    // Apply rotation first (affects subsequent operations)
    if (options.rotation && options.rotation !== 0) {
      pipeline = pipeline.rotate(options.rotation)
    }

    // Apply resize if dimensions specified
    if (options.width || options.height) {
      const resizeOptions: sharp.ResizeOptions = {
        fit: 'inside',
        withoutEnlargement: false
      }
      
      pipeline = pipeline.resize(options.width, options.height, resizeOptions)
    }

    // Apply blur
    if (options.blur && options.blur > 0) {
      pipeline = pipeline.blur(options.blur)
    }

    // Apply sharpen
    if (options.sharpen) {
      pipeline = pipeline.sharpen()
    }

    // Apply color adjustments
    const modulate: { brightness?: number; saturation?: number } = {}
    
    if (options.brightness && options.brightness !== 100) {
      modulate.brightness = options.brightness / 100
    }
    
    if (options.saturation && options.saturation !== 100) {
      modulate.saturation = options.saturation / 100
    }

    if (Object.keys(modulate).length > 0) {
      pipeline = pipeline.modulate(modulate)
    }

    // Apply contrast (using linear adjustment)
    if (options.contrast && options.contrast !== 100) {
      const contrastValue = options.contrast / 100
      pipeline = pipeline.linear(contrastValue, -(128 * contrastValue) + 128)
    }

    // Apply grayscale
    if (options.grayscale) {
      pipeline = pipeline.grayscale()
    }

    // Apply sepia (tint with sepia color)
    if (options.sepia) {
      pipeline = pipeline.tint({ r: 255, g: 240, b: 196 })
    }

    // Determine output format and quality
    const outputFormat = options.format || 'jpeg'
    const quality = options.quality || 90

    // Apply format-specific options
    switch (outputFormat.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true })
        break
      case 'png':
        pipeline = pipeline.png({ 
          compressionLevel: Math.round((100 - quality) / 10),
          quality
        })
        break
      case 'webp':
        pipeline = pipeline.webp({ quality })
        break
      default:
        pipeline = pipeline.jpeg({ quality })
    }

    // Process the image
    const processedBuffer = await pipeline.toBuffer()

    // Determine the file extension
    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat
    const originalName = file.name.replace(/\.[^/.]+$/, '')
    const filename = `edited-${originalName}.${extension}`

    // Set response headers
    const headers = new Headers()
    headers.set('Content-Type', `image/${outputFormat}`)
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    headers.set('Content-Length', processedBuffer.length.toString())

    return new NextResponse(processedBuffer, {
      headers,
      status: 200
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
