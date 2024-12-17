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

import { Component, effect, inject } from '@angular/core';
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
import { ChatService } from '../../services/chat.service';

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
  providers:[IndexedDbService,ChatService],
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

  constructor(private chatState:ChatStateService,private llm :ChatService) {
    this.setupEffect()
  }

  // get activeChat(){
  //   return this.chatState.activeChat?.messages || []
  // }
  ngOnInit(): void {

    this.files = []; // Initialize with uploaded files

    if(!this.chatState.activeChatId()){
      this.chatState.createNewChat()
    }
   
  }

  loadNewChatSession():void{

  }
  setupEffect(){
    effect(()=>{
      this.chatId = this.chatState.activeChatId();
      console.log('active chat id',this.chatId)
      
      if(this.chatId){
        this.clearChatInterface()
      }
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

  getLLm_response(){
    this.llm.fetchResponses({'user_prompt': this.query}).subscribe({
      next: (response)=>{
        console.log(response)
       
        const newAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.llm_response,
        };
  
        this.updateChatMessages(newAssistantMessage);
        
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  handleSubmit(): void {
    //this.getLLm_response()
    console.log(this.query,'3434')
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
    this.getLLm_response();
    

   

    // setTimeout(() => {
    //   const responseContent = this.isFirstMessage
    //     ? 'Please upload relevant financial documents or reports for better assistance.'
    //     : 'Here are some insights based on your query.';

   
      
    
      
      this.query = '';
      this.isLoading = false;
      this.showResults = !this.isFirstMessage;
      this.isFirstMessage = false;
    // }, 1000);
  }

  updateChatMessages(message: Message): void {
    // this.chats = this.chats.map((chat) =>
    //   chat.id === this.chatId
    //     ? { ...chat, messages: [...chat.messages, message] }
    //     : chat
    // );
    this.messages = [...this.messages,message]
    console.log(this.messages)
    this.chatState.addMessages(this.messages)
    
  }
  clearChatInterface(){
    this.messages = []
    this.files = []
    this.query = ''
  }
}





uploadFileToS3(presignedUrl: any, file: any): Observable<number> {
  console.log(file,'764')
  const headers = new HttpHeaders({
    'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'POST ,GET'

  })
  const payload ={
    key:presignedUrl.fields.key,
    filename:file.name,
    file:file
  }
  console.log(presignedUrl)
  const formData = new FormData();
  Object.keys(presignedUrl.fields).forEach((key) => {
    
    formData.append(key, presignedUrl.fields[key]);
  });
 
  formData.append('file', file);
  
  console.log(formData,'formdata')
  for(const [key,value] of formData.entries()){
    console.log(key,value)
  }
  return this.http.post(presignedUrl.url, formData, {
    observe: 'events',
    reportProgress: true,
    headers:headers,

    
  }).pipe(
    map((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        return Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        console.log(event,'event')
        return 100; // Upload complete
      }
      return 0;
    })
  )
}
"target":"https://dev-summarize-api.edonpdev.cld1np.thehartford.com/generate-presigned-url/notify?filename=",
"target":"https://dev-summarize-api.edonpdev.cld1np.thehartford.com/generate-presigned-url/generate-summary",
You will provide that value has a GET param named object_keyto your /generate-summary