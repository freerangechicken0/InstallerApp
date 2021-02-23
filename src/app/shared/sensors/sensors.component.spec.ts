import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular';
import { ToastService } from 'src/app/core/_services/toast.service';
import { SensorSelectComponent } from 'src/app/shared/sensor-select/sensor-select.component';

import { SensorsComponent } from './sensors.component';

describe('SensorsComponent', () => {
  let component: SensorsComponent;
  let fixture: ComponentFixture<SensorsComponent>;
  let popoverController;
  let popover;
  let toastService: ToastService;

  beforeEach(async(() => {
    popoverController = jasmine.createSpyObj('PopoverController', ['create']);
    popover = jasmine.createSpyObj('Popover', ['present', 'onDidDismiss', "dismiss"]);
    popover.onDidDismiss.and.returnValue(Promise.resolve({}));
    popoverController.create.and.returnValue(popover);
    toastService = jasmine.createSpyObj('ToastService', ['errorToast']);
    TestBed.configureTestingModule({
      declarations: [SensorsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: PopoverController,
          useValue: popoverController
        },
        {
          provide: ToastService,
          useValue: toastService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SensorsComponent);
    component = fixture.componentInstance;
    component.sensors = [];
    component.transceiverSerialNumber = 'somevalidtranserialnumber';
    component.vat = null;
    component.qrSensors = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('wont open popover with no vat', () => {
    component.vat = null;
    component.showSensorSelect({});
    expect(toastService.errorToast).toHaveBeenCalledWith("Cannot assign sensor with no Product");
  });

  it('opens popover when has vat', () => {
    component.vat = {};
    component.showSensorSelect({ serialNumber: "somevalidserialnumber", type: "somevalidtype" });
    expect(popoverController.create).toHaveBeenCalledWith({
      component: SensorSelectComponent,
      componentProps: {
        transceiverSerialNumber: "somevalidtranserialnumber",
        sensorSerialNumber: "somevalidserialnumber",
        assignment: "somevalidtype",
        sensorOptions: [["Lidar Sensor", "lidarDistance"], ["Stirrer Sensor", "stirrer"], ["Vat Temperature", "vatTemp"], ["Inlet Temperature", "inletTemp"], ["Unassigned", null]]
      },
      mode: 'md'
    });
  });

  it('closing popover sets sensor type and vatid', fakeAsync(() => {
    component.vat = { id: 123 };
    const sensor = { serialNumber: "somevalidserialnumber", type: null, vatId: null };
    component.showSensorSelect(sensor);
    popover.onDidDismiss.and.returnValue(Promise.resolve({data: "somevalidtype"}));
    popover.dismiss();
    tick(2000);
    expect(sensor).toEqual({ serialNumber: "somevalidserialnumber", type: "somevalidtype", vatId: 123 })
  }));

  it('deletes scanned or added sensor', () => {
    expect(component.qrSensors).toEqual([]);
    component.qrSensors.push({ serialNumber: "123" }, { serialNumber: "124" }, { serialNumber: "125" });
    expect(component.qrSensors).toEqual([{ serialNumber: "123" }, { serialNumber: "124" }, { serialNumber: "125" }]);
    component.deleteQrSensor("124");
    expect(component.qrSensors).toEqual([{ serialNumber: "123" }, { serialNumber: "125" }]);
  });
});
