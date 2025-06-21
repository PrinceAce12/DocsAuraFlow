# PDF to Word Converter

A modern, responsive web application built with Next.js 15.3.3 that converts PDF documents to editable Word (.docx) files. This application provides a clean, user-friendly interface with drag-and-drop functionality and real-time conversion progress.

## Features

- 📄 **PDF to Word Conversion**: Convert PDF files to editable Word documents
- 🎯 **Drag & Drop Interface**: Easy file upload with drag and drop support
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support**: Automatic dark/light mode based on system preferences
- ⚡ **Fast Processing**: Quick conversion using optimized PDF parsing
- 🔒 **Secure**: Files are processed on the server and not stored permanently
- ✨ **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: PDF.js for text extraction
- **Word Generation**: docx library for creating Word documents
- **File Handling**: Native Web APIs for file upload and download

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload PDF**: 
   - Drag and drop a PDF file onto the upload area, or
   - Click the upload area to browse and select a PDF file

2. **Convert**: 
   - Click the "Convert to Word" button
   - Wait for the conversion to complete

3. **Download**: 
   - Once conversion is complete, click "Download Word Document"
   - The converted file will be saved as a .docx file

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # PDF conversion API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── components/
│   ├── ConversionProgress.tsx   # Progress indicator
│   ├── DownloadSection.tsx      # Download interface
│   └── FileUpload.tsx          # File upload component
```

## API Endpoints

### POST /api/convert

Converts a PDF file to Word format.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'pdf' field containing the PDF file

**Response:**
- Success: Word document (.docx file)
- Error: JSON with error message

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Limitations

- Text-based PDFs work best
- Image-only PDFs may not extract text content
- Complex layouts may require manual formatting adjustments
- Maximum file size: 50MB

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
