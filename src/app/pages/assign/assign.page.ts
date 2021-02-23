import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, PickerController, Platform, PopoverController } from '@ionic/angular';
import { Transceiver } from '../../core/_models/transceiver';
import { Product } from '../../core/_models/product';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';
import { ProductService } from 'src/app/core/_services/product.service';
import { Vat } from 'src/app/core/_models/vat';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Sensor } from 'src/app/core/_models/sensor';
import { ToastService } from 'src/app/core/_services/toast.service';
import { SensorsComponent } from '../../shared/sensors/sensors.component';
import { ManualEntryComponent } from 'src/app/shared/manual-entry/manual-entry.component';
import { SelectButtonComponent } from 'src/app/shared/select-button/select-button.component';
import { MixpanelService } from 'src/app/core/_services/mixpanel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HealthAndSafetyModalComponent } from 'src/app/shared/health-and-safety-modal/health-and-safety-modal.component';
import { TempCheckComponent } from 'src/app/shared/temp-check/temp-check.component';
import { VatSerialNumberComponent } from 'src/app/shared/vat-serial-number/vat-serial-number.component';
import { PhotosModalComponent } from 'src/app/shared/photos-modal/photos-modal.component';
import { PhotoService } from 'src/app/core/_services/photo.service';
import { SimproService } from 'src/app/core/_services/simpro.service';
import { TempCheck } from 'src/app/core/_models/tempCheck';
import { HealthAndSafety } from 'src/app/core/_models/healthAndSafety';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.page.html',
  styleUrls: ['./assign.page.scss'],
})
export class AssignPage implements OnInit {
  @ViewChild(SensorsComponent) sensorsChild: SensorsComponent;
  @ViewChild('productSearch') productSearchChild: SelectButtonComponent;
  @ViewChild('transceiverSearch') transceiverSearchChild: SelectButtonComponent;
  @ViewChild(IonContent) ionContnent: IonContent;
  @ViewChild(IonContent, { read: ElementRef }) ionContnentRef: ElementRef;
  @ViewChild('top', { read: ElementRef }) topRef: ElementRef;
  @ViewChild('transceiverSearch', { read: ElementRef }) tranSearchRef: ElementRef;
  @ViewChild('bottom', { read: ElementRef }) bottomRef: ElementRef;


  public selectedProduct: Product = null;
  public selectedTransceivers: Transceiver[] = [null];
  public currentVatIndex: number = 0;
  public vat: Vat;
  public nVats: number;
  public qrSensors: Sensor[] = [];
  public lastUpdated: number;
  public backdrop: boolean = false;
  public healthAndSafetyData: HealthAndSafety;
  public vatSerialNumbers: string[] = [];
  public preTempChecks: TempCheck[] = [];
  public postTempChecks: TempCheck[] = [];

  public currentSelection: string = "FonterraVatII";
  public options = [
    { value: 'FonterraVatII', text: 'Fonterra Vat II' },
    { value: 'Butterfly', text: 'Butterfly' },
    { value: 'Longveld', text: 'Longveld' },
    { value: 'Spherical', text: 'Spherical' },
    { value: 'Crown', text: 'Crown' },
  ];
  public optionSizes = {
    FonterraVatII: [
      { value: '2000', text: '2000' },
      { value: '2300', text: '2300' },
      { value: '3400', text: '3400' },
      { value: '4100', text: '4100' },
      { value: '4500', text: '4500' },
      { value: '5700', text: '5700' },
      { value: '6800', text: '6800' },
      { value: '7800', text: '7800' },
      { value: '9100', text: '9100' },
      { value: '11000', text: '11000' },
      { value: '11500W', text: '11500W' },
      { value: '12000', text: '12000' },
      { value: '14000', text: '14000' },
      { value: '14000W', text: '14000W' },
      { value: '15000', text: '15000' },
      { value: '16000', text: '16000' },
      { value: '16000W', text: '16000W' },
      { value: '18000', text: '18000' },
      { value: '18000W', text: '18000W' },
      { value: '21500W', text: '21500W' },
      { value: '24500W', text: '24500W' },
      { value: '26500W', text: '26500W' },
      { value: '30000W', text: '30000W' }],
    Butterfly: [
      { value: '1050', text: '1050' },
      { value: '1700', text: '1700' },
      { value: '2250', text: '2250' },
      { value: '2700', text: '2700' },
      { value: '2700Cummings', text: '2700 Cummings' },
      { value: '3400', text: '3400' },
      { value: '3400Winiata', text: '3400 Winiata' },
      { value: '3400KMOrganics', text: '3400 KM Organics' },
      { value: '3700', text: '3700' },
      { value: '3700DargavilleOrganics', text: '3700 Dargaville Organics' },
      { value: '4100', text: '4100' },
      { value: '4500', text: '4500' },
      { value: '4500TawaRidge', text: '4500 Tawa Ridge' },
      { value: '5700', text: '5700' },
      { value: '6800', text: '6800' },
      { value: '9100', text: '9100' }],
    Longveld: [
      { value: '5400', text: '5400' },
      { value: '7500', text: '7500' },
      { value: '9400', text: '9400' },
      { value: '11400', text: '11400' },
      { value: '21000', text: '21000' },
      { value: '29000', text: '29000' },
    ],
    Spherical: [
      { value: '10000', text: '10000' },
      { value: '14000', text: '14000' },
      { value: '24500', text: '24500' },
      { value: '31000', text: '31000' },
    ],
    Crown: [
      { value: '22000', text: '22000' },
    ],
  };

