import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';

const routes: Routes = [
  {path: '',  component: EmployeeManagementComponent, children: [
    { path: 'employeeList', component: EmployeeTableComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
