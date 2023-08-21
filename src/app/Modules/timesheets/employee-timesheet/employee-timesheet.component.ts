import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-employee-timesheet',
  templateUrl: './employee-timesheet.component.html',
  styleUrls: ['./employee-timesheet.component.css'],
  providers: [ConfirmationService]
})
export class EmployeeTimesheetComponent implements OnInit {
  currentYear: string = '';
  currentMonth: string = '';
  monthArr: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  yearArr: any = [];
  userName: string = '';
  projectsArr: any = [];
  dateAndDayArray: any = [];
  timeSheet: any = [];
  tasksArr: any = [];
  userData: any = {};
  updateObj: any = {};

  constructor(private location: Location, private shared: SharedService, private api: ApiService, private toast: ToastrService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.userName = this.shared.userName;
    this.getYear();
    this.setDates();
    this.getProjectsForJobcard();
    this.getDetails();
    this.getTimesheet();
  }

  back() {
    this.location.back();
  }

  getDetails() {
    this.api.getDetails(this.userName).subscribe({
      next: (res: any) => {
        this.userData = res[0];
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  }
  excelDownload() {
    let dataObj = {
      name: this.userName,
      financialyear: this.currentYear,
      month: this.currentMonth
    };
    this.api.getExcelTimesheet(dataObj).subscribe(
      (response: Blob) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(response)
        a.href = objectUrl
        a.download = `Timesheet_${this.currentMonth}_${this.currentYear}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (err: any) => {
        this.toast.error('Document downloading failed')
      }
    )
  };

  addTimesheet() {
    this.updateObj = {};
    this.setDates();
    this.timeSheet.push({
      id: '', empid: '', reportingmanager: '', project: '', task: '', client: '', remarks: '', financialyear: '',
      month: '', dateAndDayArray: this.dateAndDayArray, submittedon: '', approvedon: '', taskArr: this.tasksArr
    })
  }

  async getProjectsForJobcard() {
    this.api.getProjectsForJobcard().subscribe({
      next: (res: any) => {
        this.projectsArr = res;
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  }

  getYear() {
    let currentYear1 = new Date().getFullYear();
    this.currentMonth = this.monthArr[new Date().getMonth()];
    let prevYear = currentYear1 - 2;
    this.currentYear = currentYear1.toString();
    for (let s = prevYear; s <= currentYear1; currentYear1--) {
      this.yearArr.push(currentYear1)
    }
  }
  diableMonth(month: string) {
    let selectedMonth = this.monthArr.indexOf(month) + 1;
    var today = new Date();
    const currentMonth = today.getMonth() + 1;
    if (selectedMonth > currentMonth) {
      return true;
    } else {
      return false;
    }
  };

  setDates() {
    let dd;
    this.dateAndDayArray = [];
    let currentYear1 = +this.currentYear;
    let month = this.monthArr.indexOf(this.currentMonth) + 1;

    var today = new Date();
    const currentMonth = today.getMonth() + 1;
    // let selectedMonth = this.monthArr.indexOf(this.currentMonth)+1
    if (month < currentMonth) {
      dd = new Date(currentYear1, month, 0).getDate();
    } else {
      dd = +String(today.getDate()).padStart(2, '0');
    }

    for (let day = 1; day <= dd; day++) {
      let date = new Date(currentYear1, month - 1, day);
      let dayName = date.toLocaleString('en-US', { weekday: 'long' });

      this.dateAndDayArray.push({
        date: day,
        dayName: dayName.slice(0, 3),
        time: ''
      });
    }
  };

  save() {
    let dataArr: any = [];
    let returnFunc = false;
    this.timeSheet.forEach((obj: any) => {
      obj.financialyear = this.currentYear;
      obj.month = this.currentMonth;
      obj.empid = this.userData.empid;
      obj.reportingmanager = this.userData.reportingmanager;
      obj.client = this.userData.client;
      if (obj.id == '') {
        if (this.toStr(obj.project) == '' || this.toStr(obj.task) == '') {
          this.toast.warning('Project and Task fields are mandatory');
          returnFunc = true;
          return;
        }
        dataArr.push(obj);
      }
    });
    if (returnFunc) {
      return;
    }
    dataArr.length !=0 && this.api.postTimesheet(dataArr).subscribe({
      next: (res: any) => {
        this.toast.success("Timesheet Saved Successfully");
        this.getTimesheet();
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    });
  };

  delProjTask(i: number) {
    if (!this.timeSheet[i].id) {
      this.timeSheet.splice(i, 1);
    } else {
      this.confirmationService.confirm({
        message: `Are you sure that you want to delete this Task?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteTimesheet(this.timeSheet[i].id).subscribe({
            next: (res: any) => {
              this.toast.success('Timesheet task deleted successfully!');
              this.getTimesheet();
            },
            error: (err: any) => {
              this.toast.error('Allocated task deleted falied!');
            }
          })
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      });
    }

  }

  selectProj(e: any, i: number) {
    const projObj = this.projectsArr.filter((res: any) => res.projectname == e.target.value);
    this.api.getTasksByProj(projObj[0].id).subscribe({
      next: (res: any) => {
        this.tasksArr = res;
        this.timeSheet[i].taskArr = this.tasksArr;
      },
      error: (err: any) => {
        this.toast.error('Something Went Wrong');
      }
    })
  };

  getTimesheet() {
    this.timeSheet = [];
    let dataObj = {
      name: this.userName,
      financialyear: this.currentYear,
      month: this.currentMonth
    };
    this.api.getTimesheet(dataObj).subscribe({
      next: (res: any) => {
        this.timeSheet = res;
      },
      error: (err: any) => {
        this.toast.error('Something Went Wrong');
      }
    })
  };

  updateTimesheet(obj: any) {
    if (Object.keys(this.updateObj).length === 0) {
      this.updateObj = obj;
    } else {
      this.updateObj = this.timeSheet.indexOf(this.updateObj) == this.timeSheet.indexOf(obj) ? {} : obj;
    }
  }

  updateBtnTM() {
    let i = this.timeSheet.indexOf(this.updateObj);
    if(this.toStr(this.updateObj.project) == '' || this.toStr(this.updateObj.task) == '') {
      this.toast.warning('Project and Task fields are mandatory');
      return;
    }
    // this.timeSheet[i].updatedby = this.userName;
    // this.timeSheet[i].updationon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy')

    this.api.updateTimesheet(this.timeSheet[i]).subscribe({
      next: (res: any) => {
        this.updateObj = {};
        this.toast.success('Timesheet Updated Successfully');
        this.getTimesheet();
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  };

  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  };
}
