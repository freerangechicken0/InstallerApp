import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthAndSafetyModalComponent } from './health-and-safety-modal.component';

describe('HealthAndSafetyModalComponent', () => {
  let component: HealthAndSafetyModalComponent;
  let fixture: ComponentFixture<HealthAndSafetyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthAndSafetyModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthAndSafetyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
