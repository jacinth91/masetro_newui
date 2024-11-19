import React, { useState, useEffect } from 'react';
import { X, Loader2, FileText, Check } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileStatus[];
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({ isOpen, onClose, files }) => {
  const [summaryProgress, setSummaryProgress] = useState<Record<string, number>>({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isSummarizing) {
      // Simulate progress for each file
      files.forEach((file) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setSummaryProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
          
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 500);

        return () => clearInterval(interval);
      });

      // Complete summarization after all files are processed
      const totalTime = 2000;
      setTimeout(() => {
        setIsSummarizing(false);
        setShowResults(true);
      }, totalTime);
    }
  }, [isSummarizing, files]);

  if (!isOpen) return null;

  const handleSummarize = () => {
    setIsSummarizing(true);
    setSummaryProgress({});
  };

  const getStatusIcon = (status: string, fileName: string) => {
    if (isSummarizing) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    return status === 'completed' ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {isSummarizing ? (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Summarizing Files</h3>
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      </div>
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${summaryProgress[file.name] || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {summaryProgress[file.name] ? `${summaryProgress[file.name]}% complete` : 'Starting...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : showResults ? (
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-4">
                Files Summarized Successfully
              </h3>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm bg-gray-50 p-3 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 flex-1">{file.name}</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to Summarize</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm bg-gray-50 p-3 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 flex-1">{file.name}</span>
                      <span className="text-gray-500">{file.size}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSummarize}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Start Summarization
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryDialog;