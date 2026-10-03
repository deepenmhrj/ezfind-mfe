import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Box, Item } from '../shared-models';
import { AddBoxDialogComponent } from '../add-box-dialog/add-box-dialog.component';
import { BoxesService } from '../services/boxes.service';
import { ItemsService } from '../services/items.service';
import { resolvePhotoUrl } from '../api-url';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent implements OnInit {
  boxes: Box[] = [];
  searchText = '';
  loading = false;

  // Derived from boxes/items/searchText; recomputed only when one of those changes.
  filteredBoxes: Box[] = [];
  matchingItemsByBoxId: Record<string, Item[]> = {};

  private itemsByBoxId: Record<string, Item[]> = {};

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
    forkJoin({
      boxes: this.boxesService.getBoxes(),
      items: this.itemsService.getAllItems(),
    }).subscribe({
      next: ({ boxes, items }) => {
        this.boxes = boxes;
        this.itemsByBoxId = {};
        for (const item of items) {
          (this.itemsByBoxId[item.boxId] ??= []).push(item);
        }
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load boxes', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.applySearch();
  }

  trackById(_index: number, box: Box): string {
    return box.id;
  }

  openBox(box: Box): void {
    this.router.navigate(['/boxes', box.id]);
  }

  get hasSearchQuery(): boolean {
    return Boolean(this.normalizedQuery);
  }

  getPhotoUrl(item: Item): string {
    return resolvePhotoUrl(item.photoUrl);
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

  private get normalizedQuery(): string {
    return this.searchText.trim().toLowerCase();
  }

  private applySearch(): void {
    const query = this.normalizedQuery;
    this.matchingItemsByBoxId = {};

    if (!query) {
      this.filteredBoxes = this.boxes;
      return;
    }

    this.filteredBoxes = this.boxes.filter((box) => {
      const matches = (this.itemsByBoxId[box.id] ?? []).filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      if (matches.length > 0) {
        this.matchingItemsByBoxId[box.id] = matches;
      }
      return matches.length > 0 || box.name.toLowerCase().includes(query);
    });
  }
}
