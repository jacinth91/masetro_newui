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
          <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === 'chat' ? 'Market Maestro Assistant' : 'File Upload'}
            </h1>
          </div>
        </header>

        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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





/**
 * Environment Configuration for API URLs and Azure Client ID with Host Detection
 */

const getHostEnv = (hostOverride) => {
  let host = window.location.hostname || '';

  if (hostOverride) {
    host = hostOverride;
  }

  if (host === 'localhost') {
    return 'LOCAL';
  }

  host = host.split(/[-.]/)[0] || '';

  if (host === 'int') {
    return 'DEV';
  }

  if (host === 'objection') {
    return 'PROD';
  }

  const knownHosts = ['dev', 'qa', 'prod'];
  return knownHosts.includes(host) ? host.toUpperCase() : 'DEV';
};

const environment = getHostEnv();

/**
 * API Configuration based on environment
 */
const apiConfigs = {
  LOCAL: {
    baseUrl: '',
    bucket: '/v1/bucket',
    realtime: '/v1/realtime',
    notify: '/v1/notify',
    res: '/v2/res',
    rag: '/v2/rag',
    chat: '/v1/chat',
    bucketRag: '/rag/bucket',
    azureClientId: 'LOCAL_AZURE_CLIENT_ID'
  },
  DEV: {
    baseUrl: 'https://dev-summarize-api.edonpdev.cld1np.thehartford.com',
    bucket: '/v1/bucket',
    realtime: '/v1/realtime',
    notify: '/v1/notify',
    res: '/v2/res',
    rag: '/v2/rag',
    chat: '/v1/chat',
    bucketRag: '/rag/bucket',
    azureClientId: 'DEV_AZURE_CLIENT_ID'
  },
  QA: {
    baseUrl: 'https://qa-summarize-api.edonpdev.cld1np.thehartford.com',
    bucket: '/v1/bucket',
    realtime: '/v1/realtime',
    notify: '/v1/notify',
    res: '/v2/res',
    rag: '/v2/rag',
    chat: '/v1/chat',
    bucketRag: '/rag/bucket',
    azureClientId: 'QA_AZURE_CLIENT_ID'
  },
  PROD: {
    baseUrl: 'https://api.your-production-domain.com',
    bucket: '/v1/bucket',
    realtime: '/v1/realtime',
    notify: '/v1/notify',
    res: '/v2/res',
    rag: '/v2/rag',
    chat: '/v1/chat',
    bucketRag: '/rag/bucket',
    azureClientId: 'PROD_AZURE_CLIENT_ID'
  },
};

/**
 * Azure Client ID Configuration
 */
const getAzureClientId = () => {
  switch (environment) {
    case 'DEV':
      return apiConfigs.DEV.azureClientId;
    case 'QA':
      return apiConfigs.QA.azureClientId;
    case 'PROD':
      return apiConfigs.PROD.azureClientId;
    default:
      return apiConfigs.LOCAL.azureClientId;
  }
};

/**
 * API Configuration Export
 */
export const ApiConfig = {
  getUrl: (key) => {
    const config = apiConfigs[environment];
    if (!config) {
      throw new Error(`Environment configuration for '${environment}' not found.`);
    }
    return `${config.baseUrl}${config[key]}`;
  },
  getAzureClientId: getAzureClientId,
  environment: environment,
};
