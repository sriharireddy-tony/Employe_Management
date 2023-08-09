import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe, Location } from "@angular/common";
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css'],
  providers: [ConfirmationService]
})
export class ProjectTableComponent implements OnInit {
  projects: any = [];
  searchText: string = '';
  visible: string = 'none';
  isSave: string = 'Save';
  updateId:number=0;
  userName:string='';

  ref: DynamicDialogRef | undefined;

  projectForm = this.fb.group({
    projectname: [''],
    clientname: [''],
    financialyear: [''],
    ponumber: [''],
    poamount: [''],
    projectstatus: [''],
    postatus: [''],
    poclearedpercentage: [''],
    actualstartdate: [''],
    actualenddate: [''],
    planenddate: [''],
    planstartdate: [''],
    holdfrom: [''],
    resumefrom: [''],
    discardedfrom: ['']
  });

  constructor(private api: ApiService, private tostr: ToastrService, private confirmationService: ConfirmationService,
    private fb: FormBuilder, private dtPipe: DatePipe, private loacation:Location, private shared:SharedService) { }

  ngOnInit(): void {
    this.getProjects();
    this.userName = this.shared.userName;
  }

  getProjects() {
    this.api.getProjects().subscribe({
      next: (res: any) => {
        this.projects = res;
      },
      error: (err: any) => {
        this.tostr.error('Something went wrong')
      }
    })
  }

  clearText() {
    this.searchText = '';
  }
  back(){
    this.loacation.back();
  }

  deleteProjects(obj:any) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${obj.projectname} Project?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteProjects(obj.id).subscribe({
          next: (res: any) => {
            this.tostr.success('Project Deleted Succesfully');
            this.getProjects();
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
  closePopup(){
    this.visible = 'none'
    this.projectForm.reset();
  }
  createProject() {
    this.isSave = 'Save';
    this.visible = 'block'
    this.projectForm.reset();
  }
  projectClick(obj: any) {
    this.visible = 'block'
    this.isSave = 'Update';
    this.updateId = obj.id;
    this.projectForm.patchValue({
      projectname: obj.projectname,
      clientname: obj.clientname,
      financialyear: obj.financialyear,
      ponumber: obj.ponumber,
      poamount: obj.poamount,
      projectstatus: obj.projectstatus,
      postatus: obj.postatus,
      poclearedpercentage: obj.poclearedpercentage,
      actualstartdate: this.shared.convertToIST(obj.actualstartdate),
      actualenddate: this.shared.convertToIST(obj.actualenddate),
      planenddate: this.shared.convertToIST(obj.planenddate),
      planstartdate: this.shared.convertToIST(obj.planstartdate),
      holdfrom: this.shared.convertToIST(obj.holdfrom),
      resumefrom: this.shared.convertToIST(obj.resumefrom),
      discardedfrom: this.shared.convertToIST(obj.discardedfrom)
    })

  }

  clearProjects() {
    this.projectForm.reset();

  }

  saveProjects() {
    var dataObj = {
      "id" : this.updateId ? this.updateId : '',
      "projectname": this.projectForm.controls['projectname'].value,
      "clientname": this.projectForm.controls['clientname'].value,
      "financialyear": this.projectForm.controls['financialyear'].value,
      "ponumber": this.projectForm.controls['ponumber'].value,
      "poamount": +this.projectForm.controls['poamount'].value,
      "projectstatus": this.projectForm.controls['projectstatus'].value,
      "postatus": this.projectForm.controls['postatus'].value,
      "poclearedpercentage": +this.projectForm.controls['poclearedpercentage'].value,
      "actualstartdate": this.dtPipe.transform(this.projectForm.controls['actualstartdate'].value, 'dd-MM-yyyy'),
      "actualenddate": this.dtPipe.transform(this.projectForm.controls['actualenddate'].value, 'dd-MM-yyyy'),
      "planenddate": this.dtPipe.transform(this.projectForm.controls['planenddate'].value, 'dd-MM-yyyy'),
      "planstartdate": this.dtPipe.transform(this.projectForm.controls['planstartdate'].value, 'dd-MM-yyyy'),
      "holdfrom": this.dtPipe.transform(this.projectForm.controls['holdfrom'].value, 'dd-MM-yyyy'),
      "resumefrom": this.dtPipe.transform(this.projectForm.controls['resumefrom'].value, 'dd-MM-yyyy'),
      "discardedfrom": this.dtPipe.transform(this.projectForm.controls['discardedfrom'].value, 'dd-MM-yyyy'),
      "createdby" : this.userName,
      "createdon" : this.dtPipe.transform(new Date(), 'dd-MM-yyyy'),
      "updatedby" : '',
      "updatedon" : ''
    }

    if (this.isSave == 'Save') {
      this.api.postProjects(dataObj).subscribe({
        next: (res: any) => {
          this.tostr.success('Project Saved Succesfully');
          this.getProjects();
          this.closePopup();
        },
        error: (err: any) => {
          this.tostr.error(err.error ? err.error : 'Something went wrong');
        }
      })
    } else if(this.isSave == 'Update') {
      dataObj.updatedby = this.userName;
      dataObj.updatedon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy') || '';

      this.api.updateProjects(dataObj,  this.updateId).subscribe({
        next: (res: any) => {
          this.tostr.success('Project Updated Succesfully');
          this.getProjects();
          this.closePopup();
        },
        error: (err: any) => {
          this.tostr.error('Something Went Wrong');
        }
      })
    }
  };

  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }
}
