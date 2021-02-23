import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrgHeaderComponent } from './org-header.component';

describe('OrgHeaderComponent', () => {
  let component: OrgHeaderComponent;
  let fixture: ComponentFixture<OrgHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgHeaderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrgHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
