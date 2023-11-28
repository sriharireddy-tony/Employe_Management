Example interceptor:- 


import { Injectable, Injector } from
 
'@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from
 
'@angular/common/http';

import { Observable, of } from
 
'rxjs';
import { catchError, switchMap } from
 
'rxjs/operators';
import { TokenStorageService } from
 
'../services/token-storage.service';
import { AuthenticationService } from
 
'../services/authentication.service';


@Injectable()
export
 
class
 
RefreshTokenInterceptor
 
implements
 
HttpInterceptor
 
{

  private refreshTokenInProgress: boolean = false;
  private refreshTokenQueue: HttpRequest<any>[] = [];

  constructor(private tokenStorage: TokenStorageService, private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('/authenticate') && !this.refreshTokenInProgress) {
      const accessToken = this.tokenStorage.getAccessToken();
      const refreshToken = this.tokenStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return of(new HttpErrorResponse({ status: 401 }));
      }

      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`).set('refreshToken', `${refreshToken}`)
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && error.error.messageCode === 'MSG003') {
          // Handle refresh token expiration
          if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;

            // Queue pending requests
            if (this.refreshTokenQueue.length > 0) {
              this.refreshTokenQueue.push(request);
            } else {
              // Initiate refresh token request
              return this.refreshTokenAndRetry(request);
            }
          } else {
            // Add request to queue if refresh token already in progress
            this.refreshTokenQueue.push(request);
          }
        } else if (error.status === 0) {
          // Handle network error
          error.error.message = 'Something Went Wrong';
          return throwError(error);
        } else {
          // Handle other errors
          this.refreshTokenInProgress = false;
          return throwError(error);
        }
      })
    );
  }

  private refreshTokenAndRetry(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const refreshTokenObj = {
      refreshToken: this.tokenStorage.getRefreshToken()
    };

    return this.authenticationService.refreshToken(refreshTokenObj).pipe(
      switchMap(response => {
        this.tokenStorage.setAccessToken(response.data.accessToken);
        this.refreshTokenInProgress = false;

        // Retry queued requests with updated access token
        while (this.refreshTokenQueue.length > 0) {
          const queuedRequest = this.refreshTokenQueue.shift();
          const updatedRequest = queuedRequest.clone({
            headers: queuedRequest.headers.set('Authorization', `Bearer ${response.data.accessToken}`)
          });
          next.handle(updatedRequest).subscribe();
        }

        // Retry original request
        return next.handle(request);
      }),
      catchError(error => {
        this.refreshTokenInProgress = false;
        // Handle refresh token failure
        if (error.status === 401 || error.status === 403) {
          // Logout if refresh token is also invalid
          this.authenticationService.logout();
        }
        return throwError(error);
      })
    );
  }
}
