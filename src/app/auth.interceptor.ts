import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { getApiUrl } from './api-url';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiUrl = getApiUrl();

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const requestWithAuth = this.shouldAttachToken(req.url, token)
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(requestWithAuth).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          this.authService.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  private shouldAttachToken(url: string, token: string | null): token is string {
    return Boolean(token) && this.isApiUrl(url) && !this.isAuthEndpoint(url);
  }

  private isApiUrl(url: string): boolean {
    return url.startsWith(`${this.apiUrl}/api/`) || url.startsWith('/api/');
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/api/auth/login') ||
      url.includes('/api/auth/register') ||
      url.includes('/api/auth/google')
    );
  }
}
