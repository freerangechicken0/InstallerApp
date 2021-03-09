import { OnInit, ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, EventEmitter, Output } from '@angular/core';
import { Gesture, GestureController, GestureDetail, Platform, PopoverController } from '@ionic/angular';
import { Vat } from 'src/app/core/_models/vat';
import { ToastService } from 'src/app/core/_services/toast.service';
import { SensorSelectComponent } from '../sensor-select/sensor-select.component';
import { Sensor } from '../../core/_models/sensor';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
})
export class SensorsComponent implements OnInit {
  @Input() sensors: Sensor[];
  @Input() transceiverSerialNumber: string;
  @Input() vat: Vat;
  @Input() currentVatIndex: number;
  @Input() qrSensors: Sensor[];
  @Output() emitScroll: EventEmitter<number> = new EventEmitter();
  @Input() upperScrollLimit: number;
  @Input() lowerScrollLimit: number;
  public yScroll: number = 0;
  @Input() top: ElementRef;
  @Input() tranSearch: ElementRef;
  @Input() bottom: ElementRef;

  public gestureArray: Gesture[] = [];

  @ViewChild('lidarDropzone', { read: ElementRef }) lidarDropzone: ElementRef;
  public lidarSensors: { sensor: Sensor, scanned: boolean }[] = [];
  @ViewChild('stirrerDropzone', { read: ElementRef }) stirrerDropzone: ElementRef;
  public stirrerSensors: { sensor: Sensor, scanned: boolean }[] = [];
  @ViewChild('vatTempDropzone', { read: ElementRef }) vatTempDropzone: ElementRef;
  public vatTempSensors: { sensor: Sensor, scanned: boolean }[] = [];
  @ViewChild('inletTempDropzone', { read: ElementRef }) inletTempDropzone: ElementRef;
  public inletTempSensors: { sensor: Sensor, scanned: boolean }[] = [];

  @ViewChildren('aSensor', { read: ElementRef }) items: QueryList<ElementRef>;
  @ViewChildren('aScannedSensor', { read: ElementRef }) scannedItems: QueryList<ElementRef>;

  constructor(
    private popoverController: PopoverController,
    private toastService: ToastService,
    private gestureController: GestureController,
    private changeDirectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.findSensors();
  }

  ngOnChanges() {
    this.findSensors();
  }

