import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VatSerialNumberComponent } from './vat-serial-number.component';

describe('VatSerialNumberComponent', () => {
  let component: VatSerialNumberComponent;
  let fixture: ComponentFixture<VatSerialNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatSerialNumberComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VatSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
