import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { DateFnsModule } from 'ngx-date-fns';
import { of } from 'rxjs';
import { ToastService } from 'src/app/core/_services/toast.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';
import { ManualEntryComponent } from 'src/app/shared/manual-entry/manual-entry.component';
import { SelectButtonComponent } from 'src/app/shared/select-button/select-button.component';

import { AssignPage } from './assign.page';
import { SensorsComponent } from '../../shared/sensors/sensors.component';

describe('AssignPage', () => {
  let component: AssignPage;
  let fixture: ComponentFixture<AssignPage>;
  let popoverController;
  let popover;
  let barcodeScanner;
  let transceiverService;
  let modalController;
  let toastService;
  let platform;

  beforeEach(async(() => {
    popoverController = jasmine.createSpyObj('PopoverController', ['create']);
    popover = jasmine.createSpyObj('Popover', ['present', 'onDidDismiss', 'dismiss']);
    popover.onDidDismiss.and.returnValue(Promise.resolve({}));
    popoverController.create.and.returnValue(popover);
    barcodeScanner = jasmine.createSpyObj('BarcodeScanner', ['scan']);
    transceiverService = jasmine.createSpyObj('TransceiverService', ['getTransceiver']);
    toastService = jasmine.createSpyObj('ToastService', ['createToast', 'successToast', 'errorToast']);
    modalController = jasmine.createSpyObj('ModalController', ['create']);
    platform = jasmine.createSpyObj('Platform', ['is']);
    TestBed.configureTestingModule({
      declarations: [AssignPage, SelectButtonComponent, SensorsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        DateFnsModule.forRoot()
      ],
      providers: [
        {
          provide: PopoverController,
          useValue: popoverController
        },
        {
          provide: BarcodeScanner,
          useValue: barcodeScanner
        },
        {
          provide: TransceiverService,
          useValue: transceiverService
        },
        {
          provide: ToastService,
          useValue: toastService
        },
        {
          provide: ModalController,
          useValue: modalController
        },
        {
          provide: Platform,
          useValue: platform
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setVats sets the vat when there is a product with 1 vat', () => {
    component.selectedProduct = { vats: [{ id: 123 }] };
    component.currentVatIndex = 0;
    component.setVats();
    expect(component.vat).toEqual({ id: 123 });
    expect(component.nVats).toEqual(1);
  });

  it('setVats sets the vats when there is a product with multiple vats', () => {
    component.selectedProduct = { vats: [{ id: 123 }, { id: 124 }] };
    component.currentVatIndex = 0;
    component.setVats();
    expect(component.vat).toEqual({ id: 123 });
    expect(component.nVats).toEqual(2);
  });

  it('setVats sets vat things to null if there is no product', () => {
    component.selectedProduct = null;
    component.setVats();
    expect(component.vat).toEqual(null);
    expect(component.nVats).toEqual(0);
    expect(component.selectedTransceivers).toEqual([null]);
  });

  it('setVats sets vat things to null if there is no vats', () => {
    component.selectedProduct = {};
    component.setVats();
    expect(component.vat).toEqual(null);
    expect(component.nVats).toEqual(0);
  });

  it('setVats sets vat things to null if there is empty vats', () => {
    component.selectedProduct = { vats: [] };
    component.setVats();
    expect(component.vat).toEqual(null);
    expect(component.nVats).toEqual(0);
  });

  it('productSelected sets product', () => {
    component.productSelected({ id: 123 });
    expect(component.selectedProduct).toEqual({ id: 123 });
    expect(component.currentVatIndex).toEqual(0);
  });

  it('productSelected sets product and tranceivers on multiple vats', () => {
    const product = { id: 123, vats: [{ transceiverId: 456 }, { transceiverId: 789 }], transceivers: [{ id: 456 }, { id: 789 }] };
    component.productSelected(product);
    expect(component.selectedProduct).toEqual(product);
    expect(component.currentVatIndex).toEqual(0);
    expect(component.selectedTransceivers).toEqual([{ id: 456 }, { id: 789 }]);
  });

  it('productSelected sets product and transceivers when the vat has one and null if not', () => {
    const product = { id: 123, vats: [{ transceiverId: 456 }, { transceiverId: null }], transceivers: [{ id: 456 }, null] };
    component.productSelected(product);
    expect(component.selectedProduct).toEqual(product);
    expect(component.currentVatIndex).toEqual(0);
    expect(component.selectedTransceivers).toEqual([{ id: 456 }, null]);
  });

  it('productSelected sets product and transceivers when the vat has one and null if vat is null', () => {
    const product = { id: 123, vats: [{ transceiverId: 456 }, null], transceivers: [{ id: 456 }] };
    component.productSelected(product);
    expect(component.selectedProduct).toEqual(product);
    expect(component.currentVatIndex).toEqual(0);
    expect(component.selectedTransceivers).toEqual([{ id: 456 }, null]);
  });

  it('productSelected sets product and the same transceiver object when its on multiple vats', () => {
    const product = { id: 123, vats: [{ transceiverId: 456 }, { transceiverId: 456 }], transceivers: [{ id: 456 }] };
    component.productSelected(product);
    expect(component.selectedProduct).toEqual(product);
    expect(component.currentVatIndex).toEqual(0);
    expect(component.selectedTransceivers).toEqual([{ id: 456 }, { id: 456 }]);
    expect(component.selectedTransceivers[0]).toBe(component.selectedTransceivers[1]); //this one is very important
  });

  it('productSelected sets selected transceivers to just one null if there are no vats', () => {
    component.selectedTransceivers = [{ id: 456 }];
    const product = { id: 123, vats: [] };
    component.productSelected(product);
    expect(component.selectedProduct).toEqual(product);
    expect(component.currentVatIndex).toEqual(0);
    expect(component.selectedTransceivers).toEqual([null]);
  });

  it('transceiverSelected selects transceiver when theres one', () => {
    component.selectedTransceivers = [null];
    component.transceiverSelected(0, { id: 123 });
    expect(component.selectedTransceivers).toEqual([{ id: 123 }]);
  });

  it('transceiverSelected selects transceivers when theres multiple', () => {
    component.selectedTransceivers = [null];
    component.transceiverSelected(1, { id: 123 });
    expect(component.selectedTransceivers).toEqual([null, { id: 123 }]);
  });

  it('transceiverSelected selects existing object when the transceiver is already on a vat', () => {
    component.selectedTransceivers = [{ id: 123 }];
    component.transceiverSelected(1, { id: 123 });
    expect(component.selectedTransceivers).toEqual([{ id: 123 }, { id: 123 }]);
    expect(component.selectedTransceivers[0]).toBe(component.selectedTransceivers[1]); //very important
  });

  it('goForward goes to the next vat', () => {
    component.nVats = 3;
    component.currentVatIndex = 0;
    component.goForward();
    expect(component.currentVatIndex).toEqual(1);
  });

  it('goForward goes to the first vat if currently on the last', () => {
    component.nVats = 3;
    component.currentVatIndex = 2;
    component.goForward();
    expect(component.currentVatIndex).toEqual(0);
  });

  it('goForward sets the next vat', () => {
    component.nVats = 2;
    component.currentVatIndex = 0;
    component.selectedProduct = { id: 123, vats: [{ id: 456 }, { id: 789 }] };
    component.goForward();
    expect(component.currentVatIndex).toEqual(1);
    expect(component.vat).toEqual({ id: 789 });
  });

  it('goForward sets the first vat if currently on the last one', () => {
    component.nVats = 2;
    component.currentVatIndex = 1;
    component.selectedProduct = { id: 123, vats: [{ id: 456 }, { id: 789 }] };
    component.goForward();
    expect(component.currentVatIndex).toEqual(0);
    expect(component.vat).toEqual({ id: 456 });
  });

  it('goBack goes to the next vat', () => {
    component.nVats = 3;
    component.currentVatIndex = 2;
    component.goBack();
    expect(component.currentVatIndex).toEqual(1);
  });

  it('goBack goes to the first vat if currently on the last', () => {
    component.nVats = 3;
    component.currentVatIndex = 0;
    component.goBack();
    expect(component.currentVatIndex).toEqual(2);
  });

  it('goBack sets the next vat', () => {
    component.nVats = 2;
    component.currentVatIndex = 1;
    component.selectedProduct = { id: 123, vats: [{ id: 456 }, { id: 789 }] };
    component.goBack();
    expect(component.currentVatIndex).toEqual(0);
    expect(component.vat).toEqual({ id: 456 });
  });

  it('goBack sets the first vat if currently on the last one', () => {
    component.nVats = 2;
    component.currentVatIndex = 0;
    component.selectedProduct = { id: 123, vats: [{ id: 456 }, { id: 789 }] };
    component.goBack();
    expect(component.currentVatIndex).toEqual(1);
    expect(component.vat).toEqual({ id: 789 });
  });

  it('vatTypeSelected sets the vat type', () => {
    component.vat = { id: 456, formula: null };
    component.vatTypeSelected({ detail: { value: "somevalidvattype" } });
    expect(component.vat.formula).toEqual("somevalidvattype")
  });

  it('vatTypeSelected sets the vat type', () => {
    component.vat = { id: 456, sizeString: null };
    component.vatSizeSelected({ detail: { value: "somevalidvatsize" } });
    expect(component.vat.sizeString).toEqual("somevalidvatsize")
  });

  it('fabClicked opens product search when no product is selected', () => {
    spyOn(component.productSearchChild, 'openObjectSearch');
    component.selectedProduct = null;
    component.fabClicked();
    expect(component.productSearchChild.openObjectSearch).toHaveBeenCalled();
  });

  it('fabClicked opens product search when there is a product but no transceiver on the current vat', () => {
    spyOn(component.transceiverSearchChild, 'openObjectSearch');
    component.selectedProduct = { id: 123 };
    component.selectedTransceivers = [null];
    component.currentVatIndex = 0;
    component.fabClicked();
    expect(component.transceiverSearchChild.openObjectSearch).toHaveBeenCalled();
  });

  it('fabClicked sets backdrop when there is both a product and transceiver on the current vat', () => {
    component.selectedProduct = { id: 123 };
    component.selectedTransceivers = [{ id: 456 }];
    component.currentVatIndex = 0;
    component.backdrop = false;
    component.fabClicked();
    expect(component.backdrop).toEqual(true);
  });

  it('backdropClicked removes backdrop and closes fab', () => {
    const fab = jasmine.createSpyObj('HTMLIonFabElement', ['close']);
    component.backdrop = true;
    component.backdropClicked(fab);
    expect(component.backdrop).toEqual(false);
    expect(fab.close).toHaveBeenCalled();
  });

  it('validate requires a product', () => {
    component.selectedProduct = null;
    expect(component.validate().valueOf()).toEqual(false);
  });

  it('validate requires type and size for each vat', () => {
    component.selectedProduct = {vats: [{}, {}]};
    expect(component.validate().valueOf()).toEqual(false);
  });

  it('validate requires a transceiver for each vat', () => {
    component.selectedProduct = {vats: [{formula: "somevalidforumla", sizeString: "somevalidsizestring"}]};
    component.selectedTransceivers = [null];
    expect(component.validate().valueOf()).toEqual(false);
  });

  it('validate returns true for a valid assignment', () => {
    component.selectedProduct = {vats: [{formula: "somevalidforumla", sizeString: "somevalidsizestring"}]};
    component.selectedTransceivers = [{}];
    expect(component.validate().valueOf()).toEqual(true);
  });

  
  it('submit doesnt send incorrect data', () => {
    component.selectedProduct = null;
    component.submit();
    expect(toastService.errorToast).toHaveBeenCalledWith("Missing fields");
  });

  it('mergeSensors merges correct sensors', () => {
    component.qrSensors = [
      { serialNumber: "3", type: "somevalidtype", vatId: 23 },
      { serialNumber: "4", type: "somevalidtype", vatId: 23 }
    ];
    component.selectedTransceivers = [
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ];
    component.mergeSensors();
    expect(component.selectedTransceivers).toEqual([
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: "somevalidtype", vatId: 23 },
          { serialNumber: "4", type: "somevalidtype", vatId: 23 }
        ]
      }
    ]);
    expect(component.qrSensors).toEqual([]);
    expect(toastService.successToast).toHaveBeenCalledWith("Sensors merged");
  });

  it('mergeSensors merges only matching sensors', () => {
    component.qrSensors = [
      { serialNumber: "3", type: "somevalidtype", vatId: 23 },
      { serialNumber: "5", type: "somevalidtype", vatId: 23 }
    ];
    component.selectedTransceivers = [
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ];
    component.mergeSensors();
    expect(component.selectedTransceivers).toEqual([
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: "somevalidtype", vatId: 23 },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ]);
    expect(component.qrSensors).toEqual([{ serialNumber: "5", type: "somevalidtype", vatId: 23 }]);
    expect(toastService.successToast).toHaveBeenCalledWith("Sensors merged");
  });

  it('mergeSensors doesnt merge if nothing matches', () => {
    component.qrSensors = [
      { serialNumber: "6", type: "somevalidtype", vatId: 23 },
      { serialNumber: "5", type: "somevalidtype", vatId: 23 }
    ];
    component.selectedTransceivers = [
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ];
    component.mergeSensors();
    expect(component.selectedTransceivers).toEqual([
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ]);
    expect(component.qrSensors).toEqual([
      { serialNumber: "6", type: "somevalidtype", vatId: 23 },
      { serialNumber: "5", type: "somevalidtype", vatId: 23 }
    ]);
    expect(toastService.errorToast).toHaveBeenCalledWith("Cannot merge sensors");
  });

  it('mergeSensors doesnt merge if no scanned sensors', () => {
    component.qrSensors = [];
    component.selectedTransceivers = [
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ];
    component.mergeSensors();
    expect(component.selectedTransceivers).toEqual([
      {
        serialNumber: "123",
        sensors: [
          { serialNumber: "3", type: null, vatId: null },
          { serialNumber: "4", type: null, vatId: null }
        ]
      }
    ]);
    expect(component.qrSensors).toEqual([]);
    expect(toastService.createToast).toHaveBeenCalledWith("Nothing to merge");
  });

  it('addScannedSensor doesnt add if the sensor has already been scanned', () => {
    component.qrSensors = [{ serialNumber: "6", type: "somevalidtype", vatId: 23 }];
    component.addScannedSensor("6");
    expect(toastService.createToast).toHaveBeenCalledWith("6 has already been scanned");
  });

  it('addScannedSensor doesnt add if the sensor is already on the transceiver', () => {
    component.currentVatIndex = 0;
    component.selectedTransceivers = [{ sensors: [{ serialNumber: "6", type: "somevalidtype", vatId: 23 }] }]
    component.addScannedSensor("6");
    expect(toastService.createToast).toHaveBeenCalledWith("6 is already on the transceiver");
  });

  it('addScannedSensor adds the sensor to the scanned sensors', () => {
    const sensorsComponent = jasmine.createSpyObj(SensorsComponent, ['showSensorSelect']);
    component.sensorsChild = sensorsComponent;
    component.currentVatIndex = 0;
    component.qrSensors = [];
    component.selectedTransceivers = [{ serialNumber: "123", sensors: [{ serialNumber: "1", type: "somevalidtype", vatId: 23 }] }];
    component.addScannedSensor("6");
    expect(component.qrSensors).toEqual([{ serialNumber: "6", type: null, vatId: null }]);
    expect(component.sensorsChild.showSensorSelect).toHaveBeenCalledWith({ serialNumber: "6", type: null, vatId: null });
  });

  it('openManual opens the manual sensor entry popover', fakeAsync(() => {
    component.openManual();
    expect(popoverController.create).toHaveBeenCalledWith({
      component: ManualEntryComponent,
      componentProps: {
      },
      mode: 'md'
    });
  }));

  it('openManual adds sensor on dismiss', fakeAsync(() => {
    spyOn(component, 'addScannedSensor');
    component.currentVatIndex = 0;
    component.selectedTransceivers = [{ serialNumber: "123" }];
    component.openManual();
    popover.onDidDismiss.and.returnValue(Promise.resolve({ data: "somevalidserialnumber" }));
    popover.dismiss();
    tick(2000);
    expect(component.addScannedSensor).toHaveBeenCalledWith("somevalidserialnumber");
  }));

  it('openManual doesnt add sensor if not valid', fakeAsync(() => {
    spyOn(component, 'addScannedSensor');
    component.currentVatIndex = 0;
    component.selectedTransceivers = [{ serialNumber: "123" }];
    component.openManual();
    popover.onDidDismiss.and.returnValue(Promise.resolve({ data: "" }));
    popover.dismiss();
    tick(2000);
    expect(component.addScannedSensor).not.toHaveBeenCalled();
  }));

  it('openBar doesnt open the barcode scanner if not cordova', () => {
    platform.is.and.returnValue(false);
    component.openBar();
    expect(barcodeScanner.scan).not.toHaveBeenCalled();
  });

  it('openBar opens the barcode scanner', () => {
    platform.is.and.returnValue(true);
    barcodeScanner.scan.and.returnValue(Promise.resolve({}));
    component.openBar();
    expect(barcodeScanner.scan).toHaveBeenCalled();
  });

  it('openBar adds sensor if one was scanned', fakeAsync(() => {
    spyOn(component, 'addScannedSensor');
    platform.is.and.returnValue(true);
    barcodeScanner.scan.and.returnValue(Promise.resolve({ text: "somevalidserialnumber" }));
    component.openBar();
    tick(1000);
    expect(barcodeScanner.scan).toHaveBeenCalled;
    expect(component.addScannedSensor).toHaveBeenCalledWith("somevalidserialnumber");
  }));

  it('openBar doesnt ad sensor if nothing was scanned', fakeAsync(() => {
    spyOn(component, 'addScannedSensor');
    platform.is.and.returnValue(true);
    barcodeScanner.scan.and.returnValue(Promise.resolve({ text: "" }));
    component.openBar();
    tick(1000);
    expect(barcodeScanner.scan).toHaveBeenCalled;
    expect(component.addScannedSensor).not.toHaveBeenCalled();
    expect(toastService.createToast).toHaveBeenCalledWith("You scanned nothing");
  }));

  it('doRefresh refreshes transceivers', () => {
    component.selectedTransceivers = [{ id: 12 }, { id: 34 }];
    transceiverService.getTransceiver.and.returnValues(of({ id: 12, sensors: [{ id: 5 }] }), of({ id: 34, sensors: [{ id: 6 }] }));
    component.doRefresh(null);
    expect(transceiverService.getTransceiver).toHaveBeenCalledWith(12);
    expect(transceiverService.getTransceiver).toHaveBeenCalledWith(34);
    expect(component.selectedTransceivers).toEqual([{ id: 12, sensors: [{ id: 5 }] }, { id: 34, sensors: [{ id: 6 }] }]);
  });

  it('doRefresh only does one call per transceiver', () => {
    component.selectedTransceivers = [{ id: 12 }, { id: 12 }];
    transceiverService.getTransceiver.and.returnValues(of({ id: 12, sensors: [{ id: 5 }] }));
    component.doRefresh(null);
    expect(transceiverService.getTransceiver).toHaveBeenCalledWith(12);
    expect(transceiverService.getTransceiver).toHaveBeenCalledTimes(1);
    expect(component.selectedTransceivers).toEqual([{ id: 12, sensors: [{ id: 5 }] }, { id: 12, sensors: [{ id: 5 }] }]);
  });

  it('doRefresh doesnt call for nulls', () => {
    component.selectedTransceivers = [{ id: 12 }, null];
    transceiverService.getTransceiver.and.returnValues(of({ id: 12, sensors: [{ id: 5 }] }));
    component.doRefresh(null);
    expect(transceiverService.getTransceiver).toHaveBeenCalledWith(12);
    expect(transceiverService.getTransceiver).toHaveBeenCalledTimes(1);
    expect(component.selectedTransceivers).toEqual([{ id: 12, sensors: [{ id: 5 }] }, null]);
  });

});
