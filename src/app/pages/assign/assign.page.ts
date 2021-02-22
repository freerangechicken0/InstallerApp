import { Component, OnInit, ViewChild } from '@angular/core';
import { PickerController, PopoverController } from '@ionic/angular';
import { Transceiver } from '../../core/_models/transceiver';
import { Product } from '../../core/_models/product';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';
import { ProductService } from 'src/app/core/_services/product.service';
import { Vat } from 'src/app/core/_models/vat';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Sensor } from 'src/app/core/_models/sensor';
import { ToastService } from 'src/app/core/_services/toast.service';
import { SensorsComponent } from './sensors/sensors.component';
import { ManualEntryComponent } from 'src/app/shared/manual-entry/manual-entry.component';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.page.html',
  styleUrls: ['./assign.page.scss'],
})
export class AssignPage implements OnInit {
  @ViewChild(SensorsComponent) sensorsChild: SensorsComponent;

  public products: Product[] = null;
  public selectedProduct: Product = null;
  public transceivers: Transceiver[] = null;
  public selectedTransceiver: Transceiver = null;
  public currentVatIndex: number = 0;
  public vat: Vat;
  public nVats: number;
  public qrSensors: Sensor[] = [];
  public lastUpdated: Date;

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
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getTransceivers();
    this.setVats();
    this.lastUpdated = new Date();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products.data;
      console.log("prods", this.products);
    });
  }

  getTransceivers() {
    this.transceiverService.getAllTransceivers().subscribe(transceivers => {
      this.transceivers = transceivers.data;
      console.log("trans", this.transceivers);
    });
  }

  setVats() {
    if (this.products === null || !this.selectedProduct.vats.length) {
      this.vat = null
      this.nVats = 0;
    }
    else {
      this.vat = this.selectedProduct.vats[this.currentVatIndex];
      this.nVats = this.selectedProduct.vats.length;
    }
  }

  productSelected(event) {
    this.selectedProduct = this.products.find(prod => prod.id === event.id);
    this.currentVatIndex = 0;
    this.setVats();
    if (this.vat && this.vat.transceiverId !== null && this.vat.transceiver) {
      this.selectedTransceiver = this.transceivers.find(tran => tran.id === this.vat.transceiverId);
    }
  }

  transceiverSelected(event) {
    this.selectedTransceiver = this.transceivers.find(tran => tran.id === event.id);
  }

  goForward() {
    const nextIndex = this.currentVatIndex + 1 > this.nVats - 1 ? 0 : this.currentVatIndex + 1;
    this.currentVatIndex = nextIndex;
    this.setVats();
  }

  goBack() {
    const nextIndex = this.currentVatIndex - 1 < 0 ? this.nVats - 1 : this.currentVatIndex - 1;
    this.currentVatIndex = nextIndex;
    this.setVats();
  }

  public vatTypeSelected(event) {
    this.vat.formula = event.detail.value;
    //this.vat.sizeString = null;
  }

  public vatSizeSelected(event) {
    this.vat.sizeString = event.detail.value;
  }

  submit() {
    const product = {
      transceivers: [{ id: this.selectedTransceiver.id }],
      vatSensors: this.selectedTransceiver.sensors.map((sensor) => ({ sensorId: sensor.id, sensorType: sensor.type, vatId: sensor.vatId, transceiverId: this.selectedTransceiver.id })),
      vats: this.selectedProduct.vats.map((vat) => ({ vatId: vat.id, vatType: vat.formula, vatSize: vat.sizeString, transceiverId: this.selectedTransceiver.id })) // transceiverId will need to change when supports multi transceivers
    };
    console.log(product);

    this.productService.assignSensorsToProduct(this.selectedProduct.id, product).subscribe(product => {
      this.toastService.createToast("Sensors have been assigned");
    });
  }

  public mergeSensors() {
    var sensorsToRemove = [];
    for (let qrSensor of this.qrSensors) {
      let actualSensorIndex = this.selectedTransceiver.sensors.findIndex(i => i.serialNumber.startsWith(qrSensor.serialNumber));
      if (actualSensorIndex !== -1) {
        this.selectedTransceiver.sensors[actualSensorIndex].type = qrSensor.type;
        this.selectedTransceiver.sensors[actualSensorIndex].vatId = qrSensor.vatId;
        sensorsToRemove.push(qrSensor);
      }
    }
    if (sensorsToRemove.length) {
      for (let sensor of sensorsToRemove) {
        this.qrSensors.splice(this.qrSensors.indexOf(sensor), 1);
      }
      this.toastService.createToast("Sensors merged");
    }
    else {
      this.toastService.createToast("Nothing to merge");
    }
  }

  public addScannedSensor(serialNumber: string) {
    if (this.qrSensors.find(i => i.serialNumber.startsWith(serialNumber))) {
      this.toastService.createToast("" + serialNumber + " has already been scanned");
    }
    else if (this.selectedTransceiver.sensors.find(i => i.serialNumber.startsWith(serialNumber))) {
      this.toastService.createToast("" + serialNumber + " is already on the transceiver");
    }
    else {
      let sensor = { serialNumber: serialNumber, type: null, vatId: null };
      this.qrSensors.push(sensor);
      this.sensorsChild.showSensorSelect(sensor);
    }
  }

  public async openManual() {
    const popover = await this.popoverController.create({
      component: ManualEntryComponent,
      componentProps: {
      },
      mode: 'md'
    });

    popover.onDidDismiss()
      .then((data) => {
        if (data.data !== undefined) {
          this.addScannedSensor(data.data);
        }
      });
    return await popover.present();
  }

  public openBar() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (barcodeData.text) {
        this.addScannedSensor(barcodeData.text);
      }
      else {
        this.toastService.createToast("You scanned nothing");
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  public doRefresh(event) {
    this.transceiverService.getAllTransceivers().subscribe(transceivers => {
      this.transceivers = transceivers.data;
      console.log("trans", this.transceivers);
      if (this.selectedTransceiver) {
        this.selectedTransceiver = this.transceivers.find(tran => tran.id === this.selectedTransceiver.id);
      }
      this.lastUpdated = new Date();
      event.target.complete();
    });
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
