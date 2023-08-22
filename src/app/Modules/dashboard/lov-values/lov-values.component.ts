import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-lov-values',
  templateUrl: './lov-values.component.html',
  styleUrls: ['./lov-values.component.css']
})
export class LOVValuesComponent implements OnInit {
  keyword = 'type';
  type: string = '';
  LOVAllData: any = [];
  LOVTypes: any = [];
  searchText: string = '';
  typengModel: string = '';
  lovId: string = '';
  lovDesc: string = '';
  isActive: string = '';
  filterLOV: any = [];
  isSave: string = 'Save';
  id: string = '';
  constructor(private api: ApiService, private location: Location, private toast: ToastrService, private shared:SharedService) { }

  ngOnInit(): void {
    this.getAllLOV();
    this.getLOVTypes();
  }
  back() {
    this.location.back();
  }
  clearText() {
    this.searchText = '';
  }
  clearLOV() {
    this.typengModel = '';
    this.lovId = '';
    this.lovDesc = '';
    this.isActive = '';
  }
  addLOV() {
    var obj = {
      "id": this.isSave == 'Save' ? '' : this.id,
      "lovId": this.lovId,
      "lovDesc": this.lovDesc,
      "type": this.typengModel,
      "status": this.isActive
    }
    if(this.isSave=='Save'){
      this.api.postLOV(obj).subscribe({
        next: (res: any) => {
          this.toast.success("LOV added Succesfull");
          this.clearLOV();
          this.getAllLOV();
          this.getLOVTypes();
        }, error: (err: any) => {
          this.toast.error("LOV Adding Failed");
        }
      })
    } else if(this.isSave=='Update'){
      this.api.updateLOV(obj).subscribe({
        next: (res: any) => {
          this.toast.success("LOV Updated Succesfull");
          this.clearLOV();
          this.getAllLOV();
          this.getLOVTypes();
          this.isSave ='Save';
        }, error: (err: any) => {
          this.isSave ='Save';
          this.toast.error("LOV Updating Failed");
        }
      })
    }
   
  }
  updateLOV(obj: any) {
    this.isSave ='Update';
    this.id = obj.id;
    this.lovId = obj.lovId;
    this.lovDesc = obj.lovDesc;
    this.typengModel = obj.type;
    this.isActive = obj.status;
  }
  deleteLOV(obj:any){
    this.api.deleteLOV(obj.id).subscribe({
      next: (res: any) => {
        this.toast.success("LOV Deleted Succesfull");
        this.getAllLOV();
        this.getLOVTypes();
      }, error: (err: any) => {
        this.toast.error("Something Went Wrong");
      }
    })
  };

  searchType() {
    let data = typeof(this.type) == 'string' ? this.type : typeof(this.type) == 'object' ? this.type['type'] : this.type;
    this.api.getLOVByType(data).subscribe({
      next: (res: any) => {
        this.filterLOV = res;
      }, error: (err: any) => {
        this.toast.error("Something Went Wrong");
      }
    })
  }

  getAllLOV() {
    this.api.getLOV().subscribe({
      next: (res: any) => {
        this.LOVAllData = res;
        this.shared.LOVArr = res;
      }, error: (err: any) => {
        this.toast.error("Something Went Wrong");
      }
    })
  }
  getLOVTypes() {
    this.api.getLOVTypes().subscribe({
      next: (res: any) => {
        this.LOVTypes = res;
      }, error: (err: any) => {
        this.toast.error("Something Went Wrong");
      }
    })
  }

}
