import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';


@Component({
  selector: 'app-add-new-hazard-popover',
  templateUrl: './add-new-hazard-popover.component.html',
  styleUrls: ['./add-new-hazard-popover.component.scss'],
})
export class AddNewHazardPopoverComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  @Input() name: string;
  @Input() risk: string;
  @Input() controls: string[] = [null];
  public numOfControls: null[] = [null];
  @Input() action: string;

  public readonly E = "Eliminate";
  public readonly I = "Isolate";
  public readonly M = "Minimise";
  public readonly ACTIONS = [this.E, this.I, this.M];

  constructor() { }

  ngOnInit() {
    if (this.controls[0]) {
      this.numOfControls = new Array(this.controls.length);
      this.numOfControls.fill(null);
    }
  }

  public hazardChange(event): void {
    this.name = event.detail.value;
  }

  public actionChange(event): void {
    this.action = event.detail.value;
  }

  public riskChange(event): void {
    this.risk = event.detail.value;
  }

  public controlsChange(event, index: number): void {
    this.controls[index] = event.detail.value;
  }

  public validControls(): boolean {
    let bool = true;
    this.controls.forEach((control) => {
      if (!control) {
        bool = false;
      }
    });
    return bool;
  }

  public newControl(): void {
    if (this.validControls()) {
      this.controls.push(null);
      this.numOfControls.push(null);
    }
  }

  public deleteControl(index: number): void {
    if (this.controls.length > 1) {
      this.controls.splice(index, 1);
      this.numOfControls.splice(index, 1);
    }
    else {
      this.controls = [null];
      this.numOfControls = [null];
    }
  }

  public confirm(): void {
    if (this.name && this.risk && this.validControls()) {
      this.popover.dismiss({ name: this.name, risk: this.risk, controls: this.controls, action: this.action });
    }
  }

  public cancel(): void {
    this.popover.dismiss();
  }

}
