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
        <div className="mt-2 text-center">
          
          <p className="text-xs text-gray-400 mt-1 italic">
          <span className="font-medium">Disclaimer:</span> MarketMaestro may occasionally present inaccuracies. It is recommended to independently verify all information provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;


import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class S3UploadService {
  private apicEndpoint = 'https://your-apic-endpoint-to-fetch-url'; // Replace with APIC endpoint

  constructor(private http: HttpClient) {}

  // Fetch pre-signed URL for a single file
  fetchPresignedUrl(fileName: string): Observable<any> {
    return this.http.post<any>(this.apicEndpoint, { fileName });
  }

  // Upload file to S3 using the pre-signed URL
  uploadFileToS3(presignedUrl: any, file: File): Observable<number> {
    const formData = new FormData();
    Object.keys(presignedUrl.fields).forEach((key) => {
      formData.append(key, presignedUrl.fields[key]);
    });
    formData.append('file', file);

    return this.http.post(presignedUrl.url, formData, {
      observe: 'events',
      reportProgress: true,
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          return 100; // Upload complete
        }
        return 0;
      })
    );
  }

  // Fetch pre-signed URLs in parallel
  fetchPresignedUrlsForFiles(fileNames: string[]): Observable<any[]> {
    const requests = fileNames.map((fileName) => this.fetchPresignedUrl(fileName));
    return forkJoin(requests); // Executes all API calls in parallel
  }
}
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]


uploadFileToS3(presignedUrl: any, file: any): Observable<number> {
  console.log(file, '764');
  const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
  });

  const formData = new FormData();
  Object.keys(presignedUrl.fields).forEach((key) => {
    formData.append(key, presignedUrl.fields[key]);
  });
  formData.append('file', file);

  console.log(formData, 'formdata');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return this.http.post(presignedUrl.url, formData, {
    observe: 'events',
    reportProgress: true,
    headers: headers,
  }).pipe(
    map((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        return Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        console.log(event, 'event');
        return 100; // Upload complete
      }
      return 0;
    }),
    switchMap((progress) => {
      if (progress === 100) {
        // Call 2: Get another presigned URL by sending the filename
        return this.http.post<any>('YOUR_GET_PRESIGNED_URL_ENDPOINT', { filename: file.name }).pipe(
          switchMap((secondPresignedUrl) => {
            console.log('Second Presigned URL:', secondPresignedUrl);

            // Use the second presigned URL to upload the file again
            const secondFormData = new FormData();
            Object.keys(secondPresignedUrl.fields).forEach((key) => {
              secondFormData.append(key, secondPresignedUrl.fields[key]);
            });
            secondFormData.append('file', file);

            return this.http.post(secondPresignedUrl.url, secondFormData, {
              observe: 'events',
              reportProgress: true,
            }).pipe(
              map((event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                  return Math.round((event.loaded / event.total) * 100);
                } else if (event.type === HttpEventType.Response) {
                  console.log('Second Upload Complete:', event);
                  return 100; // Second upload complete
                }
                return 0;
              }),
              switchMap(() => {
                // Call 3: Generate summary by sending object_key
                return this.http.post<any>('YOUR_GENERATE_SUMMARY_ENDPOINT', { object_key: secondPresignedUrl.fields.key });
              })
            );
          })
        );
      }
      return of(progress); // Pass progress if not 100
    })
  );
}
