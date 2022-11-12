import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  userAuthenticated = false;
  username: string | undefined;

  private authListenerSubs!: Subscription;
  ngOnInit() {
    this.username = this.authService.getUsername();
    console.log(this.username);
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
        this.username = this.authService.getUsername();
      });
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
