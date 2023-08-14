import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private toast:ToastrService, private api:ApiService,private tostr : ToastrService) { }

  userName:string='';
  LOVArr:any =[];
  employeeData = {};
  rolesTabs:any =[];
  rolesArr: any = [];
  tabsClick: any = [];

  getDetails(): Promise<any>{
    return new Promise((resolve, reject) => {
    this.api.getDetails(this.userName).subscribe({
      next: (res: any) => {
        resolve(res);
       this.employeeData = res;
      },
      error: (err: any) => {
        this.tostr.error("Roles not getting");
        reject(err);
      }
    })
  })
  };

  getRoles() {
    this.tabsClick = [];
    this.rolesArr = [];
    this.getDetails().then((res: any) => {
      let roles = res[0].roles;
      if (roles.includes(',')) {
        this.rolesArr = roles.split(',')
      } else {
        this.rolesArr.push(roles);
      }
      let User = ["Timesheet"];
      let Admin = ["Admin", "Timesheet"];
      let HR = ["Employee", "Timesheet"];
      let Project_Manager = ["Project", "Timesheet"];
      let Reporting_Manager = ["Jobcard", "Timesheet"];
      this.rolesArr.forEach((d: any) => {
        if (d == 'HR') {
          this.tabsClick.push(...HR);
        } else if (d == 'Project Manager') {
          this.tabsClick.push(...Project_Manager);
        } else if (d == 'Reporting Manager') {
          this.tabsClick.push(...Reporting_Manager);
        } else if (d == 'User') {
          this.tabsClick.push(...User);
        } else if (d == 'Admin') {
          this.tabsClick.push(...Admin);
        }
      })
      this.rolesTabs = Array.from(new Set(this.tabsClick));
    })
  };

  convertToIST(date:string) {
    var dateArr:any[] =[];
    var filterDate = '';
    if(this.toStr(date)){
      if(date.includes('-')){
        dateArr = date.split('-');
        var filterDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
      } else if(date.includes('/')){
        dateArr = date.split('/');
        var filterDate = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
      }
    } else {
      return null;
    }
   return new Date(filterDate);
  }

  fromToDateValid(fromDate:any,toDate:any){
    if (fromDate && toDate && fromDate > toDate) {
      this.toast.warning('From Date must be before To Date');
      return true;
    }
    return false; 
  }

  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }
}
