import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgHeaderComponent } from './org-header/org-header.component';
import { TileComponent } from './tile/tile.component';
import { SensorSelectComponent } from './sensor-select/sensor-select.component';
import { SelectButtonComponent } from './select-button/select-button.component';
import { SearchModalComponent } from './select-button/search-modal/search-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { DateFnsModule } from 'ngx-date-fns';

@NgModule({
  declarations: [
    OrgHeaderComponent,
    TileComponent,
    SensorSelectComponent,
    SearchModalComponent,
    SelectButtonComponent,
    InfoModalComponent,
    ManualEntryComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateFnsModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    OrgHeaderComponent,
    TileComponent,
    SensorSelectComponent,
    SearchModalComponent,
    SelectButtonComponent,
    ManualEntryComponent,
    InfoModalComponent,
    DateFnsModule
  ]
})
export class SharedModule { }
