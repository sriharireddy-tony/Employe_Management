import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [
    ProjectTableComponent
  ],
  imports: [
    CommonModule,
    ProjectManagementRoutingModule,
    SharedModule
  ]
})
export class ProjectManagementModule { }
