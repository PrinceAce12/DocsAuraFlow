interface ConversionProgressProps {
  progress: number;
  status?: string;
  fileName?: string;
}

export default function ConversionProgress({ progress, status, fileName }: ConversionProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Converting your PDF...
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}% Complete
        </span>
      </div>
    </div>
  );
}
