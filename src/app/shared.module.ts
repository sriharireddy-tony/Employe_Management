import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class SharedModule { }
