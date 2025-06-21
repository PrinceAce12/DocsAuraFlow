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
    
    // Extract text from each page with improved formatting
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Improved text extraction with better formatting
      const lines: { [key: number]: { text: string; x: number }[] } = {};
      
      textContent.items.forEach((item: any) => {
        if (item.str && item.str.trim()) {
          const y = Math.round(item.transform[5]);
          const x = Math.round(item.transform[4]);
          
          if (!lines[y]) {
            lines[y] = [];
          }
          lines[y].push({ text: item.str, x });
        }
      });
      
      // Sort lines by y-coordinate (top to bottom) and sort items within each line by x-coordinate
      const sortedYs = Object.keys(lines).map(Number).sort((a, b) => b - a);
      
      let pageText = '';
      sortedYs.forEach((y, index) => {
        // Sort items within the line by x-coordinate (left to right)
        const sortedItems = lines[y].sort((a, b) => a.x - b.x);
        const lineText = sortedItems.map(item => item.text).join(' ');
        
        if (lineText.trim()) {
          pageText += lineText + '\n';
        }
      });
      
      // Add page separator if not the last page
      if (pageNum < pdf.numPages) {
        pageText += '\n--- Page ' + pageNum + ' ---\n\n';
      }
      
      allText += pageText;
    }

    // Create Word document with improved formatting
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
    
    // Split text into paragraphs and create Word document
    const paragraphs = allText.split('\n').map(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        return new Paragraph({
          children: [new TextRun({ text: ' ', break: 1 })],
        });
      }
      
      // Check if this is a page separator
      if (trimmedLine.startsWith('--- Page')) {
        return new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { before: 400, after: 400 },
        });
      }
      
      return new Paragraph({
        children: [
          new TextRun({
            text: trimmedLine,
            size: 24, // 12pt font
          }),
        ],
        spacing: { after: 200 },
      });
    });

    // Create document with proper structure
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
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
      { error: 'Failed to convert PDF to Word. Please ensure the PDF contains extractable text.' },
      { status: 500 }
    );
  }
}
