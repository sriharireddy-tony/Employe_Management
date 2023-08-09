import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.css']
})
export class JobcardComponent implements OnInit {

  @ViewChild('op') overlayPanel!: OverlayPanel;
  userName: string = '';
  
  constructor(private service: AuthService, private servShared:SharedService) { }

  ngOnInit(): void {
    this.userName = this.servShared.userName;
  }

  logout() {
    this.service.logout('Logout Successfull', 'logout')
    this.overlayPanel.hide();
  }


}
