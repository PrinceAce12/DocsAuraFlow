import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PDFForm } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const formDataString = formData.get('formData') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!formDataString) {
      return NextResponse.json({ error: 'No form data provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Parse form data
    const fieldData = JSON.parse(formDataString);

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    // Fill form fields
    for (const [fieldName, fieldValue] of Object.entries(fieldData)) {
      try {
        const field = form.getTextField(fieldName);
        if (field && typeof fieldValue === 'string') {
          field.setText(fieldValue);
        }
      } catch (error) {
        // Field might not exist or might be a different type
        console.warn(`Could not fill field ${fieldName}:`, error);
      }
    }

    // Flatten the form to make fields non-editable (optional)
    // form.flatten();

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();

    // Return the filled PDF as a blob
    return new NextResponse(filledPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="filled-form.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error filling PDF form:', error);
    return NextResponse.json(
      { error: 'Failed to fill PDF form' },
      { status: 500 }
    );
  }
}
