import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      // Get image metadata
      const metadata = await sharp(buffer).metadata()
      
      if (!metadata.width || !metadata.height) {
        return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
      }

      // Enhanced background removal using multiple techniques
      const { width, height } = metadata
      
      // Convert to RGBA format first
      const rgbaBuffer = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer()

      const channels = 4 // RGBA
      const newBuffer = Buffer.alloc(rgbaBuffer.length)
      rgbaBuffer.copy(newBuffer)

      // Sample multiple areas to determine background color more accurately
      const samplePoints = [
        // Corners
        { x: 0, y: 0 },
        { x: width! - 1, y: 0 },
        { x: 0, y: height! - 1 },
        { x: width! - 1, y: height! - 1 },
        // Edges
        { x: Math.floor(width! / 2), y: 0 },
        { x: Math.floor(width! / 2), y: height! - 1 },
        { x: 0, y: Math.floor(height! / 2) },
        { x: width! - 1, y: Math.floor(height! / 2) },
        // Center area (likely background)
        { x: Math.floor(width! / 4), y: Math.floor(height! / 4) },
        { x: Math.floor(3 * width! / 4), y: Math.floor(height! / 4) },
        { x: Math.floor(width! / 4), y: Math.floor(3 * height! / 4) },
        { x: Math.floor(3 * width! / 4), y: Math.floor(3 * height! / 4) }
      ]

      // Calculate average background color from sample points
      let avgR = 0, avgG = 0, avgB = 0, sampleCount = 0
      for (const point of samplePoints) {
        if (point.x >= 0 && point.x < width! && point.y >= 0 && point.y < height!) {
          const index = (point.y * width! + point.x) * channels
          avgR += rgbaBuffer[index]
          avgG += rgbaBuffer[index + 1]
          avgB += rgbaBuffer[index + 2]
          sampleCount++
        }
      }
      
      if (sampleCount > 0) {
        avgR /= sampleCount
        avgG /= sampleCount
        avgB /= sampleCount
      }

      // Enhanced threshold calculation based on image characteristics
      const colorThreshold = Math.max(30, Math.min(80, (avgR + avgG + avgB) / 3 / 10))
      const edgeThreshold = Math.max(20, Math.min(50, colorThreshold * 0.6))

      // Process each pixel with improved algorithm
      for (let y = 0; y < height!; y++) {
        for (let x = 0; x < width!; x++) {
          const index = (y * width! + x) * channels
          const r = rgbaBuffer[index]
          const g = rgbaBuffer[index + 1]
          const b = rgbaBuffer[index + 2]

          // Calculate color distance from background
          const colorDistance = Math.sqrt(
            Math.pow(r - avgR, 2) +
            Math.pow(g - avgG, 2) +
            Math.pow(b - avgB, 2)
          )

          // Enhanced edge detection with gradient analysis
          let isEdge = false
          let maxGradient = 0
          
          if (x > 0 && x < width! - 1 && y > 0 && y < height! - 1) {
            // Check 8 neighboring pixels
            const neighbors = [
              { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
              { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
              { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
              { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
            ]

            for (const { dx, dy } of neighbors) {
              const nx = x + dx
              const ny = y + dy
              const neighborIndex = (ny * width! + nx) * channels
              
              const nR = rgbaBuffer[neighborIndex]
              const nG = rgbaBuffer[neighborIndex + 1]
              const nB = rgbaBuffer[neighborIndex + 2]

              const gradient = Math.sqrt(
                Math.pow(r - nR, 2) +
                Math.pow(g - nG, 2) +
                Math.pow(b - nB, 2)
              )
              
              maxGradient = Math.max(maxGradient, gradient)
            }
            
            isEdge = maxGradient > edgeThreshold
          }

          // Improved decision logic
          const shouldKeep = colorDistance > colorThreshold || isEdge || maxGradient > edgeThreshold * 0.7

          if (shouldKeep) {
            // Keep pixel with full opacity
            newBuffer[index] = r
            newBuffer[index + 1] = g
            newBuffer[index + 2] = b
            newBuffer[index + 3] = 255
          } else {
            // Make background transparent with smooth transition
            const alpha = Math.max(0, Math.min(255, (colorDistance / colorThreshold) * 255))
            newBuffer[index] = r
            newBuffer[index + 1] = g
            newBuffer[index + 2] = b
            newBuffer[index + 3] = Math.round(alpha)
          }
        }
      }

      // Apply additional post-processing for smoother edges
      const processedBuffer = await sharp(newBuffer, {
        raw: {
          width: width!,
          height: height!,
          channels: 4
        }
      })
      .png({ quality: 100 })
      .toBuffer()

      // Return the processed image
      return new NextResponse(processedBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="no-bg-${file.name.replace(/\.[^/.]+$/, '')}.png"`,
          'Cache-Control': 'no-cache',
        },
      })

    } catch (processingError) {
      console.error('Error processing image:', processingError)
      return NextResponse.json({ 
        error: 'Failed to process image. Please try with a different image.' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in background removal API:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Background Remover API - Use POST to upload an image' 
  })
}