  constructor(
    public transceiverService: TransceiverService,
    public productService: ProductService,
    public toastService: ToastService,
    public pickerController: PickerController,
    public popoverController: PopoverController,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private mixpanelService: MixpanelService,
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private simproService: SimproService
  ) {
    this.route.queryParams.subscribe((params) => {
      const state = this.router.getCurrentNavigation().extras.state;
      if (state?.product) {
        this.productSelected(state.product);
      }
    });
  }

  ngOnInit() {
    this.lastUpdated = Date.now();
    this.mixpanelService.trackEvent("Opened milk install page");
  }

  public setVats(): void {
    if (this.selectedProduct && this.selectedProduct.vats && this.selectedProduct.vats.length) {
      this.vat = this.selectedProduct.vats[this.currentVatIndex];
      this.nVats = this.selectedProduct.vats.length;
    }
    else {
      this.vat = null;
      this.nVats = 0;
    }
    if (this.selectedProduct.vats?.length && !this.preTempChecks[this.currentVatIndex] && this.healthAndSafetyData) {
      this.openTempCheck('Pre');
    }
  }

  public productSelected(product: Product): void {
    this.mixpanelService.trackEvent("Selected product: " + product.supplierNumber);
    this.selectedProduct = product;
    this.photoService.clearPhotos();
    this.healthAndSafetyData = null;
    this.openHealthAndSafety();
    this.vatSerialNumbers = [];
    this.preTempChecks = [];
    this.postTempChecks = [];
    this.currentVatIndex = 0;
    this.setVats();
    if (this.selectedProduct.vats && this.selectedProduct.vats.length) {
      if (this.selectedProduct.vats.length < this.selectedTransceivers.length) {
        this.selectedTransceivers = [null];
      }
      this.selectedProduct.vats.forEach((vat, index) => {
        if (vat && vat.transceiverId !== null) {
          const transceiver = this.selectedProduct.transceivers.find(tran => tran.id === vat.transceiverId);
          this.selectedTransceivers[index] = transceiver;
          this.mixpanelService.trackEvent("Transceiver: " + transceiver.serialNumber + " already on Vat " + (index + 1));
        }
        else {
          this.mixpanelService.trackEvent("No transceiver already on Vat " + (index + 1));
          if (this.selectedTransceivers.length > 1) {
            this.selectedTransceivers[index] = null;
          }
        }
      });
    }
    else {
      this.selectedTransceivers = [null];
    }
  }

  public transceiverSelected(index: number, transceiver: Transceiver): void {
    this.mixpanelService.trackEvent("Selected Transceiver: " + transceiver.serialNumber + " on Vat " + (index + 1));
    const tran = this.selectedTransceivers.find(tran => tran?.id === transceiver.id);
    if (tran) {
      this.selectedTransceivers[index] = tran;
    }
    else {
      this.selectedTransceivers[index] = transceiver;
    }
  }

