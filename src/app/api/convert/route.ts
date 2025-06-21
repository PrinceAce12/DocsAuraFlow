import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Type definitions for PDF.js
interface TextItem {
  str: string;
  transform: number[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Dynamic import of PDF.js for Node.js compatibility
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Load PDF document
    const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    const numPages = pdfDocument.numPages;

    const paragraphs: Paragraph[] = [];

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      
      // Extract text content
      const textContent = await page.getTextContent();
      
      if (textContent.items.length > 0) {
        // Add page number if not first page
        if (pageNum > 1) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `\n--- Page ${pageNum} ---\n`,
                  bold: true,
                }),
              ],
            })
          );
        }

        // Group text items by approximate line
        const lines: TextItem[][] = [];
        let currentLine: TextItem[] = [];
        let lastY = -1;

        (textContent.items as TextItem[]).forEach((item: TextItem) => {
          if (item.str && item.str.trim()) {
            const y = Math.round(item.transform[5]);
            
            if (lastY !== -1 && Math.abs(y - lastY) > 5) {
              if (currentLine.length > 0) {
                lines.push([...currentLine]);
                currentLine = [];
              }
            }
            
            currentLine.push(item);
            lastY = y;
          }
        });

        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        // Convert lines to paragraphs
        lines.forEach((line) => {
          const text = line.map((item: TextItem) => item.str).join(' ').trim();
          if (text) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: text,
                  }),
                ],
              })
            );
          }
        });
      }
    }

    // If no text was extracted, add a message
    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'No text content could be extracted from this PDF. The PDF may contain only images or have a complex layout.',
            }),
          ],
        })
      );
    }

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate Word document buffer
    const buffer = await Packer.toBuffer(doc);

    // Return the Word document
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="converted.docx"',
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF to Word' },
      { status: 500 }
    );
  }
}
