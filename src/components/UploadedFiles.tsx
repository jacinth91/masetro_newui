import React from 'react';
import { FileText, Loader2, Check } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface UploadedFilesProps {
  files: FileStatus[];
  selectedFiles: FileStatus[];
  onFileSelect: (file: FileStatus) => void;
  onFileClick: (file: FileStatus) => void;
}

const UploadedFiles: React.FC<UploadedFilesProps> = ({ 
  files, 
  selectedFiles, 
  onFileSelect,
  onFileClick
}) => {
  const getFileIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'summarizing':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'summarizing':
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Uploaded Files {selectedFiles.length > 0 && `(${selectedFiles.length} selected)`}
      </h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex space-x-2">
            <button
              onClick={() => onFileSelect(file)}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                selectedFiles.some(f => f.name === file.name)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(file.status)}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {file.status === 'uploading' && 'Uploading...'}
                    {file.status === 'summarizing' && 'Summarizing...'}
                    {file.status === 'completed' && 'Ready'}
                    {file.status === 'error' && 'Error'}
                  </p>
                  {(file.status === 'uploading' || file.status === 'summarizing') && typeof file.progress === 'number' && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          file.status === 'uploading' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
            {file.status === 'completed' && (
              <button
                onClick={() => onFileClick(file)}
                className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                title="View Summary"
              >
                <FileText className="h-5 w-5 text-gray-400 hover:text-blue-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFiles;