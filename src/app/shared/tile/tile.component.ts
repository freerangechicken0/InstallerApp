import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
  @Input() serialNumber: string;
  @Input() type: string;

  constructor() { }

  ngOnInit() {
  }

  printableType(type: string): string {
    switch(type) {
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
      case null: {}
      case "": {
        return "Unassigned"
      }
      default: {
        return type
      }
    }
  }
}
