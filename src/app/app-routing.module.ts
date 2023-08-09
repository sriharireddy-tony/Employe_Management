import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'Auth/login', pathMatch: 'full' },
  { path: 'landingPage', component: HomeComponent },
  {
    path: 'Auth',
    loadChildren: () => import('./Modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'Project_Management',
    loadChildren: () => import('./Modules/project-management/project-management.module').then(m => m.ProjectManagementModule)
  },
  {
    path: 'Employee_Management',
    loadChildren: () => import('./Modules/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
  },
  {
    path: 'Dashboard',
    loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'Jobcard',
    loadChildren: () => import('./Modules/jobcard/jobcard.module').then(m => m.JobcardModule)
  },
  {
    path: 'Timesheet',
    loadChildren: () => import('./Modules/timesheets/timesheets.module').then(m => m.TimesheetsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
