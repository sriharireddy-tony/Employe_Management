import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { SharedModule } from 'src/app/shared.module';
import { ProjectManagementComponent } from './project-management.component';
import { TaskCreateComponent } from './task-create/task-create.component';

@NgModule({
  declarations: [
    ProjectTableComponent,
    ProjectManagementComponent,
    TaskCreateComponent
  ],
  imports: [
    CommonModule,
    ProjectManagementRoutingModule,
    SharedModule,
  ]
})
export class ProjectManagementModule { }
