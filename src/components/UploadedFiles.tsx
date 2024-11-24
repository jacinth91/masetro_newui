import React, { useRef } from 'react';
import { FileText, Loader2, Check, Plus } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface UploadedFilesProps {
  files: FileStatus[];
  selectedFile: FileStatus | null;
  onFileSelect: (file: FileStatus) => void;
  onAddFiles?: (files: File[]) => void;
  onFileClick: (file: FileStatus) => void;
 
}

const UploadedFiles: React.FC<UploadedFilesProps> = ({ 
  files, 
  selectedFile, 
  onFileSelect,
  onFileClick,
  onAddFiles
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAddFiles) {
      onAddFiles(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  

  if (files.length === 0) return null;

  return (
    <div className="mt-6">
       <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Uploaded Files
        </h3>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Add more files"
        >
          <Plus className="h-4 w-4 text-gray-500 mr-1" />
          <span>Add Files</span>
        </button>
      </div>
      <input
        type="file"
        className="hidden"
        multiple
        accept=".txt,.md,.pdf,.json,.csv,.log,.xml,.yaml,.yml,text/*,application/pdf"
        onChange={handleFileInput}
        ref={fileInputRef}
      />
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex space-x-2">
             <button
            key={index}
            onClick={() => onFileSelect(file)}
            className={`w-full p-3 rounded-lg border transition-colors ${
              selectedFile?.name === file.name
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