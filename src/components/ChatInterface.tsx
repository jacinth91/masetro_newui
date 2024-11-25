import React, { useState, useRef, useEffect } from 'react';
import SuggestedQueries from './SuggestedQueries';
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
}
interface Chat {
  id: string;
  messages: Message[];
  files: FileStatus[];
}

interface ChatInterfaceProps {
  showSuggestions: boolean;
  chatId: string | null;
  uploadedFiles: FileStatus[];
  chats: Chat[];
  onUpdateChats: (chats: Chat[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = (
  { 
  showSuggestions,
  uploadedFiles = [],
  chatId,
  chats,
  onUpdateChats }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileStatus[]>([]);
    const [files, setFiles] = useState<FileStatus[]>(uploadedFiles);
    const [summaryFile, setSummaryFile] = useState<FileStatus | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    const currentChat = chats.find(chat => chat.id === chatId);
    const messages = currentChat?.messages || [];

    const handleFileSelect = (file: FileStatus) => {
      setSelectedFile(prev => {
        const isSelected = prev.some(f => f.name === file.name);
        if (isSelected) {
          return prev.filter(f => f.name !== file.name);
        } else {
          return [...prev, file];
        }
      });
  
      
    };
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);
  
    useEffect(() => {
      setFiles(uploadedFiles);
    }, [uploadedFiles]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim() || isLoading || !chatId) return;
  
      const newUserMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query
      };
  
      onUpdateChats(chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newUserMessage]
          };
        }
        return chat;
      }));
  
      setIsLoading(true);
      setShowResults(false);
  
      // Simulate API response
      setTimeout(() => {
        const newAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Here are the financial metrics based on your query:'
        };
  
        onUpdateChats(chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newAssistantMessage]
            };
          }
          return chat;
        }));
  
        setQuery('');
        setIsLoading(false);
        setShowResults(true);
      }, 1000);
    };
  
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const handleAddFiles = (newFiles: File[]) => {
      const fileStatuses: FileStatus[] = newFiles.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading',
        progress: 0
      }));
  
      const filesWithProgress = fileStatuses.map(file => ({
        ...file,
        progress: 50
      }));
  
      setFiles(prevFiles => [...prevFiles, ...filesWithProgress]);
  
      setTimeout(() => {
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          filesWithProgress.forEach(file => {
            const index = updatedFiles.findIndex(f => f.name === file.name);
            if (index !== -1) {
              updatedFiles[index] = {
                ...file,
                status: 'summarizing' as const,
                progress: 100
              };
            }
          });
          return updatedFiles;
        });
  
        setTimeout(() => {
          setFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            filesWithProgress.forEach(file => {
              const index = updatedFiles.findIndex(f => f.name === file.name);
              if (index !== -1) {
                updatedFiles[index] = {
                  ...file,
                  status: 'completed' as const
                };
              }
            });
            return updatedFiles;
          });
        }, 1500);
      }, 1500);
    };
  
    // if (!chatId) {
    //   return (
    //     <div className="flex items-center justify-center h-full">
    //       <p className="text-gray-500">Select a chat or start a new one</p>
    //     </div>
    //   );
    // }
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

          {/* Right sidebar with suggestions and files */}
          <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto">
            {showSuggestions && (
              <>
                <SuggestedQueries
                   selectedFileName={selectedFile.map(f => f.name)}
                   onQuerySelect={(query) => setQuery(query)}
                />
                <UploadedFiles
                  files={files}
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onFileClick={setSummaryFile}
                  onAddFiles={handleAddFiles}                 />
              </>
            )}
          </div>
        </div>
      </div>

      <ChatInput
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        selectedFile={selectedFile}      />

      <FileSummaryDialog
        file={summaryFile}
        onClose={() => setSummaryFile(null)}
      />
    </div>
  );
};

export default ChatInterface;