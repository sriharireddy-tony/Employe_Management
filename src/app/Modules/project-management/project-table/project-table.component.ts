import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe, Location } from "@angular/common";
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedService } from 'src/app/Services/shared.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

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
  updateId: number = 0;
  userName: string = '';
  clientsArr: any = [];
  projStatus: any = [];
  submitted: boolean = false;
  yearArr: any = [];
  prevProjStatus: string = '';
  POStatus: any = [];

  ref: DynamicDialogRef | undefined;

  projectForm = this.fb.group({
    projectname: ['', Validators.required],
    clientname: ['', Validators.required],
    financialyear: ['', Validators.required],
    ponumber: [''],
    poamount: [''],
    projectstatus: ['', Validators.required],
    postatus: [null],
    poclearedpercentage: [''],
    actualstartdate: [''],
    actualenddate: [''],
    planenddate: ['', Validators.required],
    planstartdate: ['', Validators.required],
    holdfrom: ['', Validators.required],
    resumefrom: ['', Validators.required],
    discardedfrom: ['', Validators.required]
  });

  constructor(private api: ApiService, private tostr: ToastrService, private confirmationService: ConfirmationService,
    private fb: FormBuilder, private dtPipe: DatePipe, private loacation: Location, private shared: SharedService) { }

  ngOnInit(): void {
    this.getProjects();
    this.userName = this.shared.userName;
    setTimeout(() => {
      this.getLov();
    }, 500);
    this.getYear();
  };

  getLov() {
    let lovArr: any = this.shared.LOVArr;
    for (let i = 0; i < lovArr.length; i++) {
      switch (lovArr[i].type) {
        case 'Client':
          this.clientsArr.push(lovArr[i].lov_desc);
          break;
        case 'Project Status':
          this.projStatus.push(lovArr[i].lov_desc);
          break;
        case 'PO Status':
          this.POStatus.push(lovArr[i].lov_desc);
          break;
      }
    }
  };

  getYear() {
    let currentYear1 = new Date().getFullYear();
    let prevYear = currentYear1 - 1;
    for (let s = prevYear; s <= currentYear1; currentYear1--) {
      this.yearArr.push(currentYear1)
    }
  }
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  filePathBody: any = {};
  docsArr: any = [];

  uploadDoc(e: any) {
    this.progress = 0;
    let selectedFiles = e.target.files
    const file: File | null = selectedFiles.item(0);

    if (file) {
      this.currentFile = file;

      this.api.postDocs(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            // this.fileInfos = this.api.getFiles();
            this.docsArr = [];
            this.filePathBody = event.body;
            this.docsArr.push({ id: '', docname: event.body.docname, remarks: '' })
            this.currentFile = undefined;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            // this.message = err.error.message;
          } else {
            // this.message = 'Could not upload the file!';
          }
          this.currentFile = undefined;
        },
      });
    }
    this.selectedFiles = undefined;
  };

  saveDocs(projectId: string, type: string) {
    let data = {
      docname: this.filePathBody.docname,
      docpath: this.filePathBody.docpath,
      doctype: this.filePathBody.doctype,
      entitygeneratedid: projectId,
      entityname: 'Project',
      uploadedby: this.userName,
      uploadedon: this.dtPipe.transform(new Date(), 'dd-MM-yyyy')
    }
    this.api.saveDoc(data).subscribe({
      next: (res: any) => {
        let msg = type == 'save' ? 'Project Saved Succesfully' : type == 'update' ? 'Project Update Succesfully' : ''
        this.tostr.success(msg);
        this.getProjects();
        this.closePopup();
      },
      error: (err: any) => {
        this.tostr.error('Document Saving Failed')
      }
    });
  };

  getDocs(projId: number) {
    this.api.getDocs('Project', projId).subscribe({
      next: (res: any) => {
        this.docsArr = res;
      },
      error: (err: any) => {
        this.tostr.error('Document getting failed');
      }
    });
  };
  delDoc(obj: any) {
    if (obj.id == ''){
      this.docsArr.splice(this.docsArr.indexOf(obj), 1)
    } else {
      this.api.deleteDoc(obj.id).subscribe({
        next: (res:any) => {
          this.tostr.error('File deleted successfully');
          this.docsArr.splice(this.docsArr.indexOf(obj), 1)
        },
        error: (err: any) => {
          this.tostr.error('Document downloading failed')
        }
      })
    }
  }

  downloadFile(fileName: string) {
    this.api.downloadDocs(fileName).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (err: any) => {
        this.tostr.error('Document downloading failed')
      }
    })
  };

  selectPOStatus(e: any) {
    if (e.target.value == 'Cleared') {
      this.projectForm.patchValue({ poclearedpercentage: '100' });
    } else {
      this.projectForm.patchValue({ poclearedpercentage: '' });
    }
    if (e.target.value != "null") {
      this.projectForm.get('ponumber')?.setValidators(Validators.required);
      this.projectForm.get('ponumber')?.updateValueAndValidity();
      this.projectForm.get('poamount')?.setValidators(Validators.required);
      this.projectForm.get('poamount')?.updateValueAndValidity();
    } else {
      this.projectForm.get('ponumber')?.clearValidators();
      this.projectForm.get('ponumber')?.updateValueAndValidity();
      this.projectForm.get('poamount')?.clearValidators();
      this.projectForm.get('poamount')?.updateValueAndValidity();
    }
  };

  getProjects() {
    this.api.getProjects().subscribe({
      next: (res: any) => {
        this.projects = res;
      },
      error: (err: any) => {
        this.tostr.error('Something went wrong');
      }
    })
  };

  selectProjStatus() {
    let type = this.controls('projectstatus');

    this.projectForm.get('holdfrom')?.clearValidators();
    this.projectForm.get('holdfrom')?.updateValueAndValidity();
    this.projectForm.get('resumefrom')?.clearValidators();
    this.projectForm.get('resumefrom')?.updateValueAndValidity();
    this.projectForm.get('discardedfrom')?.clearValidators();
    this.projectForm.get('discardedfrom')?.updateValueAndValidity();
    this.projectForm.get('actualstartdate')?.clearValidators();
    this.projectForm.get('actualstartdate')?.updateValueAndValidity();
    this.projectForm.get('actualenddate')?.clearValidators();
    this.projectForm.get('actualenddate')?.updateValueAndValidity();

    if (this.prevProjStatus == 'Hold' && type == 'InProgress') {
      this.projectForm.get('resumefrom')?.setValidators(Validators.required);
      this.projectForm.get('resumefrom')?.updateValueAndValidity();
    } else if (type == 'Hold') {
      this.projectForm.get('holdfrom')?.setValidators(Validators.required);
      this.projectForm.get('holdfrom')?.updateValueAndValidity();
    } else if (type == 'Discarded') {
      this.projectForm.get('discardedfrom')?.setValidators(Validators.required);
      this.projectForm.get('discardedfrom')?.updateValueAndValidity();
    } else if (type == 'InProgress') {
      this.projectForm.get('actualstartdate')?.setValidators(Validators.required);
      this.projectForm.get('actualstartdate')?.updateValueAndValidity();
    } else if (type == 'Completed') {
      this.projectForm.get('actualenddate')?.setValidators(Validators.required);
      this.projectForm.get('actualenddate')?.updateValueAndValidity();
      this.projectForm.get('actualstartdate')?.setValidators(Validators.required);
      this.projectForm.get('actualstartdate')?.updateValueAndValidity();
    }
  };

  clearText() {
    this.searchText = '';
  }
  back() {
    this.loacation.back();
  }

  deleteProjects(obj: any) {
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
            this.tostr.error(err.error? err.error.status : 'Project Deletion Failed');
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

  closePopup() {
    this.visible = 'none'
    this.projectForm.reset();
  }
  createProject() {
    this.isSave = 'Save';
    this.visible = 'block'
    this.projectForm.reset();
    this.docsArr = [];
    this.prevProjStatus == '';
  }
  projectClick(obj: any) {
    this.visible = 'block'
    this.isSave = 'Update';
    this.updateId = obj.id;
    this.prevProjStatus = obj.projectstatus;
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
    this.getDocs(this.updateId);
  }

  clearProjects() {
    this.projectForm.reset();

  }

  saveProjects() {
    this.submitted = false;
    this.selectProjStatus();
    if (this.projectForm.invalid) {
      this.tostr.warning("Please enter all mandatory fields");
      this.submitted = true;
      return;
    }
    if (this.shared.fromToDateValid(this.controls('planstartdate'), this.controls('planenddate'))) {
      this.projectForm.patchValue({ planenddate: '' });
      return;
    }
    if (this.shared.fromToDateValid(this.controls('actualstartdate'), this.controls('actualenddate'))) {
      this.projectForm.patchValue({ actualenddate: '' });
      return;
    }
    var dataObj = {
      "id": this.isSave == 'Save' ? '' : this.updateId,
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
      "createdby": this.userName,
      "createdon": this.dtPipe.transform(new Date(), 'dd-MM-yyyy'),
      "updatedby": '',
      "updatedon": ''
    }

    if (this.isSave == 'Save') {
      this.api.postProjects(dataObj).subscribe({
        next: (res: any) => {
          this.saveDocs(res.projectId, 'save');
        },
        error: (err: any) => {
          this.tostr.error(err.error ? err.error : 'Something went wrong');
        }
      })
    } else if (this.isSave == 'Update') {
      dataObj.updatedby = this.userName;
      dataObj.updatedon = this.dtPipe.transform(new Date(), 'dd-MM-yyyy') || '';

      this.api.updateProjects(dataObj, this.updateId).subscribe({
        next: (res: any) => {
          this.saveDocs(this.updateId.toString(), 'update');
        },
        error: (err: any) => {
          this.tostr.error('Something Went Wrong');
        }
      })
    }
  };

  controls(formControl: string) {
    return this.projectForm.controls[formControl].value;
  }

  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }
}
