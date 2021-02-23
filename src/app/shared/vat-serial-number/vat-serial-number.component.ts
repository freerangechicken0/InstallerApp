import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';

@Component({
  selector: 'app-vat-serial-number',
  templateUrl: './vat-serial-number.component.html',
  styleUrls: ['./vat-serial-number.component.scss'],
})
export class VatSerialNumberComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  @Input() vatIndex: number;
  @Input() serialNumber: string;

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
