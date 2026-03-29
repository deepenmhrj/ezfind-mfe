import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Box } from '../shared-models';
import { BoxesService } from '../services/boxes.service';

@Component({
  selector: 'app-add-box-dialog',
  templateUrl: './add-box-dialog.component.html',
  styleUrls: ['./add-box-dialog.component.scss'],
})
export class AddBoxDialogComponent {
  name = '';
  saving = false;

  constructor(
    private dialogRef: MatDialogRef<AddBoxDialogComponent>,
    private boxesService: BoxesService,
    private snackBar: MatSnackBar
  ) {}

  save(): void {
    if (!this.name.trim() || this.saving) {
      return;
    }
    this.saving = true;
    this.boxesService.createBox(this.name.trim()).subscribe({
      next: (box) => {
        this.dialogRef.close(box);
      },
      error: () => {
        this.snackBar.open('Failed to create box', 'Close', { duration: 3000 });
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
