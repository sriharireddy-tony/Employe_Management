import { Component } from '@angular/core';
import { SharedService } from './Services/shared.service';
import { ApiService } from './Services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Employe_Management';
  constructor(private servShare: SharedService, private api: ApiService) {
    if (localStorage.getItem('accessToken') || '') {
      this.getUserName();
    }
    this.getLOVData();
  }

  getUserName() {
    let name = localStorage.getItem('accessToken') || '';
    if (name) {
      let decodedToken = JSON.parse(atob(name.split('.')[1]));
      this.servShare.userName = decodedToken.sub;
      this.servShare.getDetails();
      this.servShare.getRoles();
    }
  }

  getLOVData() {
    this.api.getLOV().subscribe({
      next: (res: any) => {
        this.servShare.LOVArr = res;
      }, error: (err: any) => {

      }
    })
  };

}
