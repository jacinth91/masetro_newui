import React from 'react';
import { Upload, MessageSquare, LogOut, PlusCircle } from 'lucide-react';

interface Chat {
  id: string;
  messages: any[];
  files: any[];
}

interface SidebarProps {
  onTabChange: (tab: 'chat' | 'upload') => void;
  activeTab: 'chat' | 'upload';
  onLogout?: () => void;
  onNewChat: () => void;
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onTabChange,
  activeTab,
  onLogout,
  onNewChat,
  chats,
  activeChat,
  onChatSelect,
}) => {
  const menuItems = [
    { 
      icon: MessageSquare, 
      label: 'Chat', 
      value: 'chat' as const,
      hasAction: true
    },
    // { 
    //   icon: Upload, 
    //   label: 'Upload Files', 
    //   value: 'upload' as const 
    // }
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
        <img
          src="/harthfors_logo.png"
          alt="Hartford Logo"
          className="h-15 w-20"
        />
        <span className="text-xl font-semibold">Market Maestro</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div 
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div 
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => onTabChange(item.value)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{item.label}</span>
                </div>
                {item.hasAction && (
                  <button
                    onClick={onNewChat}
                    className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                    title="Start New Chat"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {chats.length > 0 && (
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent Chats
            </h3>
            <ul className="mt-2 space-y-1">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => onChatSelect(chat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeChat === chat.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="truncate">Chat {chat.id.slice(-4)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;



function addChatToExistingStore(chatId: string, messages: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChatDatabase'); // No version specified, will open existing DB

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('chats', 'readwrite');
      const store = transaction.objectStore('chats');

      const chatData = { id: chatId, messages };
      const putRequest = store.put(chatData);

      putRequest.onsuccess = () => {
        console.log(`Chat with ID "${chatId}" added/updated successfully.`);
        resolve();
      };

      putRequest.onerror = () => {
        console.error('Error adding/updating chat:', putRequest.error);
        reject(putRequest.error);
      };
    };

    request.onerror = () => {
      console.error('Error opening the database:', request.error);
      reject(request.error);
    };
  });
}
