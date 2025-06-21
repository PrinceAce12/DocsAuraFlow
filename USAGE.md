# PDF to Word Converter - Usage Guide

## Quick Start

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Upload a PDF:**
   - Drag and drop a PDF file onto the upload area, OR
   - Click the upload area to browse and select a PDF file

4. **Convert:**
   - Click the "Convert to Word" button
   - Wait for the conversion progress to complete

5. **Download:**
   - Click "Download Word Document" to save the converted .docx file
   - Use "Convert Another File" to process additional PDFs

## Features

### 🎯 Drag & Drop Upload
- Simply drag PDF files from your computer onto the upload area
- Instant file validation and size display
- Visual feedback during drag operations

### 📊 Real-time Progress
- Live conversion progress indicator
- Processing status updates
- Error handling with clear messages

### 💾 Smart Download
- Automatic file naming (removes .pdf, adds .docx)
- One-click download
- File size information display

### 🎨 Modern Interface
- Clean, responsive design
- Dark/light mode support
- Mobile-friendly layout
- Accessible components

## Supported Files

### ✅ What Works Best
- Text-based PDF documents
- PDFs with standard fonts
- Single or multi-page documents
- PDFs up to 50MB

### ⚠️ Limitations
- Image-only PDFs may not extract text
- Complex layouts might need manual adjustment
- Scanned documents require OCR (not included)
- Password-protected PDFs are not supported

## Technical Details

### Conversion Process
1. **Upload**: File validation and size checking
2. **Processing**: PDF.js extracts text content
3. **Generation**: docx library creates Word document
4. **Download**: Secure file delivery to browser

### Data Security
- Files are processed in memory only
- No permanent storage on server
- Automatic cleanup after conversion
- Client-side download handling

## Troubleshooting

### Common Issues

**"No text content could be extracted"**
- The PDF may contain only images
- Try a different PDF with text content
- Consider using OCR software first

**"Conversion failed"**
- Check file size (max 50MB)
- Ensure file is a valid PDF
- Try a different PDF file

**Upload not working**
- Verify file is PDF format
- Check browser compatibility
- Refresh the page and try again

### Browser Requirements
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### File Structure
```
src/
├── app/
│   ├── api/convert/route.ts    # Conversion API
│   ├── page.tsx               # Main page
│   └── layout.tsx             # App layout
├── components/
│   ├── FileUpload.tsx         # Upload interface
│   ├── ConversionProgress.tsx # Progress display
│   └── DownloadSection.tsx    # Download interface
```

## Tips for Best Results

1. **Use text-based PDFs** for optimal conversion quality
2. **Check file size** before upload (under 50MB recommended)
3. **Review converted documents** for formatting accuracy
4. **Use "Convert Another File"** for multiple conversions
5. **Clear browser cache** if experiencing issues

## Support

For issues or questions:
- Check the browser console for error messages
- Verify file format and size requirements
- Try with a different PDF file
- Report bugs in the project repository
