import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private toast: ToastrService, private service: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

  }
  login() {
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
      this.toast.warning('Please enter all mandatory fields');
      return;
    }
    this.service.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.toast.success('Login Successful');
         this.router.navigate(['/landingPage']);
      },
      error: (err: any) => {
        this.toast.warning('Something went Wrong');
      }
    })

  } 

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }


}
