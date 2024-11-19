import React, { useState, useRef, useEffect } from 'react';
import QueryResult from './QueryResult';
import UploadedFiles from './UploadedFiles';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import FileSummaryDialog from './FileSummaryDialog';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  files?: string[]; // Add files property to track which files were queried
}

interface ChatInterfaceProps {
  showSuggestions: boolean;
  uploadedFiles: FileStatus[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ showSuggestions, uploadedFiles = [] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileStatus[]>([]);
  const [summaryFile, setSummaryFile] = useState<FileStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const selectedFileNames = selectedFiles.map(f => f.name);
    const fileContext = selectedFiles.length > 0 
      ? `Based on ${selectedFiles.length === 1 ? 'file' : 'files'}: ${selectedFileNames.join(', ')}`
      : '';

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      files: selectedFileNames
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setShowResults(false);

    // Simulate API response
    setTimeout(() => {
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `${fileContext}\n\nHere are the financial metrics based on your query:`,
        files: selectedFileNames
      };

      setMessages(prev => [...prev, newAssistantMessage]);
      setQuery('');
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const toggleFileSelection = (file: FileStatus) => {
    setSelectedFiles(prev => {
      const isSelected = prev.some(f => f.name === file.name);
      if (isSelected) {
        return prev.filter(f => f.name !== file.name);
      } else {
        return [...prev, file];
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Main chat area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              showResults={showResults}
              messagesEndRef={messagesEndRef}
            />
          </div>

          {/* Right sidebar with uploaded files */}
          <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto">
            {showSuggestions && (
              <UploadedFiles
                files={uploadedFiles}
                selectedFiles={selectedFiles}
                onFileSelect={toggleFileSelection}
                onFileClick={setSummaryFile}
              />
            )}
          </div>
        </div>
      </div>

      <ChatInput
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        selectedFiles={selectedFiles}
      />

      <FileSummaryDialog
        file={summaryFile}
        onClose={() => setSummaryFile(null)}
      />
    </div>
  );
};

export default ChatInterface;