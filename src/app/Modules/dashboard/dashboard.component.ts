import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('op') overlayPanel!: OverlayPanel;
  userName: string = '';

  constructor(private service: AuthService, private router: Router) { }
  sidebarVisible: boolean = false;

  ngOnInit(): void {
    this.getUserName();
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
  tabClick() {
    this.sidebarVisible = false;
  }
  
}
