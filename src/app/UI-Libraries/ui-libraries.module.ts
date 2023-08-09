import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // OverlayPanelModule
  ],
  exports:[
    OverlayPanelModule,
    TableModule,
    CalendarModule,
    ConfirmDialogModule,
    SidebarModule,
    AutocompleteLibModule,
    AccordionModule
  ]
})
export class UILibrariesModule { }
