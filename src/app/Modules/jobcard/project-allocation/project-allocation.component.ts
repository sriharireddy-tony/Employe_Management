import { DatePipe, Location } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-project-allocation',
  templateUrl: './project-allocation.component.html',
  styleUrls: ['./project-allocation.component.css'],
  providers: [ConfirmationService]
})
export class ProjectAllocationComponent implements OnInit, OnChanges {
  userName: string = '';
  empListArr: any = [];
  projectsArr: any = [];
  projAllocation: any = [];
  tabClickIndex: any = {};
  tabClickObj: any = {};
  updateObj: any = {};
  empTasks: any = [];
  tasksArr:any =[];

  constructor(private location: Location, private servShared: SharedService, private api: ApiService, private toast: ToastrService,
    private confirmationService: ConfirmationService, private dtPipe: DatePipe) { }

  ngOnInit(): void {
    this.userName = this.servShared.userName;
    this.getEmployeeBYRM();
    this.getProjectsForJobcard();
  }
  ngOnChanges() {
    // this.userName = this.servShared.userName;
  }

  back() {
    this.location.back();
  }
  addProjAllo() {
    this.projAllocation.push({
      id: '', empId: '', project: null, task: null, client: '', remarks: '', startdate: '', enddate: '',
      allocationpercentage: '', allocationhours: '', createdby: '', createdon: '',tasksArr: this.tasksArr
    })
    this.empClick(this.tabClickObj);
  };

  saveProjAllo() {
    for (let obj of this.projAllocation) {
      if (!obj.id) {
        obj.startdate = this.dtPipe.transform(obj.startdate, 'dd-MM-yyyy'),
          obj.enddate = this.dtPipe.transform(obj.enddate, 'dd-MM-yyyy'),
          obj.empId = +obj.empId;
        obj.allocationhours = +obj.allocationhours;
      }
    }
    if(this.projAllocation.length != 0){
      this.api.postProjAllo(this.projAllocation).subscribe({
        next: (res: any) => {
          this.toast.success('Task Allocationed Succesfully');
          this.getEmpTasks(this.tabClickObj);
        }, error: (err: any) => {
          this.toast.error('Something Went Wrong');
        }
      })
    }
  };

  getEmpTasks(obj: any) {
    this.projAllocation = [];
    this.api.getProjAllo(obj.empid).subscribe({
      next: (res: any) => {
        this.projAllocation = res;
      }, error: (err: any) => {
        this.toast.error('Something Went Wrong');
      }
    })
  }

  delProj(obj: any) {
    if (obj.id == '') {
      this.projAllocation.splice(this.projAllocation.indexOf(obj), 1)
    } else {
      this.confirmationService.confirm({
        message: `Are you sure that you want to delete this Task?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteProjAllo(obj.id).subscribe({
            next: (res: any) => {
              this.toast.success('Allocated task deleted successfully!');
              obj.empid = obj.empId;
              this.getEmpTasks(obj);
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
  empClick(obj1: any) {
    this.tabClickObj = obj1;
    this.updateObj = {};
    for (let obj of this.projAllocation) {
      obj.empId = obj1.empid;
      obj.client = obj1.client;
      obj.createdby = this.userName;
      obj.createdon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy')
    }
  }
  updateProj(obj: any) {
    if (Object.keys(this.updateObj).length === 0) {
      this.updateObj = obj;
    } else {
      this.updateObj = this.projAllocation.indexOf(this.updateObj) == this.projAllocation.indexOf(obj) ? {} : obj;
    }
  }
  updateProjAllo() {
    let i = this.projAllocation.indexOf(this.updateObj)
    this.projAllocation[i].updatedby = this.userName;
    this.projAllocation[i].updationon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy')
    this.projAllocation[i].allocationhours = +this.projAllocation[i].allocationhours;

    this.api.updateProjAllo(this.projAllocation[i]).subscribe({
      next: (res: any) => {
        this.toast.success('Task Allocation Updated Succesfully');
        this.getEmpTasks(this.tabClickObj);
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  }

  getEmployeeBYRM() {
    this.api.getEmpByRM(this.userName).subscribe({
      next: (res: any) => {
        this.empListArr = res;
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  }
  getProjectsForJobcard() {
    this.api.getProjectsForJobcard().subscribe({
      next: (res: any) => {
        this.projectsArr = res;
      }, error: (err: any) => {
        this.toast.error("something Went Wrong");
      }
    })
  }
  selectProj(e: any,i:number) {
    const projObj = this.projectsArr.filter((res: any) => res.projectname == e.target.value);
    this.api.getTasksByProj(projObj[0].id).subscribe({
      next: (res: any) => {
        this.tasksArr = res;
        this.projAllocation[i].tasksArr = this.tasksArr;
      },
      error: (err: any) => {
        this.toast.error('Something Went Wrong');
      }
    })
  };

  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}
