import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../shared-models';
import { getApiUrl } from '../api-url';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private baseUrl = `${getApiUrl()}/api/boxes`;

  constructor(private http: HttpClient) {}

  getItems(boxId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/${boxId}/items`);
  }

  createItem(boxId: string, name: string, photo: File): Observable<Item> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', photo);
    return this.http.post<Item>(`${this.baseUrl}/${boxId}/items`, formData);
  }
}
