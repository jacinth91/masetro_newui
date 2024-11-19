import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface FileUploadProps {
  onSummarized: () => void;
  onFilesChange: (files: FileStatus[]) => void;
}

const MAX_FILES = 5;

const FileUpload: React.FC<FileUploadProps> = ({ onSummarized, onFilesChange }) => {
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFiles = (selectedFiles: File[]): { valid: File[], errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    if (selectedFiles.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed.`);
      return { valid, errors };
    }

    selectedFiles.forEach(file => {
      const isTextFile = file.type.includes('text/');
      const isPdfFile = file.type === 'application/pdf';
      
      if (!isTextFile && !isPdfFile) {
        errors.push(`${file.name} is not a text or PDF file`);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((newFiles: File[]) => {
    setError('');
    const { valid, errors } = validateFiles(newFiles);
    
    if (errors.length > 0) {
      setError(errors.join('. '));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const fileStatuses: FileStatus[] = valid.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading',
      progress: 0
    }));

    // Immediately start with upload progress at 50%
    const filesWithProgress = fileStatuses.map(file => ({
      ...file,
      progress: 50
    }));

    onFilesChange(filesWithProgress);

    // Simulate upload completion and start summarization
    setTimeout(() => {
      const uploadedFiles = filesWithProgress.map(file => ({
        ...file,
        status: 'summarizing' as const,
        progress: 100
      }));
      onFilesChange(uploadedFiles);

      // Complete summarization after a short delay
      setTimeout(() => {
        const completedFiles = uploadedFiles.map(file => ({
          ...file,
          status: 'completed' as const
        }));
        onFilesChange(completedFiles);
        onSummarized();
      }, 1500);
    }, 1500);
  }, [onFilesChange, onSummarized]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6">
      <div 
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`bg-white rounded-lg shadow-sm p-6 transition-all duration-200 ${
          isDragging 
            ? 'border-2 border-dashed border-blue-500 bg-blue-50' 
            : 'border-2 border-dashed border-gray-300'
        }`}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {isDragging ? 'Drop your files here' : 'Upload Files'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your files here, or click to select files
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: .txt, .md, .pdf, .json, .csv, .log, .xml, .yaml, .yml
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">
            Maximum {MAX_FILES} files allowed
          </p>
          <div className="mt-6">
            <input
              type="file"
              className="hidden"
              multiple
              accept=".txt,.md,.pdf,.json,.csv,.log,.xml,.yaml,.yml,text/*,application/pdf"
              onChange={handleFileInput}
              ref={fileInputRef}
            />
            <button
              onClick={openFileDialog}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Select Files
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;