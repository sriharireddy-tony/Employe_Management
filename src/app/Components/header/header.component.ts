import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Input title
  @ViewChild('op') overlayPanel!: OverlayPanel;
  userName: string = '';
  roleTabs: any = [];
  routeName: string = '';

  constructor(private service: AuthService, private shared: SharedService, private roter: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserName();
    this.getRouteName();
    setTimeout(() => {
      this.roleTabs = this.shared.rolesTabs;
    }, 100);
  }

  getUserName() {
    let name = localStorage.getItem('accessToken') || '';
    if (name) {
      let decodedToken = JSON.parse(atob(name.split('.')[1]));
      this.userName = decodedToken.sub;
    }
  }
  logout() {
    this.service.logout('Logout Successfull', 'logout')
    this.overlayPanel.hide();
  }
  tabClick(arg: string) {
    this.shared.getRoles();
    if (arg == 'logout') {
      this.service.logout('Logout Successfull', 'logout')
    } else if (arg == 'Timesheet') {
      this.roter.navigate(['/Timesheet'])
    } else if (arg == 'Employee') {
      this.roter.navigate(['/Employee_Management/employeeList'])
    } else if (arg == 'Project') {
      this.roter.navigate(['/Project_Management/projectsList'])
    } else if (arg == 'Jobcard') {
      this.roter.navigate(['/Jobcard'])
    } else if (arg == 'Admin') {
      this.roter.navigate(['/Admin'])
    } else if (arg == 'landingPage') {
      this.roter.navigate(['/landingPage'])
    }
    this.overlayPanel.hide();
    setTimeout(() => {
      this.roleTabs = this.shared.rolesTabs;
    }, 200);
  };

  getRouteName() {
    const route = this.roter.url.split('/')[1]
    if (route == 'Jobcard') {
      this.routeName = 'Job Card';
    } else if(route == 'Employee_Management'){
      this.routeName = 'Employee Management';
    } else if(route == 'Timesheet'){
      this.routeName = 'Timesheet';
    } else if(route == 'Project_Management'){
      this.routeName = 'Project Management';
    }
  }

}