  public goForward(): void {
    const nextIndex = this.currentVatIndex + 1 > this.nVats - 1 ? 0 : this.currentVatIndex + 1;
    this.currentVatIndex = nextIndex;
    this.mixpanelService.trackEvent("Viewed Vat " + (this.currentVatIndex + 1));
    this.setVats();
  }

  public goBack(): void {
    const nextIndex = this.currentVatIndex - 1 < 0 ? this.nVats - 1 : this.currentVatIndex - 1;
    this.currentVatIndex = nextIndex;
    this.mixpanelService.trackEvent("Viewed Vat " + (this.currentVatIndex + 1));
    this.setVats();
  }

  public vatTypeSelected(event): void {
    this.vat.formula = event.detail.value;
    this.mixpanelService.trackEvent("Selected Vat " + (this.currentVatIndex + 1) + " type: " + event.detail.value);
    // this.vat.sizeString = null; wipes size when changing vat
  }

  public vatSizeSelected(event): void {
    this.vat.sizeString = event.detail.value;
    this.mixpanelService.trackEvent("Selected Vat " + (this.currentVatIndex + 1) + " size: " + event.detail.value);
  }

  public fabClicked(): void {
    if (!this.selectedProduct) {
      this.productSearchChild.openObjectSearch();
    }
    else if (!this.selectedTransceivers[this.currentVatIndex]) {
      this.transceiverSearchChild.openObjectSearch();
    }
    else {
      this.backdrop = !this.backdrop;
    }
  }

  public backdropClicked(fab: HTMLIonFabElement): void {
    this.backdrop = false;
    fab.close();
  }

  public scroll(event) {
    this.ionContnent.scrollByPoint(0, event, 10);
  }

  public validate(): boolean {
    let bool = true;
    let message: string;
    if (!this.selectedProduct) {
      bool = false;
      message = "Missing a product"
    }
    else if (!this.healthAndSafetyData) {
      bool = false;
      message = "Missing a health and safety"
    }
    else {
      this.selectedProduct.vats.forEach((vat) => {
        if (!vat.formula) {
          bool = false;
          message = "Missing vat type";
        }
        else if (!vat.sizeString) {
          bool = false;
          message = "Missing vat size";
        }
      });
      if (this.selectedProduct.vats.length !== this.vatSerialNumbers.length) {
        bool = false;
        message = "Missing vat serial number";
      }
      else if (this.selectedProduct.vats.length !== this.preTempChecks.length) {
        bool = false;
        message = "Missing vat pre temp";
      }
      else if (this.selectedProduct.vats.length !== this.postTempChecks.length) {
        bool = false;
        message = "Missing vat post temp";
      }
      else {
        this.selectedTransceivers.forEach((tran) => {
          if (!tran) {
            bool = false;
            message = "Missing transceiver";
          }
        });
        if (this.qrSensors.length) {
          bool = false;
          message = "Unmerged sensors";
        }
        else if (!this.photoService.validatePhotos()) {
          bool = false;
          message = "Missing photos";
        }
      }
    }
    if (message) {
      this.toastService.errorToast(message);
    }
    return bool;
  }

  public createVatSensors(): any {
    let vatSensors = [];
    this.selectedProduct.vats.forEach((vat, index) => {
      if (this.selectedTransceivers[index]) {
        this.selectedTransceivers[index].sensors.forEach((sensor) => {
          if (!sensor.type || sensor.vatId === vat.id) {
            vatSensors.push({ sensorId: sensor.id, sensorType: sensor.type, vatId: sensor.vatId, transceiverId: this.selectedTransceivers[index].id });
          }
        });
      }
    });
    return vatSensors;
  }

  public submit(): void {
    if (this.validate()) {
      this.mixpanelService.trackEvent("Submitted assigned sensors on Product: " + this.selectedProduct.supplierNumber);
      const transceiverIds = [...new Set(this.selectedTransceivers.map((tran) => {
        if (tran) {
          return tran.id
        }
      }))];
      const product = {
        transceivers: transceiverIds.map((tranId) => ({ id: tranId })),
        vatSensors: this.createVatSensors(),
        vats: this.selectedProduct.vats.map((vat, index) => ({ vatId: vat.id, vatType: vat.formula, vatSize: vat.sizeString, transceiverId: this.selectedTransceivers[index]?.id }))
      };
      this.productService.assignSensorsToProduct(this.selectedProduct.id, product).subscribe((product) => {
        if (product?.data) {
          this.simproService.submitNote(this.selectedProduct.job, this.healthAndSafetyData, this.selectedProduct.vats, this.preTempChecks, this.postTempChecks, this.vatSerialNumbers).subscribe((data) => {
            if (data?.data) {
              if (this.photoService.getNoPhotos()) {
                this.toastService.successToast("Sensors have been assigned");
                this.router.navigate(['/home']);
              }
              else {
                this.photoService.submitPhotos();
                this.toastService.createToast("Uploading...");
                setTimeout(() => {
                  this.toastService.successToast("Sensors have been assigned");
                  this.router.navigate(['/home']);
                }, 5000);
              }
            }
          });
        }
      });
    }
  }

