"use client";

interface DownloadSectionProps {
  convertedFile?: Blob;
  originalFileName?: string;
  downloadUrl?: string;
  fileName?: string;
  fileUrl?: string;
  onReset: () => void;
  title?: string;
  description?: string;
}

export default function DownloadSection({ 
  convertedFile, 
  originalFileName, 
  downloadUrl, 
  fileName, 
  fileUrl, 
  onReset,
  title = "Conversion Complete!",
  description = "Your file has been successfully converted."
}: DownloadSectionProps) {
  const handleDownload = () => {
    let url: string;
    let downloadFileName: string;
    
    if (convertedFile && originalFileName) {
      // Legacy blob-based download
      url = URL.createObjectURL(convertedFile);
      downloadFileName = originalFileName.replace(/\.pdf$/i, '') + '.docx';
    } else {
      // New URL-based download
      url = downloadUrl || fileUrl || '';
      downloadFileName = fileName || 'download';
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (convertedFile) {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Conversion Complete!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your PDF has been successfully converted to a Word document.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Word Document</span>
        </button>
        
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Convert Another File
        </button>
      </div>
      
      {convertedFile && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>File size: {(convertedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
}