  public findSensors() {
    this.lidarSensors = [];
    this.stirrerSensors = [];
    this.vatTempSensors = [];
    this.inletTempSensors = [];
    if (this.vat) {
      this.sensors.forEach((sensor) => {
        if (sensor.vatId === this.vat.id) {
          switch (sensor.type) {
            case "lidarDistance": {
              if (!this.lidarSensors[this.currentVatIndex]) {
                this.lidarSensors[this.currentVatIndex] = { sensor, scanned: false };
              }
              break;
            }
            case "stirrer": {
              if (!this.stirrerSensors[this.currentVatIndex]) {
                this.stirrerSensors[this.currentVatIndex] = { sensor, scanned: false };
              }
              break;
            }
            case "vatTemp": {
              if (!this.vatTempSensors[this.currentVatIndex]) {
                this.vatTempSensors[this.currentVatIndex] = { sensor, scanned: false };
              }
              break;
            }
            case "inletTemp": {
              if (!this.inletTempSensors[this.currentVatIndex]) {
                this.inletTempSensors[this.currentVatIndex] = { sensor, scanned: false };
              }
              break;
            }
          }
        }
      });
      this.qrSensors.forEach((sensor) => {
        if (sensor.vatId === this.vat.id) {
          switch (sensor.type) {
            case "lidarDistance": {
              if (!this.lidarSensors[this.currentVatIndex]) {
                this.lidarSensors[this.currentVatIndex] = { sensor, scanned: true };
              }
              break;
            }
            case "stirrer": {
              if (!this.stirrerSensors[this.currentVatIndex]) {
                this.stirrerSensors[this.currentVatIndex] = { sensor, scanned: true };
              }
              break;
            }
            case "vatTemp": {
              if (!this.vatTempSensors[this.currentVatIndex]) {
                this.vatTempSensors[this.currentVatIndex] = { sensor, scanned: true };
              }
              break;
            }
            case "inletTemp": {
              if (!this.inletTempSensors[this.currentVatIndex]) {
                this.inletTempSensors[this.currentVatIndex] = { sensor, scanned: true };
              }
              break;
            }
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    this.updateGestures();
    this.items.changes.subscribe((res) => {
      this.updateGestures();
    });
    this.scannedItems.changes.subscribe((res) => {
      this.updateGestures();
    });
  }

  public updateGestures(): void {
    this.gestureArray.map((gesture) => (gesture.destroy()));
    this.gestureArray = [];
    this.createGestures(this.items, false);
    this.createGestures(this.scannedItems, true);
  }

  public createGestures(items: QueryList<ElementRef>, scanned: boolean): void {
    const arr = items.toArray();
    arr.forEach((item) => {
      const drag = this.gestureController.create({
        el: item.nativeElement,
        threshold: 25,
        gestureName: 'drag',
        onStart: ev => {
          item.nativeElement.style.transition = '';
          item.nativeElement.style.opacity = '0.8';
        },
        onMove: ev => {
          item.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY + this.yScroll}px)`;
          item.nativeElement.style.zIndex = 10;
          this.checkDropzoneHover(ev.currentX, ev.currentY);
          this.scroll(ev);
        },
        onEnd: ev => {
          this.yScroll = 0;
          this.handleDrop(item, ev.currentX, ev.currentY, scanned);
        }
      });
      drag.enable();
      this.gestureArray.push(drag);
    });
  }

  public checkDropzoneHover(x: number, y: number): void {
    const lidarDrop = this.lidarDropzone.nativeElement.getBoundingClientRect();
    const stirrerDrop = this.stirrerDropzone.nativeElement.getBoundingClientRect();
    const vatTempDrop = this.vatTempDropzone.nativeElement.getBoundingClientRect();
    const inletTempDrop = this.inletTempDropzone.nativeElement.getBoundingClientRect();
    if (this.isInZone(x, y, lidarDrop)) {
      this.lidarDropzone.nativeElement.children[0].classList.add("hover");
      this.lidarDropzone.nativeElement.children[0].zIndex = "9";
    }
    else {
      this.lidarDropzone.nativeElement.children[0].classList.remove("hover");
      this.lidarDropzone.nativeElement.children[0].zIndex = "inherit";
    }
    if (this.isInZone(x, y, stirrerDrop)) {
      this.stirrerDropzone.nativeElement.children[0].classList.add("hover");
      this.stirrerDropzone.nativeElement.children[0].zIndex = "9";
    }
    else {
      this.stirrerDropzone.nativeElement.children[0].classList.remove("hover");
      this.stirrerDropzone.nativeElement.children[0].zIndex = "inherit";
    }
    if (this.isInZone(x, y, vatTempDrop)) {
      this.vatTempDropzone.nativeElement.children[0].classList.add("hover");
      this.vatTempDropzone.nativeElement.children[0].zIndex = "9";
    }
    else {
      this.vatTempDropzone.nativeElement.children[0].classList.remove("hover");
      this.vatTempDropzone.nativeElement.children[0].zIndex = "inherit";
    }
    if (this.isInZone(x, y, inletTempDrop)) {
      this.inletTempDropzone.nativeElement.children[0].classList.add("hover");
      this.inletTempDropzone.nativeElement.children[0].zIndex = "9";
    }
    else {
      this.inletTempDropzone.nativeElement.children[0].classList.remove("hover");
      this.inletTempDropzone.nativeElement.children[0].zIndex = "inherit";
    }
  }

  public isInZone(x: number, y: number, dropzone: any): boolean {
    if (x < dropzone.left || x >= dropzone.right) {
      return false;
    }
    if (y < dropzone.top || y >= dropzone.bottom) {
      return false;
    }
    return true;
  }

  public handleDrop(item: ElementRef<any>, x: number, y: number, scanned: boolean): void {
    if (!this.vat) {
      this.toastService.errorToast("Cannot assign sensor with no Product");
      item.nativeElement.style.transition = '.2s ease-out';
      item.nativeElement.style.zIndex = 'inherit';
      item.nativeElement.style.transform = 'translate(0, 0)';
      item.nativeElement.style.opacity = '1';
    }
    else {
      const lidarDrop = this.lidarDropzone.nativeElement.getBoundingClientRect();
      const stirrerDrop = this.stirrerDropzone.nativeElement.getBoundingClientRect();
      const vatTempDrop = this.vatTempDropzone.nativeElement.getBoundingClientRect();
      const inletTempDrop = this.inletTempDropzone.nativeElement.getBoundingClientRect();
      if (this.isInZone(x, y, lidarDrop)) {
        const sensor = scanned ? this.qrSensors[item.nativeElement.id] : this.sensors[item.nativeElement.id];
        this.sensorAssigned(sensor, "lidarDistance", this.currentVatIndex, this.vat.id, scanned);
        item.nativeElement.remove();
      }
      else if (this.isInZone(x, y, stirrerDrop)) {
        const sensor = scanned ? this.qrSensors[item.nativeElement.id] : this.sensors[item.nativeElement.id];
        this.sensorAssigned(sensor, "stirrer", this.currentVatIndex, this.vat.id, scanned);
        item.nativeElement.remove();
      }
      else if (this.isInZone(x, y, vatTempDrop)) {
        const sensor = scanned ? this.qrSensors[item.nativeElement.id] : this.sensors[item.nativeElement.id];
        this.sensorAssigned(sensor, "vatTemp", this.currentVatIndex, this.vat.id, scanned);
        item.nativeElement.remove();
      }
      else if (this.isInZone(x, y, inletTempDrop)) {
        const sensor = scanned ? this.qrSensors[item.nativeElement.id] : this.sensors[item.nativeElement.id];
        this.sensorAssigned(sensor, "inletTemp", this.currentVatIndex, this.vat.id, scanned);
        item.nativeElement.remove();
      }
      else {
        item.nativeElement.style.transition = '.2s ease-out';
        item.nativeElement.style.zIndex = 'inherit';
        item.nativeElement.style.transform = 'translate(0, 0)';
        item.nativeElement.style.opacity = '1';
      }
    }
    this.lidarDropzone.nativeElement.children[0].classList.remove("hover");
    this.lidarDropzone.nativeElement.children[0].zIndex = "inherit";
    this.stirrerDropzone.nativeElement.children[0].classList.remove("hover");
    this.stirrerDropzone.nativeElement.children[0].zIndex = "inherit";
    this.vatTempDropzone.nativeElement.children[0].classList.remove("hover");
    this.vatTempDropzone.nativeElement.children[0].zIndex = "inherit";
    this.inletTempDropzone.nativeElement.children[0].classList.remove("hover");
    this.inletTempDropzone.nativeElement.children[0].zIndex = "inherit";
    this.changeDirectorRef.detectChanges();
    this.updateGestures();
  }

  public scroll(ev: GestureDetail) {
    if (ev.currentY < this.lowerScrollLimit + 70) {
      if (this.top) {
        if (this.top.nativeElement.getBoundingClientRect().top < this.lowerScrollLimit) {
          this.emitScroll.emit(-10);
          this.yScroll -= 10;
        }
      }
      else {
        if (this.tranSearch.nativeElement.getBoundingClientRect().top < this.lowerScrollLimit) {
          this.emitScroll.emit(-10);
          this.yScroll -= 10;
        }
      }
    }
    else if (this.bottom.nativeElement.getBoundingClientRect().bottom > this.platform.height() && ev.currentY > this.upperScrollLimit - 70) {
      this.emitScroll.emit(10);
      this.yScroll += 10;
    }
  }

  public async showSensorSelect(sen: Sensor) {
    if (!this.vat) {
      this.toastService.errorToast("Cannot assign sensor with no Product");
    }
    else {
      const popover = await this.popoverController.create({
        component: SensorSelectComponent,
        componentProps: {
          transceiverSerialNumber: this.transceiverSerialNumber,
          sensorSerialNumber: sen.serialNumber,
          assignment: sen.type,
          sensorOptions: [["Lidar Sensor", "lidarDistance"], ["Stirrer Sensor", "stirrer"], ["Vat Temperature", "vatTemp"], ["Inlet Temperature", "inletTemp"], ["Unassigned", null]]
        },
        mode: 'md'
      });

      popover.onDidDismiss()
        .then((data) => {
          if (data.data !== undefined) {
            if (sen.type) {
              this.removeSensor(sen.type);
            }
            this.sensorAssigned(sen, data.data, this.currentVatIndex, this.vat.id, sen.createdAt ? false : true);
          }
        });
      return await popover.present();
    }
  }

  public sensorAssigned(sensor: Sensor, type: string, vatIndex: number, vatId: number, scanned: boolean) {
    sensor.type = type;
    sensor.vatId = type ? vatId : null;
    switch (type) {
      case "lidarDistance": {
        if (this.lidarSensors[vatIndex]) {
          this.lidarSensors[vatIndex].sensor.type = null;
          this.lidarSensors[vatIndex].sensor.vatId = null;
        }
        this.lidarSensors[vatIndex] = { sensor, scanned };
        break;
      }
      case "stirrer": {
        if (this.stirrerSensors[vatIndex]) {
          this.stirrerSensors[vatIndex].sensor.type = null;
          this.stirrerSensors[vatIndex].sensor.vatId = null;
        }
        this.stirrerSensors[vatIndex] = { sensor, scanned };
        break;
      }
      case "vatTemp": {
        if (this.vatTempSensors[vatIndex]) {
          this.vatTempSensors[vatIndex].sensor.type = null;
          this.vatTempSensors[vatIndex].sensor.vatId = null;
        }
        this.vatTempSensors[vatIndex] = { sensor, scanned };
        break;
      }
      case "inletTemp": {
        if (this.inletTempSensors[vatIndex]) {
          this.inletTempSensors[vatIndex].sensor.type = null;
          this.inletTempSensors[vatIndex].sensor.vatId = null;
        }
        this.inletTempSensors[vatIndex] = { sensor, scanned };
        break;
      }
    }
    this.changeDirectorRef.detectChanges();
  }

  public deleteQrSensor(serialNumber): void {
    this.qrSensors.splice(this.qrSensors.findIndex(sen => sen.serialNumber === serialNumber), 1);
  }

  public removeSensor(event): void {
    switch (event) {
      case "lidarDistance": {
        this.lidarSensors[this.currentVatIndex].sensor.type = null;
        this.lidarSensors[this.currentVatIndex].sensor.vatId = null;
        this.lidarSensors[this.currentVatIndex] = null;
        break;
      }
      case "stirrer": {
        this.stirrerSensors[this.currentVatIndex].sensor.type = null;
        this.stirrerSensors[this.currentVatIndex].sensor.vatId = null;
        this.stirrerSensors[this.currentVatIndex] = null;
        break;
      }
      case "vatTemp": {
        this.vatTempSensors[this.currentVatIndex].sensor.type = null;
        this.vatTempSensors[this.currentVatIndex].sensor.vatId = null;
        this.vatTempSensors[this.currentVatIndex] = null;
        break;
      }
      case "inletTemp": {
        this.inletTempSensors[this.currentVatIndex].sensor.type = null;
        this.inletTempSensors[this.currentVatIndex].sensor.vatId = null;
        this.inletTempSensors[this.currentVatIndex] = null;
        break;
      }
    }
    this.changeDirectorRef.detectChanges();
  }
}