  public mergeSensors(): void {
    if (this.qrSensors.length) {
      var sensorsToRemove = [];
      for (let qrSensor of this.qrSensors) {
        this.selectedTransceivers.forEach((tran, index) => {
          let actualSensorIndex = tran.sensors.findIndex(i => i.serialNumber.startsWith(qrSensor.serialNumber));
          if (actualSensorIndex !== -1) {
            if (sensorsToRemove.indexOf(qrSensor) === -1) {
              this.sensorsChild.sensorAssigned(tran.sensors[actualSensorIndex], qrSensor.type, index, qrSensor.vatId, false);
              sensorsToRemove.push(qrSensor);
            }
          }
        });
      }
      if (sensorsToRemove.length) {
        this.mixpanelService.trackEvent("Merged " + sensorsToRemove.length + " scanned sensors");
        for (let sensor of sensorsToRemove) {
          this.qrSensors.splice(this.qrSensors.indexOf(sensor), 1);
        }
        this.toastService.successToast("Sensors merged");
      }
      else {
        this.toastService.errorToast("Cannot merge sensors");
      }
    }
    else {
      this.toastService.createToast("Nothing to merge");
    }
  }

  public addScannedSensor(serialNumber: string): void {
    if (this.qrSensors.find(i => i.serialNumber.startsWith(serialNumber))) {
      this.toastService.createToast("" + serialNumber + " has already been scanned");
    }
    else if (this.selectedTransceivers[this.currentVatIndex]?.sensors.find(i => i.serialNumber.startsWith(serialNumber))) {
      this.toastService.createToast("" + serialNumber + " is already on the transceiver");
    }
    else {
      this.mixpanelService.trackEvent("Added sensor: " + serialNumber + " onto Transceiver: " + this.selectedTransceivers[this.currentVatIndex].serialNumber + " on Vat: " + (this.currentVatIndex + 1));
      let sensor = { serialNumber: serialNumber, type: null, vatId: null };
      this.qrSensors.push(sensor);
      this.sensorsChild.showSensorSelect(sensor);
    }
  }

