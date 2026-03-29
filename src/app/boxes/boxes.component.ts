import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Box, Item } from '../shared-models';
import { AddBoxDialogComponent } from '../add-box-dialog/add-box-dialog.component';
import { BoxesService } from '../services/boxes.service';
import { ItemsService } from '../services/items.service';
import { getApiUrl } from '../api-url';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent implements OnInit {
  private readonly apiUrl = getApiUrl();
  boxes: Box[] = [];
  itemsByBoxId: Record<string, Item[]> = {};
  searchText = '';
  loading = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private boxesService: BoxesService,
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.loading = true;
    this.boxesService.getBoxes().subscribe({
      next: (boxes) => {
        this.boxes = boxes;
        this.loadItemsForBoxes(boxes);
      },
      error: () => {
        this.snackBar.open('Failed to load boxes', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  openBox(box: Box): void {
    this.router.navigate(['/boxes', box.id]);
  }

  get filteredBoxes(): Box[] {
    const query = this.normalizedQuery;
    if (!query) {
      return this.boxes;
    }

    return this.boxes.filter((box) => {
      if (box.name.toLowerCase().includes(query)) {
        return true;
      }
      return this.getMatchingItems(box.id).length > 0;
    });
  }

  get hasSearchQuery(): boolean {
    return Boolean(this.normalizedQuery);
  }

  hasItemMatch(boxId: string): boolean {
    return this.getMatchingItems(boxId).length > 0;
  }

  getMatchingItemsForBox(boxId: string): Item[] {
    return this.getMatchingItems(boxId);
  }

  getPhotoUrl(item: Item): string {
    if (item.photoUrl.startsWith('http') || item.photoUrl.startsWith('data:')) {
      return item.photoUrl;
    }
    return `${this.apiUrl}${item.photoUrl}`;
  }

  addBox(): void {
    const dialogRef = this.dialog.open(AddBoxDialogComponent, {
      width: '320px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result?: Box) => {
      if (result) {
        this.loadBoxes();
      }
    });
  }

  private loadItemsForBoxes(boxes: Box[]): void {
    if (boxes.length === 0) {
      this.itemsByBoxId = {};
      this.loading = false;
      return;
    }

    forkJoin(
      boxes.map((box) => this.itemsService.getItems(box.id))
    ).subscribe({
      next: (itemGroups) => {
        this.itemsByBoxId = {};
        boxes.forEach((box, index) => {
          this.itemsByBoxId[box.id] = itemGroups[index];
        });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load items', 'Close', { duration: 3000 });
        this.itemsByBoxId = {};
        this.loading = false;
      },
    });
  }

  private get normalizedQuery(): string {
    return this.searchText.trim().toLowerCase();
  }

  private getMatchingItems(boxId: string): Item[] {
    const query = this.normalizedQuery;
    if (!query) {
      return [];
    }

    const items = this.itemsByBoxId[boxId] ?? [];
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }
}
