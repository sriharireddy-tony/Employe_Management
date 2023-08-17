import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  isSubmitted: boolean = false;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private toast: ToastrService, private service: AuthService, private router: Router,private servShare: SharedService,private api:ApiService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }
  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
  login() {
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
      this.toast.warning('Please enter all mandatory fields');
      return;
    }
    this.service.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken',res.accessToken);
        localStorage.setItem('refreshToken',res.token);
        this.toast.success('Login Successful');
        this.getUserName();
         this.router.navigate(['/landingPage']);
      },
      error: (err: any) => {
        this.toast.error('Something went Wrong');
      }
    })
  };

  getLOVData() {
    this.api.getLOV().subscribe({
      next: (res: any) => {
        this.servShare.LOVArr = res;
      }, error: (err: any) => {

      }
    })
  };

  getUserName() {
    let name = localStorage.getItem('accessToken') || '';
    if(name){
      let decodedToken = JSON.parse(atob(name.split('.')[1]));
      this.servShare.userName = decodedToken.sub;
      this.servShare.getDetails();
      this.getLOVData();
      this.servShare.getRoles();
    }
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }


}