  public async openHealthAndSafety(): Promise<void> {
    let props: any = { productName: this.selectedProduct.name };
    if (this.healthAndSafetyData) {
      props = {
        ...props, timeStarted: this.healthAndSafetyData.timeStarted,
        signature: this.healthAndSafetyData.signature,
        hazards: this.healthAndSafetyData.hazards,
        customHazards: this.healthAndSafetyData.customHazards
      };
    }
    const modal = await this.modalController.create({
      component: HealthAndSafetyModalComponent,
      componentProps: {
        ...props
      },
      mode: 'md'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.healthAndSafetyData = data.data;
        if (this.selectedProduct.vats?.length && !this.preTempChecks[this.currentVatIndex]) {
          this.openTempCheck('Pre');
        }
      }
      else {
        if (!this.healthAndSafetyData) {
          this.router.navigate(['/home']);
        }
      }
    });
    return await modal.present();
  }

  public async openVatSerial(): Promise<void> {
    const popover = await this.popoverController.create({
      component: VatSerialNumberComponent,
      componentProps: {
        vatIndex: this.currentVatIndex,
        serialNumber: this.vatSerialNumbers[this.currentVatIndex]
      },
      mode: 'md'
    });

    popover.onDidDismiss()
      .then((data) => {
        if (data.data) {
          this.vatSerialNumbers[this.currentVatIndex] = data.data;
        }
      });
    return await popover.present();
  }

  public async openTempCheck(type: string): Promise<void> {
    const popover = await this.popoverController.create({
      component: TempCheckComponent,
      componentProps: {
        allowCancel: type === 'Pre' && !this.preTempChecks[this.currentVatIndex] ? false : true,
        type,
        vatIndex: this.currentVatIndex,
        temperature: type === 'Pre' ? this.preTempChecks[this.currentVatIndex]?.temperature : this.postTempChecks[this.currentVatIndex]?.temperature,
        empty: type === 'Pre' ? this.preTempChecks[this.currentVatIndex]?.empty : this.postTempChecks[this.currentVatIndex]?.empty
      },
      mode: 'md',
      backdropDismiss: type === 'Pre' && !this.preTempChecks[this.currentVatIndex] ? false : true
    });

    popover.onDidDismiss()
      .then((data) => {
        if (data.data) {
          if (type === 'Pre') {
            this.preTempChecks[this.currentVatIndex] = { ...data.data, time: Date.now() };
          }
          else if (type === 'Post') {
            this.postTempChecks[this.currentVatIndex] = { ...data.data, time: Date.now() };
          }
        }
      });
    return await popover.present();
  }

  public async openManual(): Promise<void> {
    const popover = await this.popoverController.create({
      component: ManualEntryComponent,
      componentProps: {
      },
      mode: 'md'
    });

    popover.onDidDismiss()
      .then((data) => {
        if (data.data) {
          this.mixpanelService.trackEvent("Manually added sensor");
          this.addScannedSensor(data.data);
        }
      });
    return await popover.present();
  }

  public openBar(): void {
    if (this.platform.is('cordova')) {
      this.barcodeScanner.scan().then(barcodeData => {
        if (barcodeData.text) {
          this.mixpanelService.trackEvent("Scanned sensor with qr code");
          this.addScannedSensor(barcodeData.text);
        }
        else {
          this.toastService.createToast("You scanned nothing");
        }
      }).catch(err => {
        console.log('Error', err);
      });
    }
  }

  public async openPhotos(): Promise<void> {
    const modal = await this.modalController.create({
      component: PhotosModalComponent,
      componentProps: {
        product: this.selectedProduct,
        transceivers: this.selectedTransceivers
      },
      mode: 'md'
    });

    modal.onDidDismiss().then((data) => {

    })
    return await modal.present();
  }

  public doRefresh(event): void {
    this.mixpanelService.trackEvent("Refreshed Transceivers");
    [...new Set(this.selectedTransceivers.map((tran) => tran?.id))].forEach((tranId) => {
      if (tranId) {
        this.transceiverService.getTransceiver(tranId).subscribe((newTran) => {
          this.selectedTransceivers.forEach((oldTran, index) => {
            if (oldTran?.id === newTran.id) {
              this.selectedTransceivers[index] = newTran;
            }
          });
        });
      }
    });
    setTimeout(() => {
      this.lastUpdated = Date.now();
      event?.target.complete();
    }, 1000);
  }
















  //multi picker stuff
  public async openVatOptions() {
    const picker = await this.pickerController.create({
      animated: false,
      columns: this.generateColumns(this.vat.formula, 0),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    picker.addEventListener('ionPickerColChange', async (event: any) => {
      //console.log("event", event);

      if (event.detail.name === "Vat Type") {
        console.log("index", event.detail.selectedIndex, ", selection ", this.options[event.detail.selectedIndex].text);
        //picker.columns = [{ name: "Vat Type", options: this.options }, { name: "Vat Size", options: this.optionSizes[this.options[event.detail.selectedIndex].value] }]
        //picker.columns[1] = { name: "Vat Size", options: this.optionSizes[this.options[event.detail.selectedIndex].value] };
        console.log("cols", picker.columns);
        picker.columns = this.generateColumns(this.options[event.detail.selectedIndex].value, event.detail.selectedIndex);
        console.log("cols", picker.columns);
      }
    });

    picker.present();
  }

  public generateColumns(currentSelection: string, index: number) {
    const options = [];
    for (var i in this.optionSizes) {
      for (var option of this.optionSizes[i]) {
        options.push({ value: option.value, text: option.text, disabled: currentSelection !== i });
      }
    }
    return [{ name: "Vat Type", options: this.options, selectedIndex: index }, { name: "Vat Size", options: options }];
  }

}
