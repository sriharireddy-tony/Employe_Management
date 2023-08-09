import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetsRoutingModule } from './timesheets-routing.module';
import { TimesheetsComponent } from '../timesheets/timesheets.component';
import { SharedModule } from 'src/app/shared.module';
import { EmployeeTimesheetComponent } from './employee-timesheet/employee-timesheet.component';


@NgModule({
  declarations: [
    TimesheetsComponent,
    EmployeeTimesheetComponent
  ],
  imports: [
    CommonModule,
    TimesheetsRoutingModule,
    SharedModule
  ]
})
export class TimesheetsModule { }
