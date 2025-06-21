import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fieldsData = formData.get('fields') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!fieldsData) {
      return NextResponse.json({ error: 'No form fields data provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Parse form fields data
    let fields;
    try {
      fields = JSON.parse(fieldsData);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid fields data format' }, { status: 400 });
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    // Get all form fields
    const formFields = form.getFields();

    // Fill form fields
    let filledFields = 0;
    for (const field of fields) {
      try {
        if (field.name && field.value) {
          // Try to find the field by name
          const pdfField = form.getField(field.name);
          
          if (pdfField) {
            // Check field type and fill accordingly
            if (pdfField instanceof PDFTextField) {
              pdfField.setText(field.value);
              filledFields++;
            } else if (pdfField instanceof PDFCheckBox) {
              // For checkboxes, set checked if value is truthy
              if (field.value.toLowerCase() === 'true' || field.value === '1' || field.value === 'yes') {
                pdfField.check();
                filledFields++;
              } else {
                pdfField.uncheck();
                filledFields++;
              }
            } else if (pdfField instanceof PDFDropdown || pdfField instanceof PDFRadioGroup) {
              // For dropdowns and radio groups, try to set the value
              try {
                pdfField.select(field.value);
                filledFields++;
              } catch (selectError) {
                console.warn(`Could not select value "${field.value}" for field "${field.name}"`);
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Could not fill field ${field.name}:`, error);
      }
    }

    // Optional: Flatten the form to make fields non-editable
    // Uncomment the next line if you want to make the form non-editable
    // form.flatten();

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();

    // Return the filled PDF
    return new NextResponse(filledPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="filled-${file.name}"`,
      },
    });

  } catch (error) {
    console.error('Error filling PDF form:', error);
    return NextResponse.json(
      { error: 'Failed to fill PDF form. Please ensure the PDF contains fillable form fields.' },
      { status: 500 }
    );
  }
}
