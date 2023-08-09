import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/Services/api.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
  providers: [ConfirmationService]
})
export class EmployeeTableComponent implements OnInit, OnDestroy {

  keyword = 'type';
  projects: any = [];
  searchText: string = '';
  visible: string = 'none';
  isSave: string = 'Save';
  updateId: number = 0;
  ReporManger: any = [];
  statusArr: any = [];
  clientsArr: any = [];
  roles: any = [];
  submitted:boolean=false;

  employeeForm = this.fb.group({
    empid: ['', Validators.required],
    empname: ['', Validators.required],
    email: ['', [Validators.required,Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)]],
    password: ['', Validators.required],
    mobileno: ['', Validators.required],
    reportingmanager: ["", Validators.required],
    joiningdate: ['', Validators.required],
    status: [null, Validators.required],
    inactivefrom: [''],
    client: [null, Validators.required],
    roles: [null, Validators.required]
  });

  constructor(private api: ApiService, private tostr: ToastrService, private confirmationService: ConfirmationService,
    private fb: FormBuilder, private dtPipe: DatePipe, private loacation: Location, private shared: SharedService) { }

  ngOnInit(): void {
    this.getEmployees();
    setTimeout(() => {
      this.getLov();
    }, 500);
  }
  ngOnDestroy() {

  }

  getEmployees() {
    this.api.getEmployees().subscribe({
      next: (res: any) => {
        this.projects = res;
      },
      error: (err: any) => {
        this.tostr.error('Something went wrong')
      }
    })
  }

  getLov() {
    let lovArr: any = this.shared.LOVArr;
    for (let i = 0; i < lovArr.length; i++) {
      switch (lovArr[i].type) {
        case 'Reporting Manager':
          this.ReporManger.push({ type: lovArr[i].lov_desc });
          break;
        case 'Status':
          this.statusArr.push(lovArr[i].lov_desc);
          break;
        case 'Client':
          this.clientsArr.push(lovArr[i].lov_desc);
          break;
        case 'Roles':
          this.roles.push(lovArr[i].lov_desc);
          break;
      }
    }
  };

  clearText() {
    this.searchText = '';
  }

  back() {
    this.loacation.back();
  }

  deleteEmployees(obj: any) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${obj.empname} Employee?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteEmployees(obj.id).subscribe({
          next: (res: any) => {
            this.tostr.success("Employee Deleted Successfull");
            this.getEmployees();
          },
          error: (err: any) => {
            this.tostr.error("Employee Deletion Faliled");
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
    this.employeeForm.reset();
  }
  createEmployees() {
    this.isSave = 'Save';
    this.visible = 'block'
    this.employeeForm.reset();
  }
  projectClick(obj: any) {
    this.visible = 'block'
    this.isSave = 'Update';
    this.updateId = obj.id;
    this.employeeForm.patchValue({
      empid: obj.empid,
      empname: obj.empname,
      email: obj.email,
      password: obj.password,
      mobileno: obj.mobileno,
      reportingmanager: obj.reportingmanager,
      joiningdate: this.shared.convertToIST(obj.joiningdate),
      status: obj.status,
      inactivefrom: this.shared.convertToIST(obj.inactivefrom),
      client: obj.client,
      roles: obj.roles,
    })

  }

  clearEmployees() {
    this.employeeForm.reset();
    this.submitted = false;
  }

  saveEmployees() {
    this.submitted = false;
    if (this.employeeForm.invalid) {
      this.tostr.warning("Please enter all mandatory fields");
      this.submitted = true;
      return;
    }
    let RM = this.employeeForm.controls['reportingmanager'].value;
    var dataObj = {
      "id": this.isSave == 'Save' ? '' : this.updateId,
      "empid": +this.employeeForm.controls['empid'].value,
      "empname": this.employeeForm.controls['empname'].value,
      "email": this.employeeForm.controls['email'].value,
      "password": this.employeeForm.controls['password'].value,
      "mobileno": this.employeeForm.controls['mobileno'].value,
      "reportingmanager": typeof (RM) == 'string' ? RM : typeof (RM) == 'object' ? RM['type'] : RM,
      "status": this.employeeForm.controls['status'].value,
      "client": this.employeeForm.controls['client'].value,
      "roles": this.employeeForm.controls['roles'].value,
      "joiningdate": this.dtPipe.transform(this.employeeForm.controls['joiningdate'].value, 'dd-MM-yyyy'),
      "inactivefrom": this.dtPipe.transform(this.employeeForm.controls['inactivefrom'].value, 'dd-MM-yyyy')
    }

    if (this.isSave == 'Save') {
      this.api.postEmployees(dataObj).subscribe({
        next: (res: any) => {
          this.tostr.success("Employee Saved Successfull");
          this.getEmployees();
          this.closePopup();
        },
        error: (err: any) => {
          this.tostr.error("Something Went Wrong");
        }
      })
    } else if (this.isSave == 'Update') {
      this.api.updateEmployees(dataObj, this.updateId).subscribe({
        next: (res: any) => {
          this.tostr.success("Employee Updated Successfull");
          this.getEmployees();
          this.closePopup();
          this.isSave = 'Save';
        },
        error: (err: any) => {
          this.tostr.error("Something Went Wrong");
        }
      })
    }
  };

  controls(formControl:string){
    return this.employeeForm.controls[formControl].value;
  }

  toStr(data: string | null | undefined) {
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }

}
