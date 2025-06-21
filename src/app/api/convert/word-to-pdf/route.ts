import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('word') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a Word document (.doc or .docx).' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from Word document using mammoth
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages.length > 0) {
      console.warn('Mammoth warnings:', result.messages);
    }

    const text = result.value;

    // Create PDF using PDFKit
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set up PDF content
    doc.font('Helvetica')
       .fontSize(12)
       .fillColor('#000000');

    // Split text into paragraphs and add to PDF
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    paragraphs.forEach((paragraph, index) => {
      if (index > 0) {
        doc.moveDown(0.5);
      }
      
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
      }
      
      doc.text(paragraph.trim(), {
        width: 495,
        align: 'justify'
      });
    });

    // Finalize PDF
    doc.end();

    // Collect PDF data
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    return new Promise<NextResponse>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        
        resolve(new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|rtf)$/i, '.pdf')}"`,
          },
        }));
      });
    });

  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert Word to PDF. Please try again.' },
      { status: 500 }
    );
  }
}
