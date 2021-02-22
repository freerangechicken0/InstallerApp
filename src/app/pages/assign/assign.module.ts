import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';

import { AssignPageRoutingModule } from './assign-routing.module';

import { AssignPage } from './assign.page';

import { SensorsComponent } from './sensors/sensors.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AssignPageRoutingModule
  ],
  declarations: [
    AssignPage,
    SensorsComponent
  ]
})
export class AssignPageModule {}
