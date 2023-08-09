import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetsComponent } from './timesheets.component';
import { EmployeeTimesheetComponent } from './employee-timesheet/employee-timesheet.component';

const routes: Routes = [
  {path:'',  redirectTo: 'empTimesheet' , pathMatch:'full'},
  {path: '',  component: TimesheetsComponent, children: [
    { path: 'empTimesheet', component: EmployeeTimesheetComponent }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetsRoutingModule { }
