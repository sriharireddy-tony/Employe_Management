import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  userName:string='';
  LOVArr:any =[];


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

  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }
}
