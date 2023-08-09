import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { EmployeeManagementComponent } from './employee-management.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [
    EmployeeManagementComponent,
    EmployeeTableComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    SharedModule
  ]
})
export class EmployeeManagementModule { }
