import React, { useRef } from 'react';
import { Send, Loader2, FileText } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface ChatInputProps {
  query: string;
  isLoading: boolean;
  selectedFile: FileStatus[];
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  query, 
  isLoading, 
  selectedFile,
  onQueryChange, 
  onSubmit 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
console.log('selected files ',selectedFile)
  return (
    <div className="px-4 pb-4">
      <div className="mx-auto max-w-3xl">
      {selectedFile.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFile.map((file) => (
          
              <div key={file.name} className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={textareaRef}
            rows={1}
            className="block w-full px-4 py-3 pr-20 text-gray-900 placeholder-gray-500 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
            style={{
              minHeight: '56px',
              maxHeight: '200px'
            }}
            placeholder={selectedFile.length > 0 
              ? `Ask about the selected ${selectedFile.length === 1 ? 'file' : 'files'}...`
              : "Ask about Q3 2024 financial metrics..."
            }
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 bottom-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="mt-2 text-xs text-center text-gray-500">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;