import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFnsModule } from 'ngx-date-fns';
import { BehaviorSubject, of } from 'rxjs';
import { ToastService } from 'src/app/core/_services/toast.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';

import { InfoModalComponent } from './info-modal.component';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;
  let modal;
  let transceiverService;
  let toastService;

  beforeEach(async(() => {
    modal = jasmine.createSpyObj('Modal', ['dismiss']);
    transceiverService = jasmine.createSpyObj('TransceiverService', ['getTransceiverData', 'rebootTransceiver']);
    transceiverService.transceiverData = new BehaviorSubject([]);
    transceiverService.boot = new BehaviorSubject(null);
    transceiverService.cell = new BehaviorSubject(null);
    toastService = jasmine.createSpyObj('ToastService', ['successToast', 'errorToast']);
    TestBed.configureTestingModule({
      declarations: [InfoModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        DateFnsModule
      ],
      providers: [
        {
          provide: TransceiverService,
          useValue: transceiverService
        },
        {
          provide: ToastService,
          useValue: toastService
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    component.modal = modal;
    component.type = "somevalidtype";
    component.transceiver = { id: 123 };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getTransceiverData retreives and sets data', () => {
    component.getTransceiverData();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, null);
    expect(transceiverService.transceiverData.value).toEqual([]);
    transceiverService.transceiverData.next([{ data: "somevaliddata", topic: "somevalidtopic" }]);
    expect(component.data).toEqual([{ data: "somevaliddata", topic: "somevalidtopic" }]);
  });

  it('getTransceiverData retreives and doesnt set data if there isnt any', () => {
    component.getTransceiverData();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, null);
    expect(transceiverService.transceiverData.value).toEqual([]);
    transceiverService.transceiverData.next([{ data: "somevaliddata", topic: "somevalidtopic" }]);
    expect(component.data).toEqual([{ data: "somevaliddata", topic: "somevalidtopic" }]);
    transceiverService.transceiverData.next([]);
    expect(component.data).toEqual([{ data: "somevaliddata", topic: "somevalidtopic" }]);
  });

  it('getTransceiverCheckins gets and sets the boot checkin', () => {
    component.getTransceiverCheckins();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, "boot");
    expect(transceiverService.boot.value).toEqual(null);
    transceiverService.boot.next("somevalidboot");
    expect(component.lastBoot).toEqual("somevalidboot");
  });

  it('getTransceiverCheckins gets and doesnt set the boot checkin if there isnt one', () => {
    component.getTransceiverCheckins();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, "boot");
    expect(transceiverService.boot.value).toEqual(null);
    transceiverService.boot.next("somevalidboot");
    expect(component.lastBoot).toEqual("somevalidboot");
    transceiverService.boot.next(null);
    expect(component.lastBoot).toEqual("somevalidboot");
  });

  it('getTransceiverCheckins gets and sets the cell checkin', () => {
    component.getTransceiverCheckins();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, "cell");
    expect(transceiverService.cell.value).toEqual(null);
    transceiverService.cell.next({ rssi: 456, date: "somevalidcell" });
    expect(component.lastCellStrength).toEqual(456);
    expect(component.lastCell).toEqual("somevalidcell");
  });

  it('getTransceiverCheckins gets and doesnt set the cell checkin if there isnt one', () => {
    component.getTransceiverCheckins();
    expect(transceiverService.getTransceiverData).toHaveBeenCalledWith(123, "cell");
    expect(transceiverService.cell.value).toEqual(null);
    transceiverService.cell.next({ rssi: 456, date: "somevalidcell" });
    expect(component.lastCellStrength).toEqual(456);
    expect(component.lastCell).toEqual("somevalidcell");
    transceiverService.cell.next(null);
    expect(component.lastCellStrength).toEqual(456);
    expect(component.lastCell).toEqual("somevalidcell");
  });

  it('findLastCheckins finds transceiver checkin', () => {
    component.lastTranCheckin = null;
    component.data = [{ topic: "somevalidtopic", date: "somevaliddate" }, { topic: "transceiver/", date: "somevaliddate" }];
    component.findLastCheckins()
    expect(component.lastTranCheckin).toEqual("somevaliddate");
  });

  it('findLastCheckins find sensor checkins', () => {
    component.transceiver = { id: 456, sensors: [{ uniqueId: "somevaliduniqueid1" }, { uniqueId: "somevaliduniqueid2" }] };
    component.data = [{ topic: "somevalidtopic", date: "somevaliddate" }, { topic: "sensor/somevaliduniqueid1", date: "somevaliddate1" }, { topic: "sensor/somevaliduniqueid2", date: "somevaliddate2" }]
    component.findLastCheckins();
    expect(component.lastCheckins).toEqual(["somevaliddate1", "somevaliddate2"]);
  });

  it('findLastCheckins finds sensor checkins and puts N/A when it cant', () => {
    component.transceiver = { id: 456, sensors: [{ uniqueId: "somevaliduniqueid1" }, { uniqueId: "somevaliduniqueid2" }] };
    component.data = [{ topic: "somevalidtopic", date: "somevaliddate" }, { topic: "sensor/somevaliduniqueid1", date: "somevaliddate1" }, { topic: "somevalidtopic", date: "somevaliddate" }]
    component.findLastCheckins();
    expect(component.lastCheckins).toEqual(["somevaliddate1", "N/A"]);
  });

  it('serialNumberFromUniqueId gets sensor serial number when known', () => {
    component.transceiver = { sensors: [{ uniqueId: "somevaliduniqueid", serialNumber: "somevalidserialnumber" }] };
    const serialNumber = component.serialNumberFromUniqueId("sensor/somevaliduniqueid");
    expect(serialNumber).toEqual("somevalidserialnumber");
  });

  it('serialNumberFromUniqueId returns topic when sensor isnt on transceiver', () => {
    component.transceiver = { sensors: [{ uniqueId: "somevaliduniqueid", serialNumber: "somevalidserialnumber" }] };
    const serialNumber = component.serialNumberFromUniqueId("sensor/someothervaliduniqueid");
    expect(serialNumber).toEqual("sensor/someothervaliduniqueid");
  });

  it('serialNumberFromUniqueId gets sensor serial number when known', () => {
    component.transceiver = { serialNumber: "somevalidserialnumber" };
    const serialNumber = component.serialNumberFromUniqueId("transceiver/somevalidid");
    expect(serialNumber).toEqual("somevalidserialnumber");
  });

  it('serialNumberFromUniqueId returns topic when isnt a sensor or transceiver', () => {
    const serialNumber = component.serialNumberFromUniqueId("vat/somevalidvatid");
    expect(serialNumber).toEqual("vat/somevalidvatid");
  });

  it('findSensorType finds the type of a sensor from the topic', () => {
    component.transceiver = { sensors: [{ uniqueId: "somevaliduniqueid", type: "somevalidtype" }] };
    const type = component.findSensorType("sensor/somevaliduniqueid");
    expect(type).toEqual("somevalidtype");
  });

  it('findSensorType returns null when sensor isnt on transceiver', () => {
    component.transceiver = { sensors: [{ uniqueId: "somevaliduniqueid", type: "somevalidtype" }] };
    const type = component.findSensorType("sensor/someothervaliduniqueid");
    expect(type).toEqual(null);
  });

  it('findSensorType returns null when  isnt a sensor', () => {
    const type = component.findSensorType("vat/somevalidvatid");
    expect(type).toEqual(null);
  });

  it('rebootTransceiver sends reboot request', () => {
    transceiverService.rebootTransceiver.and.returnValue(of({}));
    component.rebootTransceiver();
    expect(transceiverService.rebootTransceiver).toHaveBeenCalledWith(123);
  });

  it('rebootTransceiver creates toast if reboot sent successfully', () => {
    transceiverService.rebootTransceiver.and.returnValue(of({ data: "somevaliddata" }));
    component.rebootTransceiver();
    expect(transceiverService.rebootTransceiver).toHaveBeenCalledWith(123);
    expect(toastService.successToast).toHaveBeenCalledWith("Reboot message has been sent");
  });

  it('rebootTransceiver creates toast if reboot sent successfully', () => {
    transceiverService.rebootTransceiver.and.returnValue(of({}));
    component.rebootTransceiver();
    expect(transceiverService.rebootTransceiver).toHaveBeenCalledWith(123);
    expect(toastService.errorToast).toHaveBeenCalledWith("Transceiver reboot failed");
  });

});
