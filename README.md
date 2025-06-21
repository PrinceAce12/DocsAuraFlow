# DocsAuraFlow - Free Online Document & Image Processing Tools

A comprehensive suite of free online tools for document conversion, image processing, and AI-powered enhancements. Built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Document Converters
- **PDF to Word Converter** - Convert PDF files to editable Word documents with preserved formatting
- **Word to PDF Converter** - Transform Word documents to PDF format
- **Text to Word Converter** - Create Word documents from plain text
- **PDF Form Filler** - Fill and edit PDF forms online with AI-powered field detection

### Image Tools
- **Image Converter** - Convert between all major image formats (JPG, PNG, WebP, GIF, etc.)
- **AI Upscaler** - Enhance image quality using advanced AI algorithms (Real-ESRGAN)
- **Background Remover** - Remove backgrounds with precision using AI technology (RemBG)
- **Image Editor** - Professional image editing with real-time preview

## ✨ Key Improvements

### Enhanced AI Features
- **AI-Powered Upscaling**: Uses Real-ESRGAN model for superior image quality enhancement
- **AI Background Removal**: Leverages RemBG for precise background removal with transparency
- **Real-time Image Editing**: Live preview updates as you adjust settings

### Improved User Experience
- **Better Error Handling**: Comprehensive error messages and validation
- **Real-time Previews**: See changes instantly in image editor
- **Enhanced PDF Processing**: Better form field detection and text extraction
- **Transparent Backgrounds**: Proper PNG output with alpha channels

### Technical Enhancements
- **Modern API Integration**: Uses Replicate API for AI-powered features
- **Optimized Performance**: Debounced updates and efficient processing
- **Better File Handling**: Improved validation and error recovery
- **Enhanced SEO**: Comprehensive metadata and structured data

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp, Replicate API
- **PDF Processing**: pdf-lib, pdfjs-dist
- **Document Processing**: docx
- **AI Services**: Replicate API (Real-ESRGAN, RemBG)
- **Deployment**: Vercel

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DocsAuraFlow.git
   cd DocsAuraFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Configure the following variables:
   - `REPLICATE_API_TOKEN`: Your Replicate API token for AI features
   - `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`: Google AdSense ID (optional)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```env
# AI Features
REPLICATE_API_TOKEN=your_replicate_api_token

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_google_adsense_id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES=false
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run seo:generate` - Generate SEO metadata
- `npm run seo:validate` - Validate SEO configuration

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 SEO Optimization

- **Comprehensive Metadata**: Each tool has optimized title, description, and keywords
- **Structured Data**: JSON-LD schemas for better search engine understanding
- **Sitemap**: Auto-generated sitemap with proper priorities
- **Robots.txt**: Optimized crawling instructions
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing

## 🔒 Security & Privacy

- **No File Storage**: Files are processed in memory and deleted immediately
- **Secure Processing**: All processing happens server-side
- **No Registration**: No user accounts or data collection required
- **HTTPS Only**: Secure connections enforced
- **Input Validation**: Comprehensive file type and size validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Replicate** for AI model hosting
- **Real-ESRGAN** for image upscaling
- **RemBG** for background removal
- **pdf-lib** for PDF processing
- **Sharp** for image processing
- **Next.js** team for the amazing framework

## 📞 Support

For support, email support@docsauraflow.com or create an issue in this repository.

---

**DocsAuraFlow** - Making document and image processing accessible to everyone! 🚀
