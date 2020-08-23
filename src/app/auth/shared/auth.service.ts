import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginResponse } from '../login/login-response';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.http.post(
      'http://localhost:8080/api/auth/signup',
      signupRequestPayload,
      { responseType: 'text' }
    );
  }

  login(loginRequestPayLoad: LoginRequestPayload): Observable<boolean> {
    return this.http
      .post<LoginResponse>(
        'http://localhost:8080/api/auth/login',
        loginRequestPayLoad
      )
      .pipe(
        map((data) => {
          this.localStorage.store(
            'authenticationToken',
            data.authenticationToken
          );
          this.localStorage.store('username', data.username);
          this.localStorage.store('refreshToken', data.refreshToken);
          this.localStorage.store('expiresAt', data.expiresAt);
          return true;
        })
      );
  }
  refreshToken() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUserName(),
    };
    console.log('this is the token getting  refresh');
    console.log(refreshTokenPayload);
    return this.http
      .post<LoginResponse>(
        'http://localhost:8080/api/auth/refresh/token',
        refreshTokenPayload
      )
      .pipe(
        tap((response) => {
          console.log('response after refresh');
          console.log(response);
          this.localStorage.store(
            'authenticationToken',
            response.authenticationToken
          );
          this.localStorage.store('expiresAt', response.expiresAt);
        })
      );
  }
  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }

  getExpirationTime() {
    return this.localStorage.retrieve('expiresAt');
  }
}
