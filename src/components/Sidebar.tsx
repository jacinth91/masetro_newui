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


import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
  // Signal holding the current chatId
  private activeChatId = signal<string | null>(null);

  // Method to set a new chat ID
  setActiveChat(chatId: string) {
    this.activeChatId.set(chatId);
  }

  // Readable accessor for other components
  get chatId() {
    return this.activeChatId();
  }

  // Optional: expose a method returning the signal directly if needed
  getChatIdSignal() {
    return this.activeChatId;
  }
}
import { Component, effect } from '@angular/core';
import { ChatInputComponent } from '../../components/chat/chat-input/chat-input.component';
import { FileSummaryDialogComponent } from '../../components/chat/file-summary-dialog/file-summary-dialog.component';
import { SuggestedQueriesComponent } from '../../components/chat/suggested-queries/suggested-queries.component';
import { UploadFilesComponent } from '../../components/chat/upload-files/upload-files.component';
import { ChatMessageComponent } from '../../components/chat/chat-message/chat-message.component';
import { Chat, FileStatus, Message } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndexedDbService } from '../../services/indexed-db.service';
import { ChatStateService } from '../../signals/chat.signals';

@Component({
  selector: 'app-chat-interface',
  imports: [
    CommonModule,
    FormsModule,
    ChatInputComponent,
    FileSummaryDialogComponent,
    SuggestedQueriesComponent,
    UploadFilesComponent,
    ChatMessageComponent,
  ],
  providers:[IndexedDbService,ChatStateService],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.scss',
})
export class ChatInterfaceComponent {
  query = '';
  isLoading = false;
  showResults = false;
  selectedFile: FileStatus[] = [];
  files: FileStatus[] = [];
  summaryFile: any;
  isFirstMessage = true;
  chats: Chat[] = [];
  messages:Message[] = [];
  chatId: string | null = null;

  constructor(private indexedDB:IndexedDbService,private chatSignals:ChatStateService) {
    this.setupEffect()
  }

  ngOnInit(): void {

    this.files = []; // Initialize with uploaded files
   
   
  }
  setupEffect(){
    effect(()=>{
      this.chatId = this.chatSignals.chatId();
      console.log('active chat id',this.chatId)
    })
  }
  handleFileSummary($event: any) {
    this.summaryFile = $event;
    console.log(this.summaryFile);
  }

  handleFileSelect(file: FileStatus): void {
    const isSelected = this.selectedFile.some((f) => f.name === file.name);
    this.selectedFile = isSelected
      ? this.selectedFile.filter((f) => f.name !== file.name)
      : [...this.selectedFile, file];
  }
  handleNewFiles($event: any) {
    this.files = [...this.files, ...$event];
    console.log(this.files);
  }

  handleSubmit(): void {
    
    //if (!this.query.trim() || this.isLoading || !this.chatId) 
    if (!this.query) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: this.query,
    };
    
    this.updateChatMessages(newUserMessage);

    this.isLoading = true;
    this.showResults = false;

    setTimeout(() => {
      const responseContent = this.isFirstMessage
        ? 'Please upload relevant financial documents or reports for better assistance.'
        : 'Here are some insights based on your query.';

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
      };

      this.updateChatMessages(newAssistantMessage);
      this.query = '';
      this.isLoading = false;
      this.showResults = !this.isFirstMessage;
      this.isFirstMessage = false;
    }, 1000);
  }

  updateChatMessages(message: Message): void {
    // this.chats = this.chats.map((chat) =>
    //   chat.id === this.chatId
    //     ? { ...chat, messages: [...chat.messages, message] }
    //     : chat
    // );
    this.messages = [...this.messages,message]
    console.log(this.messages)
    this.indexedDB.addChat({id:(Date.now() +1).toString(),chat:[{message:this.messages}]})
    
  }
}
