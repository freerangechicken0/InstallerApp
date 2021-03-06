import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';

@Component({
  selector: 'app-sensor-select',
  templateUrl: './sensor-select.component.html',
  styleUrls: ['./sensor-select.component.scss'],
})
export class SensorSelectComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  @Input() transceiverSerialNumber: string;
  @Input() sensorSerialNumber: string;
  @Input() assignment: string;
  @Input() sensorOptions: string[][];
  public selection: string;
  public nVats: number[] = [1, 2, 3];

  constructor() { }

  ngOnInit() {
    this.selection = this.assignment;
  }

  radioGroupChange(event) {
    this.selection = event.detail.value;
  }

  confirm() {
    this.popover.dismiss(this.selection);
  }

  cancel() {
    this.popover.dismiss();
  }
}
