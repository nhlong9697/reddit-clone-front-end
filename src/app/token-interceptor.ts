import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from './auth/shared/auth.service';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { LoginResponse } from './auth/login/login-response';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //get token from storage
    const jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      console.log('start add token to request header');
      console.log(req);
      console.log(jwtToken);
      this.addToken(req, jwtToken);
    }
    console.log('request after add referesh token');
    console.log(req);
    //if error 403 turns to handleAuthErrors to refresh token if possible
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          console.log('server receive error 403');
          console.log(error);
          return this.handleAuthErrors(req, next);
        } else {
          console.log('unknown error');
          console.log(error);
          return throwError(error);
        }
      })
    );
  }

  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('handle auth error');
    console.log(req);
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        //refreshToken() method return a loginResponse
        //map that loginResponse to refreshTokenSubject
        //then use addToken method to add token to headers from the refreshTokenSubject
        switchMap((refreshTokenResponse: LoginResponse) => {
          this.isTokenRefreshing = false;
          console.log(
            'this is token response after auth service refresh token'
          );
          console.log(refreshTokenResponse);
          this.refreshTokenSubject.next(
            refreshTokenResponse.authenticationToken
          );
          console.log(
            'this is refresh token subject that will transfer request with refreshed token'
          );
          console.log(this.refreshTokenSubject);
          return next.handle(
            this.addToken(req, refreshTokenResponse.authenticationToken)
          );
        })
      );
    }
  }

  addToken(req: HttpRequest<any>, jwtToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
    });
  }
}
