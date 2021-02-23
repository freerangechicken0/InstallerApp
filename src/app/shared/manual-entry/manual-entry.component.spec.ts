import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntryComponent } from './manual-entry.component';

describe('ManualEntryComponent', () => {
  let component: ManualEntryComponent;
  let fixture: ComponentFixture<ManualEntryComponent>;
  let popover;

  beforeEach(async(() => {
    popover = jasmine.createSpyObj('PopoverController', ['dismiss']);
    TestBed.configureTestingModule({
      declarations: [ManualEntryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;
    component.popover = popover;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('inputChange sets serialNumber', () => {
    component.inputChange({ detail: { value: "somevalidvalue" } });
    expect(component.serialNumber).toEqual("somevalidvalue");
  });

  it('shouldnt confirm if nothing is entered', () => {
    component.serialNumber = null;
    component.confirm();
    expect(popover.dismiss).not.toHaveBeenCalled();
  });

  it('should confirm if something is entered', () => {
    component.serialNumber = "somevalidserialnumber";
    component.confirm();
    expect(popover.dismiss).toHaveBeenCalledWith("somevalidserialnumber");
  });
});
