import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  mode: 'login' | 'register' = 'login';
  submitting = false;
  errorMessage = '';
  googleAvailable = Boolean(environment.googleClientId);
  private googleInitAttempts = 0;
  private readonly maxGoogleInitAttempts = 20;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMessage = '';
  }

  submit(): void {
    if (this.submitting) {
      return;
    }

    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const action =
      this.mode === 'login'
        ? this.authService.login(email, password)
        : this.authService.register(email, password);

    action.subscribe({
      next: () => {
        this.snackBar.open(
          this.mode === 'login' ? 'Logged in successfully' : 'Account created successfully',
          'Close',
          { duration: 2500 }
        );
        this.router.navigate(['/boxes']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Authentication failed.';
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  private renderGoogleButton(): void {
    if (!this.googleAvailable) {
      return;
    }

    const googleApi = (window as any).google;
    const hostElement = document.getElementById('google-signin-button');
    if (!googleApi?.accounts?.id || !hostElement) {
      if (this.googleInitAttempts < this.maxGoogleInitAttempts) {
        this.googleInitAttempts += 1;
        setTimeout(() => this.renderGoogleButton(), 250);
      }
      return;
    }

    googleApi.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential?: string }) => {
        this.handleGoogleCredential(response.credential);
      },
    });
    hostElement.innerHTML = '';
    googleApi.accounts.id.renderButton(hostElement, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'continue_with',
      width: 320,
    });
  }

  private handleGoogleCredential(credential?: string): void {
    if (!credential || this.submitting) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.authService.googleLogin(credential).subscribe({
      next: () => {
        this.snackBar.open('Logged in with Google', 'Close', { duration: 2500 });
        this.router.navigate(['/boxes']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Google authentication failed.';
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
