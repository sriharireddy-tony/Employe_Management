import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UILibrariesModule } from './UI-Libraries/ui-libraries.module';
import { SearchFilterPipe } from './Custom-Pipes/search-filter.pipe';
import { NumsOnlyDirective } from './Directives/nums-only.directive';
// import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    SearchFilterPipe,
    NumsOnlyDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    UILibrariesModule,
    SearchFilterPipe,
    // ScrollingModule
  ],
  providers: []
})
export class SharedModule { }
