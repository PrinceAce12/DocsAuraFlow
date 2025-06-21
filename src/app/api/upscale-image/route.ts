import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

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

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Calculate new dimensions
    const newWidth = Math.round(metadata.width * scaleFactor);
    const newHeight = Math.round(metadata.height * scaleFactor);

    // Upscale the image using Sharp with high-quality resampling
    const upscaledBuffer = await sharp(buffer)
      .resize(newWidth, newHeight, {
        kernel: sharp.kernel.lanczos3, // High-quality resampling algorithm
        fit: 'fill'
      })
      .png({ quality: 100 }) // Output as PNG for best quality
      .toBuffer();

    // Return the upscaled image
    return new NextResponse(upscaledBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="upscaled_${scaleFactor}x_${file.name.replace(/\.[^/.]+$/, '')}.png"`,
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
