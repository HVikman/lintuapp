import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './authdata.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer!: any;
  private username!: string | undefined;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      this.isAuthenticated = false;
      this.token = '';
      this.authStatusListener.next(false);
    }
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = {
      username: username,
      email: email,
      password: password,
    };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
        this.login(email, password);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; username: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.username = response.username;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.username);
            console.log(expirationDate);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuth() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation!.token;
      this.isAuthenticated = true;
      this.username = authInformation!.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.username = '';
    this.router.navigate(['/']);
    window.location.reload();
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const username = localStorage.getItem('username');
    if (!token || !expirationDate || !username) {
      return { token: '', expirationDate: new Date() };
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
    };
  }
  getUsername() {
    return this.username;
  }
}
