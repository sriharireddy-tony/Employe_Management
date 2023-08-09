import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('op') overlayPanel!: OverlayPanel;
  userName: string = '';

  constructor(private router: Router, private service: AuthService) { }

  ngOnInit(): void {
    this.getUserName();
  }
  getUserName() {
    let name = localStorage.getItem('accessToken') || '';
    let decodedToken = JSON.parse(atob(name.split('.')[1]));
    this.userName = decodedToken.sub;
  }
  clickTab(arg: string) {
    if (arg == 'Project_Management') {
      this.router.navigate(['/Project_Management/projectsList'])
    } else if(arg ==  'Employee_Management'){
      this.router.navigate(['/Employee_Management/employeeList'])
    }
  };
  logout() {
    this.service.logout('Logout Successfull', 'logout')
    this.overlayPanel.hide();
  }
}
