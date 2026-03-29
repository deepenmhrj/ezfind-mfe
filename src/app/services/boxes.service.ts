import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Box } from '../shared-models';
import { getApiUrl } from '../api-url';

@Injectable({ providedIn: 'root' })
export class BoxesService {
  private baseUrl = `${getApiUrl()}/api/boxes`;

  constructor(private http: HttpClient) {}

  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.baseUrl);
  }

  getBox(boxId: string): Observable<Box> {
    return this.http.get<Box>(`${this.baseUrl}/${boxId}`);
  }

  createBox(name: string): Observable<Box> {
    return this.http.post<Box>(this.baseUrl, { name });
  }

  deleteBox(boxId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${boxId}`);
  }
}
