import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { SearchModalComponent } from './search-modal/search-modal.component';

import { SelectButtonComponent } from './select-button.component';

describe('SelectButtonComponent', () => {
  let component: SelectButtonComponent;
  let fixture: ComponentFixture<SelectButtonComponent>;
  let modalController;
  let modal;
  let eventEmitter;

  beforeEach(async(() => {
    modalController = jasmine.createSpyObj('ModalController', ['create']);
    modal = jasmine.createSpyObj('Modal', ['present', 'onDidDismiss', "dismiss"]);
    modal.onDidDismiss.and.returnValue(Promise.resolve({}));
    modalController.create.and.returnValue(modal);
    eventEmitter = jasmine.createSpyObj('EventEmitter', ['emit']);
    TestBed.configureTestingModule({
      declarations: [SelectButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [],
      providers: [
        {
          provide: ModalController,
          useValue: modalController
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectButtonComponent);
    component = fixture.componentInstance;
    component.objectSelected = eventEmitter;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('object search opens properly', () => {
    component.type = "somevalidtype";
    component.openObjectSearch();
    expect(modalController.create).toHaveBeenCalledWith({
      component: SearchModalComponent,
      componentProps: {
        type: "somevalidtype"
      },
      mode: 'md'
    });
  });

  it('object search emits selected object on dismiss', fakeAsync(() => {
    component.type = "somevalidtype";
    component.openObjectSearch();
    modal.onDidDismiss.and.returnValue(Promise.resolve({ data: { id: 123 } }));
    modal.dismiss();
    tick(2000);
    expect(component.selectedObject).toEqual({ id: 123 });
    expect(eventEmitter.emit).toHaveBeenCalledWith({ id: 123 });
  }));

  it('info modal opens properly', () => {
    component.type = "somevalidtype";
    component.selectedObject = { id: 123 };
    component.openInfoModal();
    expect(modalController.create).toHaveBeenCalledWith({
      component: InfoModalComponent,
      componentProps: {
        type: "somevalidtype",
        transceiver: { id: 123 }
      },
      mode: 'md'
    });
  });
});
