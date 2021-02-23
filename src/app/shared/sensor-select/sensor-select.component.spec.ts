import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorSelectComponent } from './sensor-select.component';

describe('SensorSelectComponent', () => {
  let component: SensorSelectComponent;
  let fixture: ComponentFixture<SensorSelectComponent>;
  let popover;

  beforeEach(async(() => {
    popover = jasmine.createSpyObj('Popover', ['dismiss']);
    TestBed.configureTestingModule({
      declarations: [ SensorSelectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(SensorSelectComponent);
    component = fixture.componentInstance;
    component.popover = popover;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('confirms selection', () => {
    component.selection = "somevalidselection";
    component.confirm();
    expect(popover.dismiss).toHaveBeenCalledWith("somevalidselection");
  });
});
