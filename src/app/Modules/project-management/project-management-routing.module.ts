import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectManagementComponent } from './project-management.component';
import { TaskCreateComponent } from './task-create/task-create.component';

const routes: Routes = [
  {path: '',  component: ProjectManagementComponent, children: [
    { path: 'projectsList', component: ProjectTableComponent },
    { path: 'taskCreate', component: TaskCreateComponent}
  ]},
  // {path: 'projectsList',  component: ProjectTableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
