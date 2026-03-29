import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from '../shared-models';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { BoxesService } from '../services/boxes.service';
import { ItemsService } from '../services/items.service';
import { getApiUrl } from '../api-url';

@Component({
  selector: 'app-box-detail',
  templateUrl: './box-detail.component.html',
  styleUrls: ['./box-detail.component.scss'],
})
export class BoxDetailComponent implements OnInit {
  private readonly apiUrl = getApiUrl();
  boxId!: string;
  boxName = 'Box';
  items: Item[] = [];
  loading = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private boxesService: BoxesService,
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.boxId = this.route.snapshot.paramMap.get('boxId') ?? '';
    this.loadBox();
    this.loadItems();
  }

  loadBox(): void {
    this.boxesService.getBox(this.boxId).subscribe({
      next: (box) => (this.boxName = box.name),
      error: () => this.snackBar.open('Failed to load box', 'Close', { duration: 3000 }),
    });
  }

  loadItems(): void {
    this.loading = true;
    this.itemsService.getItems(this.boxId).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load items', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/boxes']);
  }

  getPhotoUrl(item: Item): string {
    if (item.photoUrl.startsWith('http') || item.photoUrl.startsWith('data:')) {
      return item.photoUrl;
    }
    return `${this.apiUrl}${item.photoUrl}`;
  }

  addItem(): void {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '360px',
      data: { boxId: this.boxId },
    });

    dialogRef.afterClosed().subscribe((result?: Item) => {
      if (result) {
        this.loadItems();
      }
    });
  }

  deleteCurrentBox(): void {
    if (this.deleting) {
      return;
    }

    const confirmed = window.confirm(`Delete "${this.boxName}" and all its items?`);
    if (!confirmed) {
      return;
    }

    this.deleting = true;
    this.boxesService.deleteBox(this.boxId).subscribe({
      next: () => {
        this.snackBar.open('Box deleted', 'Close', { duration: 2500 });
        this.router.navigate(['/boxes']);
      },
      error: () => {
        this.snackBar.open('Failed to delete box', 'Close', { duration: 3000 });
        this.deleting = false;
      },
    });
  }
}
