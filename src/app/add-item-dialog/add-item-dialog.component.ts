import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from '../shared-models';
import { ItemsService } from '../services/items.service';
import { downscaleImage } from '../image-resize';

export interface AddItemDialogData {
  boxId: string;
}

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss'],
})
export class AddItemDialogComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  name = '';
  photoFile?: File;
  photoPreviewUrl?: string;
  saving = false;

  constructor(
    private dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddItemDialogData,
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  triggerFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.photoFile = file;

    this.revokePreview();
    this.photoPreviewUrl = URL.createObjectURL(file);
  }

  async done(): Promise<void> {
    if (!this.name.trim() || !this.photoFile || this.saving) {
      return;
    }
    this.saving = true;
    const photo = await downscaleImage(this.photoFile);
    this.itemsService.createItem(this.data.boxId, this.name.trim(), photo).subscribe({
      next: (item) => {
        this.dialogRef.close(item);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.error ?? 'Failed to add item', 'Close', { duration: 3000 });
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  private revokePreview(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
  }
}
