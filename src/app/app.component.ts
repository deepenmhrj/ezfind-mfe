import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from './shared-models';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ezfind';

  user$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.authService.initializeAuth().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
