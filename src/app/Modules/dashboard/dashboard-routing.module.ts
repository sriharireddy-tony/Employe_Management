import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LOVValuesComponent } from './lov-values/lov-values.component';

const routes: Routes = [
  {path:'',  redirectTo: 'lovValues' , pathMatch:'full'},
  {path:'' ,component: DashboardComponent,children : [
    {path : 'lovValues', component:LOVValuesComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
