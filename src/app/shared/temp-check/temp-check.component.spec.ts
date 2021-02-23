import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TempCheckComponent } from './temp-check.component';

describe('TempCheckComponent', () => {
  let component: TempCheckComponent;
  let fixture: ComponentFixture<TempCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempCheckComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TempCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
