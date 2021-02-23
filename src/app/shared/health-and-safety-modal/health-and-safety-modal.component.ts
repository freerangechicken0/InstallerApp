import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';
import { IonItemSliding, PopoverController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { ToastService } from 'src/app/core/_services/toast.service';
import { AddNewHazardPopoverComponent } from './add-new-hazard-popover/add-new-hazard-popover.component';
import { Hazard } from 'src/app/core/_models/hazard';

@Component({
  selector: 'app-health-and-safety-modal',
  templateUrl: './health-and-safety-modal.component.html',
  styleUrls: ['./health-and-safety-modal.component.scss'],
})
export class HealthAndSafetyModalComponent implements OnInit {
  @Input() modal: Components.IonModal;
  @Input() productName: string;
  public signaturePad: SignaturePad;
  @Input() timeStarted: number;
  @Input() signature: string;

  public readonly E = "Eliminate";
  public readonly I = "Isolate";
  public readonly M = "Minimise";
  @Input() hazards: Hazard[] = [
    {
      name: "Fall from height",
      risk: "Serious injury or death",
      controls: [
        "Fall restraint"
      ],
      action: this.M,
      identified: null,
      open: true
    },
    {
      name: "Pendulum Effect",
      risk: "Impact injuries, bruising and sprains. Possibly broken bones or knocked out",
      controls: [
        "Attach as close to work area as possible",
        "Helmet to be worn by workers"
      ],
      action: this.M,
      identified: null,
      open: true
    },
    {
      name: "Dropping items/tools",
      risk: "Head injury, impact injuries or death",
      controls: [
        "Isolate the work area with positioning of work vehicle and cone area off when required"
      ],
      action: this.M,
      identified: null,
      open: true
    },
    {
      name: "Adverse weather",
      risk: "Falls from height (see hazard 1), Pendulum effect (see hazard 2), and Falling/dropping items (see hazard 3)",
      controls: [
        "Postpone work when weather is deemed too dangerous"
      ],
      action: this.E,
      identified: null,
      open: true
    },
    {
      name: "Overhead Powerlines or Telephone Wires",
      risk: "Electrocution",
      controls: [
        "Assess the area prior to commencing work",
        "Do not throw ropes over if lines are above",
        "Place equipment in safest area possible"
      ],
      action: this.M,
      identified: null,
      open: true
    },
    {
      name: "Stirrer Motor on Milk Vat",
      risk: "Entanglement by equipment wrapping around moving parts when turned on during installation",
      controls: [
        "Turn off during installation process where possible",
        "Keep all equipment clear of moving parts"
      ],
      action: this.M,
      identified: null,
      open: true
    }
  ];
  @Input() customHazards: Hazard[] = [];

  constructor(
    private toastService: ToastService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.timeStarted = Date.now();
    this.setUpSignaturePad();
  }

  public no(slidingItem: IonItemSliding, hazard: Hazard): void {
    hazard.identified = "no";
    hazard.open = false;
    slidingItem.close();
  }

  public yes(slidingItem: IonItemSliding, hazard: Hazard): void {
    hazard.identified = "yes";
    hazard.open = false;
    slidingItem.close();
  }

  public toggle(hazard: Hazard): void {
    hazard.open = !hazard.open;
  }

  public async addNewHazard(): Promise<void> {
    const popover = await this.popoverController.create({
      component: AddNewHazardPopoverComponent,
      mode: 'md'
    });

    popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.customHazards.push({ ...data.data, identified: null, open: true });
      }
    });
    return await popover.present();
  }

  public deleteHazard(event, hazard: Hazard): void {
    event.stopPropagation();
    this.customHazards.splice(this.customHazards.indexOf(hazard), 1);
  }

  public async editHazard(event, hazard: Hazard): Promise<void> {
    event.stopPropagation();

    let hazardCopy = JSON.parse(JSON.stringify(hazard));

    const popover = await this.popoverController.create({
      component: AddNewHazardPopoverComponent,
      componentProps: {
        name: hazardCopy.name,
        risk: hazardCopy.risk,
        controls: hazardCopy.controls,
        action: hazardCopy.action
      },
      mode: 'md'
    });

    popover.onDidDismiss().then((data) => {
      if (data.data) {
        hazard = { ...data.data, identified: null, open: true };
      }
    });
    return await popover.present();
  }

  public validate(): boolean {
    let bool = true;
    this.hazards.forEach((hazard) => {
      if (!hazard.identified) {
        bool = false;
      }
    });
    this.customHazards.forEach((hazard) => {
      if (!hazard.identified) {
        bool = false;
      }
    });
    return bool;
  }

  public setUpSignaturePad(): void {
    var canvas = document.querySelector("canvas");
    this.signaturePad = new SignaturePad(canvas, {
      throttle: 4
    });
    if (this.signature) {
      this.signaturePad.fromDataURL(this.signature, { width: 1000, height: 200 });
    }
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  public save(): void {
    this.signature = this.signaturePad.toDataURL('image/png');
  }

  public confirm(): void {
    if (!this.validate()) {
      this.toastService.errorToast("You must identify all hazards");
    }
    else if (this.signaturePad.isEmpty()) {
      this.toastService.errorToast("You must sign your name");
    }
    else {
      this.save();
      this.modal.dismiss({ timeStarted: this.timeStarted, hazards: this.hazards, customHazards: this.customHazards, signature: this.signature });
    }
  }

  public onClose(): void {
    this.modal.dismiss();
  }

}
