import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  submitted: boolean = false;
  projStatus: any = [];
  taskType:any = [];
  prevProjStatus:string ='';

  taskForm = this.fb.group({
    task: ['', Validators.required],
    tasktype: [null, Validators.required],
    planstartdate: ['', Validators.required],
    planenddate: ['', Validators.required],
    taskstatus: [null, Validators.required],
    actualstartdate: [''],
    actualenddate: [''],
    holdfrom: [''],
    resumefrom: [''],
    discardedfrom: ['']
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dtPipe: DatePipe, private shared: SharedService, private api: ApiService,
    private tostr: ToastrService, private confirmationService: ConfirmationService,private loacation: Location) {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['ProjctId'];
      this.projectName = params['ProjectName'];
      this.getTasks();
    })
    this.userName = shared.userName
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getLov();
    }, 500);
  }
  back() {
    this.loacation.back();
  }
  clear() {
    this.taskForm.reset();
  }
  getLov() {
    let lovArr: any = this.shared.LOVArr;
    for (let i = 0; i < lovArr.length; i++) {
      switch (lovArr[i].type) {
        case 'Project Status':
          this.projStatus.push(lovArr[i].lov_desc);
          break;
          case 'Task Type':
          this.taskType.push(lovArr[i].lov_desc);
          break;
      }
    }
  };
  selectProjStatus() {
    let type = this.controls('taskstatus');

    this.taskForm.get('holdfrom')?.clearValidators();
    this.taskForm.get('holdfrom')?.updateValueAndValidity();
    this.taskForm.get('resumefrom')?.clearValidators();
    this.taskForm.get('resumefrom')?.updateValueAndValidity();
    this.taskForm.get('discardedfrom')?.clearValidators();
    this.taskForm.get('discardedfrom')?.updateValueAndValidity();
    this.taskForm.get('actualstartdate')?.clearValidators();
    this.taskForm.get('actualstartdate')?.updateValueAndValidity();
    this.taskForm.get('actualenddate')?.clearValidators();
    this.taskForm.get('actualenddate')?.updateValueAndValidity();

    if (this.prevProjStatus == 'Hold' && type == 'InProgress') {
      this.taskForm.get('resumefrom')?.setValidators(Validators.required);
      this.taskForm.get('resumefrom')?.updateValueAndValidity();
    } else if (type == 'Hold') {
      this.taskForm.get('holdfrom')?.setValidators(Validators.required);
      this.taskForm.get('holdfrom')?.updateValueAndValidity();
    } else if (type == 'Discarded') {
      this.taskForm.get('discardedfrom')?.setValidators(Validators.required);
      this.taskForm.get('discardedfrom')?.updateValueAndValidity();
    } else if (type == 'InProgress') {
      this.taskForm.get('actualstartdate')?.setValidators(Validators.required);
      this.taskForm.get('actualstartdate')?.updateValueAndValidity();
    } else if (type == 'Completed') {
      this.taskForm.get('actualenddate')?.setValidators(Validators.required);
      this.taskForm.get('actualenddate')?.updateValueAndValidity();
      this.taskForm.get('actualstartdate')?.setValidators(Validators.required);
      this.taskForm.get('actualstartdate')?.updateValueAndValidity();
    }
  };
  save() {
    this.selectProjStatus();
    this.submitted = false;
    if (this.taskForm.invalid) {
      this.tostr.warning("Please enter all mandatory fields");
      this.submitted = true;
      return;
    }
    if (this.shared.fromToDateValid(this.controls('planstartdate'), this.controls('planenddate'))) {
      this.taskForm.patchValue({ planenddate: '' });
      return;
    }
    if (this.shared.fromToDateValid(this.controls('actualstartdate'), this.controls('actualenddate'))) {
      this.taskForm.patchValue({ actualenddate: '' });
      return;
    }
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
    this.prevProjStatus = '';
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
  controls(formControl: string) {
    return this.taskForm.controls[formControl].value;
  }


}
