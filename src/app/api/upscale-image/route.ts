import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const scaleFactor = Number(formData.get('scaleFactor')) || 2;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 });
    }

    // Validate scale factor
    if (scaleFactor < 1 || scaleFactor > 4) {
      return NextResponse.json({ error: 'Scale factor must be between 1 and 4' }, { status: 400 });
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    // Use Replicate API for AI-powered upscaling
    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!replicateApiToken) {
      return NextResponse.json({ error: 'AI upscaling service not configured' }, { status: 500 });
    }

    // Use Real-ESRGAN model for high-quality upscaling
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "42a996d39a96aedc57b2e0aa8105dea39a9f14ac0f5c5d7cbb1e4e1e2c0c0c0c0c",
        input: {
          image: dataUrl,
          scale: scaleFactor,
          face_enhance: true,
          tile_size: 400,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start AI upscaling process');
    }

    const prediction = await response.json();
    
    // Poll for completion
    let result;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${replicateApiToken}`,
        },
      });
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check upscaling status');
      }
      
      const status = await statusResponse.json();
      
      if (status.status === 'succeeded') {
        result = status.output;
        break;
      } else if (status.status === 'failed') {
        throw new Error('AI upscaling failed');
      }
      
      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
    
    if (!result) {
      throw new Error('Upscaling timed out');
    }

    // Download the upscaled image
    const imageResponse = await fetch(result);
    if (!imageResponse.ok) {
      throw new Error('Failed to download upscaled image');
    }
    
    const upscaledBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Return the upscaled image
    return new NextResponse(upscaledBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="ai-upscaled_${scaleFactor}x_${file.name.replace(/\.[^/.]+$/, '')}.png"`,
      },
    });

  } catch (error) {
    console.error('Error upscaling image:', error);
    return NextResponse.json(
      { error: 'Failed to upscale image. Please try again.' },
      { status: 500 }
    );
  }
}
