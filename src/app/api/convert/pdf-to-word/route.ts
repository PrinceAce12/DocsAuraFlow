import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Import pdfjs-dist dynamically for server-side use
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Convert File to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Load the PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let allText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Group text items by their y-coordinate to form lines
      const lines: { [key: number]: string[] } = {};
      
      textContent.items.forEach((item: any) => {
        if (item.str) {
          const y = Math.round(item.transform[5]);
          if (!lines[y]) {
            lines[y] = [];
          }
          lines[y].push(item.str);
        }
      });
      
      // Sort lines by y-coordinate (top to bottom)
      const sortedYs = Object.keys(lines).map(Number).sort((a, b) => b - a);
      const pageText = sortedYs.map(y => lines[y].join(' ')).join('\n');
      
      allText += pageText + '\n\n';
    }

    // Create Word document
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    
    // Split text into paragraphs
    const paragraphs = allText.split('\n').map(line => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line.trim() || ' ', // Ensure non-empty text
            size: 24, // 12pt font
          }),
        ],
      });
    });

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Return the Word document
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${pdfFile.name.replace('.pdf', '.docx')}"`,
      },
    });

  } catch (error) {
    console.error('PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF to Word' },
      { status: 500 }
    );
  }
}
