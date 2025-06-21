import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document using pdf-lib
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();
    
    // Get all form fields
    const formFields = form.getFields();
    
    const fields: Array<{ name: string; type: string; value: string }> = [];

    // Process each form field
    for (const field of formFields) {
      try {
        const fieldName = field.getName();
        let fieldType = 'text';
        let fieldValue = '';

        // Determine field type and get current value
        if (field instanceof PDFTextField) {
          fieldType = 'text';
          fieldValue = field.getText() || '';
        } else if (field instanceof PDFCheckBox) {
          fieldType = 'checkbox';
          fieldValue = field.isChecked() ? 'true' : 'false';
        } else if (field instanceof PDFDropdown) {
          fieldType = 'select';
          const selected = field.getSelected();
          fieldValue = Array.isArray(selected) ? selected[0] || '' : selected || '';
        } else if (field instanceof PDFRadioGroup) {
          fieldType = 'radio';
          const selected = field.getSelected();
          fieldValue = Array.isArray(selected) ? selected[0] || '' : selected || '';
        }

        fields.push({
          name: fieldName,
          type: fieldType,
          value: fieldValue
        });
      } catch (error) {
        console.warn(`Error processing field:`, error);
        // Continue with other fields
      }
    }

    // Remove duplicates based on field name
    const uniqueFields = fields.filter((field, index, self) => 
      index === self.findIndex(f => f.name === field.name)
    );

    if (uniqueFields.length === 0) {
      return NextResponse.json({ 
        error: 'No fillable form fields found in this PDF. Please ensure the PDF contains form fields.',
        fields: []
      });
    }

    return NextResponse.json({ 
      fields: uniqueFields,
      message: `Found ${uniqueFields.length} fillable form fields`
    });

  } catch (error) {
    console.error('Error analyzing PDF form:', error);
    return NextResponse.json(
      { error: 'Failed to analyze PDF form. Please ensure the PDF contains fillable form fields.' },
      { status: 500 }
    );
  }
}
