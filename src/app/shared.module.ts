import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UILibrariesModule } from './UI-Libraries/ui-libraries.module';
import { SearchFilterPipe } from './Custom-Pipes/search-filter.pipe';
import { NumsOnlyDirective } from './Directives/nums-only.directive';
import { HeaderComponent } from './Components/header/header.component';
// import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    SearchFilterPipe,
    NumsOnlyDirective,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    UILibrariesModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    UILibrariesModule,
    SearchFilterPipe,
    NumsOnlyDirective,
    HeaderComponent
  ],
  providers: []
})
export class SharedModule { }
