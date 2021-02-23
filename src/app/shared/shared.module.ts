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
import { HealthAndSafetyModalComponent } from './health-and-safety-modal/health-and-safety-modal.component';
import { AddNewHazardPopoverComponent } from './health-and-safety-modal/add-new-hazard-popover/add-new-hazard-popover.component';
import { TempCheckComponent } from './temp-check/temp-check.component';
import { VatSerialNumberComponent } from './vat-serial-number/vat-serial-number.component';
import { SensorsComponent } from './sensors/sensors.component';
import { PhotosModalComponent } from './photos-modal/photos-modal.component';
import { JobSelectComponent } from './select-button/search-modal/job-select/job-select.component';

@NgModule({
  declarations: [
    OrgHeaderComponent,
    TileComponent,
    SensorSelectComponent,
    SearchModalComponent,
    SelectButtonComponent,
    InfoModalComponent,
    ManualEntryComponent,
    HealthAndSafetyModalComponent,
    AddNewHazardPopoverComponent,
    TempCheckComponent,
    VatSerialNumberComponent,
    SensorsComponent,
    PhotosModalComponent,
    JobSelectComponent,
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
    HealthAndSafetyModalComponent,
    AddNewHazardPopoverComponent,
    TempCheckComponent,
    InfoModalComponent,
    VatSerialNumberComponent,
    SensorsComponent,
    PhotosModalComponent,
    JobSelectComponent,
    DateFnsModule
  ]
})
export class SharedModule { }
