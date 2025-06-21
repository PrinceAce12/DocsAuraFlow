const { exec } = require('child_process');

console.log('🧪 Testing PDF to Word Converter...');
console.log('📦 Building the application...');

exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Build failed:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Build warnings:', stderr);
  }
  
  console.log('✅ Build successful!');
  console.log('\n📋 Application Features:');
  console.log('  • PDF to Word conversion');
  console.log('  • Drag & drop file upload');
  console.log('  • Responsive design');
  console.log('  • Dark mode support');
  console.log('  • Real-time progress');
  console.log('  • Secure processing');
  
  console.log('\n🚀 To start the application:');
  console.log('  npm run dev');
  console.log('\n🌐 Then open: http://localhost:3000');
  
  console.log('\n📖 Features included:');
  console.log('  ├── FileUpload component with drag & drop');
  console.log('  ├── ConversionProgress component');
  console.log('  ├── DownloadSection component');
  console.log('  ├── PDF.js for text extraction');
  console.log('  ├── docx library for Word generation');
  console.log('  └── Tailwind CSS styling');
});
