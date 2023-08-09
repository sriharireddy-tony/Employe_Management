import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  providers: [ConfirmationService]
})
export class TaskCreateComponent implements OnInit {
  projectId: number = 0;
  projectName: string = '';
  userName: string = '';
  tasksList: any = [];
  isSave: string = 'Save';
  updateId: number = 0;

  taskForm = this.fb.group({
    task: [''],
    tasktype: [''],
    planstartdate: [''],
    planenddate: [''],
    taskstatus: [''],
    actualstartdate: [''],
    actualenddate: [''],
    holdfrom: [''],
    resumefrom: [''],
    discardedfrom: ['']
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dtPipe: DatePipe, private shared: SharedService, private api: ApiService,
    private tostr: ToastrService, private confirmationService: ConfirmationService) {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['ProjctId'];
      this.projectName = params['ProjectName'];
      this.getTasks();
    })
    this.userName = shared.userName
  }

  ngOnInit(): void {

  }

  clear() {
    this.taskForm.reset();
  }
  save() {
    let dataObj = this.taskForm.value;
    dataObj.id = this.isSave == 'Save' ? '' : this.updateId;
    dataObj.actualstartdate = this.dtPipe.transform(dataObj.actualstartdate, 'dd-MM-yyyy');
    dataObj.actualenddate = this.dtPipe.transform(dataObj.actualenddate, 'dd-MM-yyyy');
    dataObj.planstartdate = this.dtPipe.transform(dataObj.planstartdate, 'dd-MM-yyyy');
    dataObj.planenddate = this.dtPipe.transform(dataObj.planenddate, 'dd-MM-yyyy');
    dataObj.holdfrom = this.dtPipe.transform(dataObj.holdfrom, 'dd-MM-yyyy');
    dataObj.resumefrom = this.dtPipe.transform(dataObj.resumefrom, 'dd-MM-yyyy');
    dataObj.discardedfrom = this.dtPipe.transform(dataObj.discardedfrom, 'dd-MM-yyyy');
    if (this.isSave == 'Save') {
      dataObj.createdon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy');
      dataObj.createdby = this.userName;
    } else if (this.isSave == 'Update') {
      dataObj.updationon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy');
      dataObj.updatedby = this.userName;
    }
    dataObj.projectid = +this.projectId;
    dataObj.project = this.projectName;
    dataObj.task = dataObj.task;
    dataObj.tasktype = dataObj.tasktype;
    dataObj.taskstatus = dataObj.taskstatus;

    if (this.isSave == 'Save') {
      this.api.postTask(dataObj).subscribe({
        next: (res: any) => {
          this.tostr.success('Task Saved Successfully');
          this.clear();
          this.getTasks();
        },
        error: (err: any) => {
          this.tostr.error('Something Went Wrong');
        }
      });
    } else if (this.isSave == 'Update') {
      this.api.updateTask(dataObj).subscribe({
        next: (res: any) => {
          this.tostr.success('Task Updated Successfully');
          this.clear();
          this.getTasks();
          this.isSave = 'Save';
        },
        error: (err: any) => {
          this.tostr.error('Something Went Wrong');
        }
      });
    }
  }

  getTasks() {
    this.api.getTask(this.projectId).subscribe({
      next: (res: any) => {
        this.tasksList = res;
      },
      error: (err: any) => {
        this.tostr.error('Something Went Wrong');
      }
    })
  };

  updateTask(obj: any) {
    this.isSave = 'Update';
    this.updateId = obj.id;
    this.taskForm.patchValue({
      task: obj.task,
      tasktype: obj.tasktype,
      taskstatus: obj.taskstatus,
      planstartdate: this.shared.convertToIST(obj.planstartdate),
      planenddate: this.shared.convertToIST(obj.planenddate),
      actualstartdate: this.shared.convertToIST(obj.actualstartdate),
      actualenddate: this.shared.convertToIST(obj.actualenddate),
      holdfrom: this.shared.convertToIST(obj.holdfrom),
      resumefrom: this.shared.convertToIST(obj.resumefrom),
      discardedfrom: this.shared.convertToIST(obj.discardedfrom)
    })
  }

  deleteTask(obj: any) {
      this.confirmationService.confirm({
        message: `Are you sure that you want to delete ${obj.task} task?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteTask(obj.id).subscribe({
            next: (res: any) => {
              this.tostr.success('Project Deleted Succesfully');
              this.getTasks();
            },
            error: (err: any) => {
              this.tostr.error('Project Deletion Failed');
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
  };

}
