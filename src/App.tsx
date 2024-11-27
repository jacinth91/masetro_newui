import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import LoginScreen from './components/auth/LoginScreen';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface Chat {
  id: string;
  messages: any[];
  files: FileStatus[];
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'upload'>('chat');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('upload');
    setShowSuggestions(false);
    setUploadedFiles([]);
    setChats([]);
    setActiveChat(null);
  };

  const handleFilesSummarized = () => {
    setShowSuggestions(true);
    setActiveTab('chat');
  };

  const handleFilesChange = (newFiles: FileStatus[]) => {
    if (!Array.isArray(newFiles)) {
      console.error('Expected an array of files');
      return;
    }

    setUploadedFiles(prevFiles => {
      const filesMap = new Map(prevFiles.map(file => [file.name, file]));
      
      newFiles.forEach(file => {
        if (file && file.name) {
          const existingFile = filesMap.get(file.name);
          if (!existingFile || 
              existingFile.status !== file.status || 
              existingFile.progress !== file.progress) {
            filesMap.set(file.name, file);
          }
        }
      });
      
      return Array.from(filesMap.values());
    });

    const hasCompletedFiles = newFiles.some(file => file.status === 'completed');
    if (hasCompletedFiles) {
      setShowSuggestions(true);
      setActiveTab('chat');
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      messages: [],
      files: []
    };
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat.id);
    setActiveTab('chat');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        onTabChange={setActiveTab} 
        activeTab={activeTab}
        onLogout={handleLogout}
        onNewChat={handleNewChat}
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
      />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === 'chat' ? 'Market Maestro Assistant' : 'File Upload'}
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'chat' ? (
            <ChatInterface 
              showSuggestions={showSuggestions} 
              uploadedFiles={uploadedFiles}
              chatId={activeChat}
              chats={chats}
              onUpdateChats={setChats}
            />
          ) : (
            <FileUpload 
              onSummarized={handleFilesSummarized}
              onFilesChange={handleFilesChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;