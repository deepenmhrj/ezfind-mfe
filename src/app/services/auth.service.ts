import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthResponse, AuthUser } from '../shared-models';
import { getApiUrl } from '../api-url';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authBaseUrl = `${getApiUrl()}/api/auth`;
  private readonly tokenStorageKey = 'ezfind.auth.token';
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

  readonly user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  initializeAuth(): Observable<AuthUser | null> {
    if (!this.hasToken()) {
      this.userSubject.next(null);
      return of(null);
    }

    return this.http.get<AuthUser>(`${this.authBaseUrl}/me`).pipe(
      tap((user) => this.userSubject.next(user)),
      map((user) => user),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  register(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${this.authBaseUrl}/register`, { email, password })
      .pipe(map((response) => this.persistAuth(response)));
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${this.authBaseUrl}/login`, { email, password })
      .pipe(map((response) => this.persistAuth(response)));
  }

  googleLogin(idToken: string): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${this.authBaseUrl}/google`, { idToken })
      .pipe(map((response) => this.persistAuth(response)));
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  handleUnauthorized(): void {
    this.clearSession();
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private persistAuth(response: AuthResponse): AuthUser {
    localStorage.setItem(this.tokenStorageKey, response.token);
    this.userSubject.next(response.user);
    return response.user;
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.userSubject.next(null);
  }
}
