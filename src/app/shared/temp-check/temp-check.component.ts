import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';


@Component({
  selector: 'app-temp-check',
  templateUrl: './temp-check.component.html',
  styleUrls: ['./temp-check.component.scss'],
})
export class TempCheckComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  @Input() allowCancel: boolean = true;
  @Input() vatIndex: number;
  @Input() type: string;
  @Input() temperature: number;
  @Input() empty: boolean = false;

  constructor() { }

  ngOnInit() {}

  emptyChange(event) {
    this.empty = event.target.checked;
  }

  inputChange(event) {
    this.temperature = event.detail.value;
  }

  confirm() {
    if (this.empty) {
      this.popover.dismiss({empty: true, temperature: null});
    }
    if (this.temperature) {
      this.popover.dismiss({empty: false, temperature: this.temperature});
    }
  }

  cancel() {
    this.popover.dismiss();
  }
}
