import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from 'src/app/core/_services/product.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';

import { SearchModalComponent } from './search-modal.component';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;
  let productService;
  let transceiverService;

  beforeEach(async(() => {
    productService = jasmine.createSpyObj('ProductService', ['getAllProducts', 'getFilteredProducts', 'products', 'loadMore']);
    productService.products = new BehaviorSubject([]);
    transceiverService = jasmine.createSpyObj('TransceiverService', ['getAllTransceivers', 'getFilteredTransceivers', 'transceivers', 'loadMore']);
    transceiverService.transceivers = new BehaviorSubject([]);
    TestBed.configureTestingModule({
      declarations: [SearchModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ProductService,
          useValue: productService
        },
        {
          provide: TransceiverService,
          useValue: transceiverService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets products on init', () => {
    component.type = "Product";
    component.ngOnInit();
    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    expect(component.objects).toEqual([]);
  });

  it('gets transceivers on init', () => {
    component.type = "Transceiver";
    component.ngOnInit();
    expect(transceiverService.getAllTransceivers).toHaveBeenCalledTimes(1);
    expect(component.objects).toEqual([]);
  });

  it('doInfinite loads more product data', () => {
    component.type = "Product";
    component.ngOnInit();
    component.doInfinite(null);
    expect(productService.loadMore).toHaveBeenCalledTimes(1);
    expect(component.objects).toEqual([]);
  });

  it('doInfinite loads more transceiver data', () => {
    component.type = "Transceiver";
    component.ngOnInit();
    component.doInfinite(null);
    expect(transceiverService.loadMore).toHaveBeenCalledTimes(1);
    expect(component.objects).toEqual([]);
  });

  it('filter gets filtered products', () => {
    component.type = "Product";
    component.filter({ srcElement: { value: "somevalidsearchterm" } });
    expect(productService.getFilteredProducts).toHaveBeenCalledWith("somevalidsearchterm");
  });

  it('filter gets all products when no search term', () => {
    component.type = "Product";
    component.filter({ srcElement: { value: "" } });
    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('filter gets filtered products', () => {
    component.type = "Transceiver";
    component.filter({ srcElement: { value: "somevalidsearchterm" } });
    expect(transceiverService.getFilteredTransceivers).toHaveBeenCalledWith("somevalidsearchterm");
  });

  it('filter gets all products when no search term', () => {
    component.type = "Transceiver";
    component.filter({ srcElement: { value: "" } });
    expect(transceiverService.getAllTransceivers).toHaveBeenCalledTimes(1);
  });
});
