import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, filename } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    // Split text into paragraphs
    const paragraphs = text.split('\n').map((line: string) => 
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ', // Handle empty lines
            font: 'Arial',
            size: 24, // 12pt font (size is in half-points)
          }),
        ],
        spacing: {
          after: 200, // Add spacing after each paragraph
        },
      })
    );

    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);

    // Set the filename
    const docFilename = filename ? `${filename}.docx` : 'converted-text.docx';

    // Return the document as a downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${docFilename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error converting text to Word:', error);
    return NextResponse.json(
      { error: 'Failed to convert text to Word document' },
      { status: 500 }
    );
  }
}
