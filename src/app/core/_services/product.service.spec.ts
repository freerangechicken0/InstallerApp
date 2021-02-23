import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends first getAll request', () => {
    service.page = 1;
    service.filter = null;
    service.getAllProducts();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sends first & next getAll request', () => {
    service.page = 1;
    service.filter = null;
    service.getAllProducts();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
    service.page++;
    service.getAllProducts();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=2')).toBeTruthy();
  });

  it('sends specific getAll request', () => {
    service.page = 4;
    service.filter = null;
    service.getAllProducts();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=4')).toBeTruthy();
  });

  it('sends first getfiltered request', () => {
    service.page = 1;
    service.filter = null;
    service.getFilteredProducts("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sends first & next getfiltered request', () => {
    service.page = 1;
    service.filter = null;
    service.getFilteredProducts("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
    service.page++;
    service.filter = "somevalidfilter";
    service.getFilteredProducts("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=2')).toBeTruthy();
  });

  it('sends specific getfiltered request', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getFilteredProducts("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=4')).toBeTruthy();
  });

  it('sets page to 1 when given a different filter', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getFilteredProducts("someothervalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=someothervalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sets page to 1 when going from getFiltered to getAll', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getAllProducts();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sets page to 1 when going from getAll to getFiltered', () => {
    service.page = 4;
    service.filter = null;
    service.getFilteredProducts("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('loadMore runs correct function: all', () => {
    service.page = 2;
    service.filter = null;
    service.loadMore();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&include=vats,transceivers,transceivers.sensors&perPage=30&page=2')).toBeTruthy();
  });

  it('loadMore runs correct function: filtered', () => {
    service.page = 2;
    service.filter = "somevalidfilter";
    service.loadMore();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products?filter%5Btype%5D=milk&filter%5Bname%5D=somevalidfilter&include=vats,transceivers,transceivers.sensors&perPage=30&page=2')).toBeTruthy();
  });

  it('sends assign sensors request: 123', () => {
    service.assignSensorsToProduct(123, {vatSensors: {id: 1}}).subscribe();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/products/123/assignSensors')).toBeTruthy();
  });
});
