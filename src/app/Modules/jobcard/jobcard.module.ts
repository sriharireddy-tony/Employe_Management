import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobcardRoutingModule } from './jobcard-routing.module';
import { JobcardComponent } from './jobcard.component';
import { SharedModule } from 'src/app/shared.module';
import { ProjectAllocationComponent } from './project-allocation/project-allocation.component';



@NgModule({
  declarations: [
    JobcardComponent,
    ProjectAllocationComponent
  ],
  imports: [
    CommonModule,
    JobcardRoutingModule,
    SharedModule
  ]
})
export class JobcardModule { }
