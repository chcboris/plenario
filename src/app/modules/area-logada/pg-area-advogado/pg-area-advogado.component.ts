import { Component } from '@angular/core';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { Router } from '@angular/router';
import { FileUploadService, UploadedFile } from '../../../shared/service/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pg-area-advogado',
  imports: [FormsModule, ReactiveFormsModule, MaterialComponentes],
  templateUrl: './pg-area-advogado.component.html',
  styleUrl: './pg-area-advogado.component.css'
})
export class PgAreaAdvogadoComponent {
  selectedFiles: File[] = [];
  uploadedFiles: UploadedFile[] = [];
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  displayedColumns: string[] = ['name', 'size', 'uploadDate', 'actions'];

  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUploadedFiles();
  }

  private loadUploadedFiles() {
    this.fileUploadService.getUploadedFiles().subscribe({
      next: (files) => {
        this.uploadedFiles = files;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar arquivos', 'Fechar', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = event.target as HTMLElement;
    uploadArea.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = event.target as HTMLElement;
    uploadArea.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = event.target as HTMLElement;
    uploadArea.classList.remove('dragover');

    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.addFiles(files);
  }

  private addFiles(files: File[]) {
    const validFiles: File[] = [];

    files.forEach(file => {
      const validation = this.fileUploadService.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        this.snackBar.open(validation.error || 'Arquivo inválido', 'Fechar', { duration: 4000 });
      }
    });

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
  }

  private handleFiles(fileList: FileList) {
    const allowedTypes = ['application/pdf', 'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'audio/mpeg', 'video/mp4'];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (allowedTypes.includes(file.type) || this.isValidFileExtension(file.name)) {
        // Verificar se o arquivo já não foi selecionado
        if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
          this.selectedFiles.push(file);
        }
      } else {
        console.warn(`Arquivo ${file.name} não é um tipo permitido`);
        // Aqui você poderia mostrar uma mensagem de erro para o usuário
      }
    }
  }

  private isValidFileExtension(fileName: string): boolean {
    const validExtensions = ['.pdf', '.doc', '.docx', '.mp3', '.mp4'];
    return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }



  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      this.snackBar.open('Selecione pelo menos um arquivo para upload', 'Fechar', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.fileUploadService.uploadFiles(this.selectedFiles).subscribe({
      next: (result) => {
        this.uploadProgress = result.progress;

        if (result.uploadedFiles) {
          this.uploadedFiles = [...this.uploadedFiles, ...result.uploadedFiles];
          this.selectedFiles = [];
          this.isUploading = false;
          this.uploadProgress = 0;

          this.snackBar.open(`${result.uploadedFiles.length} arquivo(s) enviado(s) com sucesso!`, 'Fechar', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.snackBar.open('Erro no upload dos arquivos', 'Fechar', { duration: 3000 });
      }
    });
  }

  clearSelectedFiles() {
    this.selectedFiles = [];
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  downloadFile(file: UploadedFile) {
    this.fileUploadService.downloadFile(file).subscribe({
      next: () => {
        this.snackBar.open('Download iniciado', 'Fechar', { duration: 2000 });
      },
      error: (error) => {
        this.snackBar.open('Erro ao fazer download do arquivo', 'Fechar', { duration: 3000 });
      }
    });
  }

  deleteFile(file: UploadedFile) {
    if (confirm(`Tem certeza que deseja excluir o arquivo "${file.name}"?`)) {
      this.fileUploadService.deleteFile(file.id).subscribe({
        next: () => {
          const index = this.uploadedFiles.findIndex(f => f.id === file.id);
          if (index > -1) {
            this.uploadedFiles.splice(index, 1);
          }
          this.snackBar.open('Arquivo excluído com sucesso', 'Fechar', { duration: 2000 });
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir arquivo', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

}
