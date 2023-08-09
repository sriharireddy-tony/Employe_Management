import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobcardComponent } from './jobcard.component';
import { ProjectAllocationComponent } from './project-allocation/project-allocation.component';

const routes: Routes = [
  {path:'',  redirectTo: 'projectAllocation' , pathMatch:'full'},
  {path: '',  component: JobcardComponent, children: [
    { path: 'projectAllocation', component: ProjectAllocationComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobcardRoutingModule { }
