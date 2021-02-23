import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
  @Input() serialNumber: string;
  @Input() type: string;
  @Input() scanned: boolean = false;
  @Output() sensorRemoved: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public removeSensor(event) {
    this.sensorRemoved.emit(this.type);
    event.stopPropagation();
  }

  public printableType(type: string): string {
    switch (type) {
      case "lidarDistance": {
        return "Lidar Sensor"
      }
      case "stirrer": {
        return "Stirrer Sensor"
      }
      case "vatTemp": {
        return "Vat Temperature"
      }
      case "inletTemp": {
        return "Inlet Temperature"
      }
      case null: { }
      case "": {
        return "Unassigned"
      }
      default: {
        return type
      }
    }
  }
}
