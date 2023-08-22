import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
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
  submitted: boolean = false;
  selectedRoles: string = '';
  selectedArr: any = [];

  employeeForm = this.fb.group({
    empid: ['', Validators.required],
    empname: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)]],
    // password: ['', Validators.required],
    mobileno: ['', [Validators.required, this.mobileNumberValidator]],
    reportingmanager: ["", Validators.required],
    joiningdate: ['', Validators.required],
    status: [null, Validators.required],
    inactivefrom: [''],
    client: [null, Validators.required],
    roles: [null, Validators.required]
  });

  mobileNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^\d{10}$/.test(value)) {
      return { 'invalidMobileNumber': true };
    }
    return null;
  }

  get mobileno() {
    return this.employeeForm.get('mobileno');
  }

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

  selectRoles(e: any) {
    if (this.selectedArr.length !=0) {
      if (this.selectedArr.includes(e.itemValue.role)) {
        this.selectedArr.splice(this.selectedArr.indexOf(e.itemValue.role), 1)
      } else {
        this.selectedArr.push(e.itemValue.role)
      }
    } else {
      this.selectedArr.push(e.itemValue.role)
    }
    this.selectedRoles = this.selectedArr.toString();
  }

  getLov() {
    let lovArr: any = this.shared.LOVArr;
    for (let i = 0; i < lovArr.length; i++) {
      switch (lovArr[i].type) {
        case 'Reporting Manager':
          this.ReporManger.push({ type: lovArr[i].lovDesc });
          break;
        case 'Status':
          this.statusArr.push(lovArr[i].lovDesc);
          break;
        case 'Client':
          this.clientsArr.push(lovArr[i].lovDesc);
          break;
        case 'Roles':
          this.roles.push({ role: lovArr[i].lovDesc });
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
      // password: obj.password,
      mobileno: obj.mobileno,
      reportingmanager: obj.reportingmanager,
      joiningdate: this.shared.convertToIST(obj.joiningdate),
      status: obj.status,
      inactivefrom: this.shared.convertToIST(obj.inactivefrom),
      client: obj.client,
      roles: this.rolesFun(obj.roles),
    })
  }
  rolesFun(str: string) {
    this.selectedArr =[];
    let arr: any = [];
    str.split(',').forEach((item: string) => {
      this.selectedArr.push(item);
      arr.push({ role: item })
    })
    this.selectedRoles = this.selectedArr.toString();
    return arr;
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
      // "password": this.employeeForm.controls['password'].value,
      "mobileno": this.employeeForm.controls['mobileno'].value,
      "reportingmanager": typeof (RM) == 'string' ? RM : typeof (RM) == 'object' ? RM['type'] : RM,
      "status": this.employeeForm.controls['status'].value,
      "client": this.employeeForm.controls['client'].value,
      "roles": this.selectedRoles,
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

  controls(formControl: string) {
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
