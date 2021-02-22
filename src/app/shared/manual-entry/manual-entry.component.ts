import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  public serialNumber: string;

  constructor() { }

  ngOnInit() {}

  inputChange(event) {
    this.serialNumber = event.detail.value;
  }

  confirm() {
    if (this.serialNumber) {
      this.popover.dismiss(this.serialNumber);
    }
  }

  cancel() {
    this.popover.dismiss();
  }
}
