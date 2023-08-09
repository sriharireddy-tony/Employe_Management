import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class TokenHandlingInterceptor implements HttpInterceptor {

  constructor(private authServ: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.authServ.getAccessToken();
    var refreshToken = this.authServ.getRefreshToken();

    if (token) {
      var reqwithToken = this.addTokenHeader(request, token);
      return next.handle(reqwithToken);
    }

    return next.handle(request);
  };

  addTokenHeader(request: HttpRequest<any>, token: any) {
    return request.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
  };

}
