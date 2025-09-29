import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadedFiles: UploadedFile[] = [];
  private nextId = 1;

  constructor() {
    // Simular alguns arquivos já enviados
    this.uploadedFiles = [
      {
        id: '1',
        name: 'sustentacao_oral_caso_123.pdf',
        size: 2048576,
        type: 'application/pdf',
        uploadDate: new Date('2024-01-15'),
        url: 'blob:fake-url-1'
      },
      {
        id: '2',
        name: 'argumentacao_defesa.docx',
        size: 1536000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadDate: new Date('2024-01-10'),
        url: 'blob:fake-url-2'
      }
    ];
    this.nextId = 3;
  }

  uploadFiles(files: File[]): Observable<{ progress: number; uploadedFiles?: UploadedFile[] }> {
    return new Observable(observer => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;

        if (progress <= 100) {
          observer.next({ progress });
        }

        if (progress >= 100) {
          clearInterval(interval);

          // Simular upload bem-sucedido
          const newFiles: UploadedFile[] = files.map(file => ({
            id: (this.nextId++).toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            url: URL.createObjectURL(file)
          }));

          this.uploadedFiles.push(...newFiles);

          observer.next({ progress: 100, uploadedFiles: newFiles });
          observer.complete();
        }
      }, 200);
    });
  }

  getUploadedFiles(): Observable<UploadedFile[]> {
    return of([...this.uploadedFiles]).pipe(delay(300));
  }

  deleteFile(fileId: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.uploadedFiles.findIndex(f => f.id === fileId);
        if (index !== -1) {
          // Revogar URL do blob se existir
          const file = this.uploadedFiles[index];
          if (file.url && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
          }

          this.uploadedFiles.splice(index, 1);
          observer.next(true);
        } else {
          observer.error('Arquivo não encontrado');
        }
        observer.complete();
      }, 500);
    });
  }

  downloadFile(file: UploadedFile): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          // Simular download
          const link = document.createElement('a');
          link.href = file.url || '#';
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          observer.next(true);
        } catch (error) {
          observer.error('Erro ao fazer download do arquivo');
        }
        observer.complete();
      }, 300);
    });
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4'
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: 10MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: PDF, DOC, DOCX, TXT, MP3, WAV, MP4`
      };
    }

    return { valid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
