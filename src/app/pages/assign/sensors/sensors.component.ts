import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Vat } from 'src/app/core/_models/vat';
import { ToastService } from 'src/app/core/_services/toast.service';
import { SensorSelectComponent } from 'src/app/shared/sensor-select/sensor-select.component';
import { Sensor } from '../../../core/_models/sensor';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
})
export class SensorsComponent implements OnInit {
  @Input() sensors: Sensor[];
  @Input() transceiverId: string;
  @Input() vat: Vat;
  @Input() qrSensors: Sensor[];

  // public lidars: Sensor[] = [];
  // public stirrers: Sensor[] = [];
  // public temps: Sensor[] = [];
  // public unknown: Sensor[] = [];

  constructor(
    public popoverController: PopoverController,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    // for (var sensor of this.sensors) {
    //   if (sensor.serialNumber.startsWith("D")) {
    //     this.lidars.push(sensor);
    //   }
    //   else if (sensor.serialNumber.startsWith("CH")) {
    //     this.stirrers.push(sensor);
    //   }
    //   else if (sensor.serialNumber.startsWith("21")) {
    //     this.temps.push(sensor);
    //   }
    //   else {
    //     this.unknown.push(sensor);
    //   }
    // }
  }

  async showSensorSelect(sen: Sensor) {
    if (!this.vat) {
      this.toastService.createToast("Cannot assign sensor with no Product");
    }
    else {
      console.log(this.sensors);
      const popover = await this.popoverController.create({
        component: SensorSelectComponent,
        componentProps: {
          transceiverId: this.transceiverId,
          sensorId: sen.serialNumber,
          assignment: sen.type,
          sensorOptions: [["Lidar Sensor", "lidarDistance"], ["Stirrer Sensor", "stirrer"], ["Vat Temperature", "vatTemp"], ["Inlet Temperature", "inletTemp"], ["Unassigned", null]]
        },
        mode: 'md'
      });
  
      popover.onDidDismiss()
        .then((data) => {
          if (data.data !== undefined) {
            sen.type = data.data;
            sen.vatId = sen.type ? this.vat.id : null;
          }
        });
      return await popover.present();
    }
  }
}
