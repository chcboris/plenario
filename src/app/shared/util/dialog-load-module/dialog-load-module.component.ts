import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialComponentes } from '../material.imports';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dialog-load-module',
  imports: [MaterialComponentes, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './dialog-load-module.component.html',
  styleUrl: './dialog-load-module.component.css'
})
export class DialogLoadModuleComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogLoadModuleComponent>,
    private spinner: NgxSpinnerService) {
      dialogRef.disableClose = true;
      this.spinner.show();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
