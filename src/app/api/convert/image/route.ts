import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const outputFormat = formData.get('outputFormat') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!outputFormat) {
      return NextResponse.json({ error: 'No output format specified' }, { status: 400 });
    }

    // Validate supported formats
    const supportedFormats = ['png', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'];
    if (!supportedFormats.includes(outputFormat.toLowerCase())) {
      return NextResponse.json({ 
        error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process image with sharp
    let sharpInstance = sharp(buffer);
    
    // Apply format-specific processing
    switch (outputFormat.toLowerCase()) {
      case 'png':
        sharpInstance = sharpInstance.png({ quality: 90 });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: 90 });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: 90 });
        break;
      case 'gif':
        sharpInstance = sharpInstance.gif();
        break;
      case 'bmp':
        // Sharp doesn't support BMP output, convert to PNG instead
        sharpInstance = sharpInstance.png({ quality: 90 });
        break;
      case 'tiff':
        sharpInstance = sharpInstance.tiff({ quality: 90 });
        break;
    }

    const convertedBuffer = await sharpInstance.toBuffer();
    
    // Get original filename without extension
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const actualFormat = outputFormat.toLowerCase() === 'bmp' ? 'png' : outputFormat.toLowerCase();
    const filename = `${originalName}.${actualFormat}`;

    // Set appropriate content type
    const contentTypes: { [key: string]: string } = {
      'png': 'image/png',
      'jpeg': 'image/jpeg',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'tiff': 'image/tiff'
    };

    const contentType = contentTypes[actualFormat] || 'application/octet-stream';

    // Return the converted image
    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': convertedBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Image conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
}
