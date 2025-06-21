import { NextRequest, NextResponse } from 'next/server'

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

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Image}`

    // Use Replicate API for AI-powered background removal
    const replicateApiToken = process.env.REPLICATE_API_TOKEN
    
    if (!replicateApiToken) {
      return NextResponse.json({ error: 'AI background removal service not configured' }, { status: 500 })
    }

    // Use RemBG model for high-quality background removal
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        input: {
          image: dataUrl,
          alpha_matting: true,
          alpha_matting_foreground_threshold: 240,
          alpha_matting_background_threshold: 10,
          alpha_matting_erode_size: 10,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start AI background removal process')
    }

    const prediction = await response.json()
    
    // Poll for completion
    let result
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${replicateApiToken}`,
        },
      })
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check background removal status')
      }
      
      const status = await statusResponse.json()
      
      if (status.status === 'succeeded') {
        result = status.output
        break
      } else if (status.status === 'failed') {
        throw new Error('AI background removal failed')
      }
      
      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }
    
    if (!result) {
      throw new Error('Background removal timed out')
    }

    // Download the processed image
    const imageResponse = await fetch(result)
    if (!imageResponse.ok) {
      throw new Error('Failed to download processed image')
    }
    
    const processedBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // Return the processed image with transparent background
    return new NextResponse(processedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="no-bg-${file.name.replace(/\.[^/.]+$/, '')}.png"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error in background removal API:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred during background removal' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Background Remover API - Use POST to upload an image' 
  })
}
