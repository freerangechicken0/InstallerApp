import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobSelectComponent } from './job-select.component';

describe('JobSelectComponent', () => {
  let component: JobSelectComponent;
  let fixture: ComponentFixture<JobSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
