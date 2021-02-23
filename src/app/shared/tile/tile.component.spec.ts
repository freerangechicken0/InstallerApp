import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileComponent } from './tile.component';

describe('TileComponent', () => {
  let component: TileComponent;
  let fixture: ComponentFixture<TileComponent>;
  let eventEmitter;
  let event;

  beforeEach(async(() => {
    eventEmitter = jasmine.createSpyObj('EventEmitter', ['emit']);
    event = jasmine.createSpyObj('Event', ['stopPropagation']);
    TestBed.configureTestingModule({
      declarations: [ TileComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(TileComponent);
    component = fixture.componentInstance;
    component.serialNumber = "123";
    component.sensorDeleted = eventEmitter;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits deleted sensor and stops propagation', () => {
    component.deleteSensor(event);
    expect(eventEmitter.emit).toHaveBeenCalledWith("123");
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('printableType returns correct types', () => {
    expect(component.printableType("lidarDistance")).toEqual("Lidar Sensor");
    expect(component.printableType("stirrer")).toEqual("Stirrer Sensor");
    expect(component.printableType("vatTemp")).toEqual("Vat Temperature");
    expect(component.printableType("inletTemp")).toEqual("Inlet Temperature");
    expect(component.printableType(null)).toEqual("Unassigned");
    expect(component.printableType("")).toEqual("Unassigned");
    expect(component.printableType("someothertype")).toEqual("someothertype");
  });
});
