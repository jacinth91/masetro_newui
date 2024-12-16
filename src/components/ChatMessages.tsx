import React from 'react';
import { Loader2 } from 'lucide-react';
import QueryResult from './QueryResult';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  showResults: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  showResults, 
  messagesEndRef 
}) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-2xl rounded-lg px-4 py-2 ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p>{message.content}</p>
            {message.type === 'assistant' && showResults && (
              <QueryResult metrics={[]} />
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

import { Component, EventEmitter, Input, Output,ViewChild, ElementRef } from '@angular/core';
import { FileStatus, FileSummary } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { LucideAngularModule,FileText, KeyRound, LogIn, Plus } from 'lucide-angular';



@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  imports:[CommonModule,LucideAngularModule]
  
})
export class UploadFilesComponent {
  summary = {
    
      keyPoints: [
        { title: "Revenue Growth", description: "12% YoY increase in Q3 2024", type: "positive" },
        { title: "Market Share", description: "Expanded by 2.5% in key markets", type: "positive" },
        { title: "Risk Factors", description: "Increased exposure in emerging markets", type: "warning" }
      ],
      metrics: [
        { label: "Total Revenue", value: "$5.2B", change: "+12%" },
        { label: "Operating Margin", value: "24.3%", change: "+1.5%" },
        { label: "Customer Base", value: "2.1M", change: "+8%" }
      ],
      recommendations: [
        "Focus on expanding digital transformation initiatives",
        "Consider strategic acquisitions in growing markets",
        "Strengthen risk management protocols"
      ]
    
    
  }
  @Input() files: FileStatus[] = [];
  @Input() selectedFile?: FileStatus[] ;
  @Output() fileSelect = new EventEmitter<FileStatus>();
  @Output() fileClick = new EventEmitter<any>();
  @Output() addFiles = new EventEmitter<FileStatus[]>();
  @Output() onFilesChange = new EventEmitter<FileStatus[]>();
  @Output() onSummarized = new EventEmitter<FileStatus[]>();
  MAX_FILES = 5;
  isDragging = false;
  error = '';


  readonly filetext = FileText
  readonly keyRound = KeyRound;
  readonly LogIn = LogIn;
  readonly Plus = Plus;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  getFileIconColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'summarizing':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✔'; // Replace with an icon or SVG
      case 'error':
        return '✖'; // Replace with an icon or SVG
      case 'summarizing':
      case 'uploading':
        return '⏳'; // Replace with an icon or SVG
      default:
        return '📄'; // Replace with an icon or SVG
    }
  }
 

  validateFiles(selectedFiles: File[]): { valid: File[]; errors: string[] } {
    const errors: string[] = [];
    const valid: File[] = [];

    if (selectedFiles.length > this.MAX_FILES) {
      errors.push(`Maximum ${this.MAX_FILES} files allowed.`);
      return { valid, errors };
    }

    selectedFiles.forEach((file) => {
      const isTextFile = file.type.includes('text/');
      const isPdfFile = file.type === 'application/pdf';

      if (!isTextFile && !isPdfFile) {
        errors.push(`${file.name} is not a text or PDF file.`);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    this.handleFileInput(droppedFiles);
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input,'****')
    if (input.files) {
      this.handleFileInput(Array.from(input.files));
    }
  }

  openFileDialog(): void {
    this.fileInputRef.nativeElement.click();
  }
  isFileSelected(file: FileStatus): boolean {
    return this.files?.some((selected) => selected.name === file.name);
  }

  // Function to handle file selection
  
  handleFileInput(files: File[] | Event): void {
    const event = files as Event;
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement?.files) {
      // Convert the selected files into FileStatus objects with initial status and progress
      const filesArray: FileStatus[] = Array.from(inputElement.files).map((file) => ({
        name: file.name,
        size: this.formatFileSize(file.size),
        status: 'uploading',  // Initial status is uploading
        progress: 0,          // Initial progress is 0
      }));
  
      // Add the new files to the component's `files` array
      this.files.push(...filesArray);
  
      // Loop over the files to simulate the progress and status updates
      filesArray.forEach((file) => {
        const fileIndex = this.files.findIndex((f) => f.name === file.name);
  
        if (fileIndex >= 0) {
          // Simulate the upload process: Update status and progress over time
          setTimeout(() => {
            // After 2 seconds, update the status to 'summarizing' and set progress to 100
            this.files[fileIndex] = {
              ...this.files[fileIndex],
              status: 'summarizing',
              progress: 10,
            };
            this.simulateUploadProgress(this.files[fileIndex])
            // After another 2 seconds, update the status to 'completed'
            setTimeout(() => {
              this.files[fileIndex] = {
                ...this.files[fileIndex],
                status: 'completed',
                progress: 100,
              };
            }, 2000); // Update to completed after 2 more seconds
          }, 2000); // Update to summarizing after 2 seconds
        }
      });
    }
  }
  
  
  
  
  

  
  

  // Handle file selection
  onFileSelect(file: FileStatus): void {
    this.fileSelect.emit(file); // Emit selected file to parent
  }

  // Handle file click (for summary view)
  onFileClick(): void {
    this.fileClick.emit(this.summary); // Emit file for summary
  }

  // Handle file upload progress (simulate)
  simulateUploadProgress(file: FileStatus): void {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        file.progress = progress;
      } else {
        clearInterval(interval);
        file.status = 'summarizing';
      }
    }, 500);
  }
}

