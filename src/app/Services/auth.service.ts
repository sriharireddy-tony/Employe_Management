import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URI: string = "http://192.168.2.185:8081";

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken') || '';
  }
  isLogged() {
    return localStorage.getItem('accessToken') != null;
  }
  logout(msg:string,type:string) {
    if(type =='session'){
      this.toastr.error(msg);
    } else if(type =='logout'){
      this.toastr.success(msg);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/Auth/login'])
  }
  refreshToken(token: any) {
    return this.http.post<any>(`${this.URI}/refreshToken`, { token });
  }
  setToken(token:any){
    localStorage.setItem('accessToken', token)
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.URI}/login/authenticate`, data);
  }

}
