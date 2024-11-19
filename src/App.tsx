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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'upload'>('upload');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('upload');
    setShowSuggestions(false);
    setUploadedFiles([]);
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
          // Only update if the new status is different or progress has changed
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

    // Switch to chat view if we have completed files
    const hasCompletedFiles = newFiles.some(file => file.status === 'completed');
    if (hasCompletedFiles) {
      setShowSuggestions(true);
      setActiveTab('chat');
    }
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
      />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === 'chat' ? 'MarketMaestro Assistant' : 'File Upload'}
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'chat' ? (
            <ChatInterface 
              showSuggestions={showSuggestions} 
              uploadedFiles={uploadedFiles}
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