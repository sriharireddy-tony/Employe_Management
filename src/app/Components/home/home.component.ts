import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('op') overlayPanel!: OverlayPanel;
  userName: string = '';
  tabsClick:any =[];
 

  constructor(private router: Router, private service: AuthService, private api: ApiService, private shared: SharedService) { }

  ngOnInit(): void {
    this.getUserName();
    setTimeout(() => {
      this.tabsClick = this.shared.rolesTabs
    }, 300);
  }
  getUserName() {
    let name = localStorage.getItem('accessToken') || '';
    let decodedToken = JSON.parse(atob(name.split('.')[1]));
    this.userName = decodedToken.sub;
    this.shared.getRoles();
  };

  

  tabHide(arg: string) {
    return (this.tabsClick.includes(arg) ? true : false)
  };

  clickTab(arg: string) {
    if (arg == 'Project_Management') {
      this.router.navigate(['/Project_Management/projectsList'])
    } else if (arg == 'Employee_Management') {
      this.router.navigate(['/Employee_Management/employeeList'])
    }
  };
  logout() {
    this.service.logout('Logout Successfull', 'logout')
    this.overlayPanel.hide();
  };

}
