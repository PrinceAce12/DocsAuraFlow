import { NextRequest, NextResponse } from 'next/server';

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
    const uint8Array = new Uint8Array(arrayBuffer);

    // Dynamically import pdfjs-dist for server-side use
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument(uint8Array);
    const pdf = await loadingTask.promise;

    const fields: Array<{ name: string; type: string; value: string }> = [];

    // Iterate through all pages to find form fields
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const annotations = await page.getAnnotations();

      for (const annotation of annotations) {
        // Check if annotation is a form field
        if (annotation.subtype === 'Widget' && annotation.fieldName) {
          let fieldType = 'text';
          
          // Determine field type based on annotation properties
          if (annotation.fieldType === 'Tx') {
            fieldType = annotation.multiLine ? 'textarea' : 'text';
          } else if (annotation.fieldType === 'Ch') {
            fieldType = 'select';
          } else if (annotation.fieldType === 'Btn') {
            fieldType = annotation.checkBox ? 'checkbox' : 'radio';
          }

          // Only add text-based fields for now
          if (fieldType === 'text' || fieldType === 'textarea') {
            fields.push({
              name: annotation.fieldName,
              type: fieldType,
              value: annotation.fieldValue || ''
            });
          }
        }
      }
    }

    // Remove duplicates based on field name
    const uniqueFields = fields.filter((field, index, self) => 
      index === self.findIndex(f => f.name === field.name)
    );

    return NextResponse.json({ 
      fields: uniqueFields,
      message: `Found ${uniqueFields.length} fillable form fields`
    });

  } catch (error) {
    console.error('Error analyzing PDF form:', error);
    return NextResponse.json(
      { error: 'Failed to analyze PDF form' },
      { status: 500 }
    );
  }
}
