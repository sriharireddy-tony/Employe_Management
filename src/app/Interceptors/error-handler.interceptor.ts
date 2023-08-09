import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({
    //   headers: request.headers.set('X-API-KEY', 'my-api-key'),
    // });
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `${error.error.message}`;
        }
        return new Observable<never>((observer) => {
          observer.error({ status: error.status, message: errorMessage });
          observer.complete();
        });
      }),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

        }
      }),
    );
  }
}
