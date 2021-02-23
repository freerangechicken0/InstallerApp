import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TransceiverService } from './transceiver.service';

describe('TransceiverService', () => {
  let service: TransceiverService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TransceiverService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends get transceiver request: 123', () => {
    service.getTransceiver(123).subscribe();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers/123?include=sensors')).toBeTruthy();
  });

  it('sends first getAll request', () => {
    service.page = 1;
    service.filter = null;
    service.getAllTransceivers();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sends first & next getAll request', () => {
    service.page = 1;
    service.filter = null;
    service.getAllTransceivers();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=1')).toBeTruthy();
    service.page++;
    service.getAllTransceivers();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=2')).toBeTruthy();  
  });

  it('sends specific getAll request: page 4', () => {
    service.page = 4;
    service.filter = null;
    service.getAllTransceivers();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=4')).toBeTruthy();
  });

  it('sends first getfiltered request', () => {
    service.page = 1;
    service.filter = null;
    service.getFilteredTransceivers("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=1')).toBeTruthy();
  });

  it('sends first & next getfiltered request', () => {
    service.page = 1;
    service.filter = null;
    service.getFilteredTransceivers("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=1')).toBeTruthy();
    service.page++;
    service.filter = "somevalidfilter";
    service.getFilteredTransceivers("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=2')).toBeTruthy();
  });

  it('sends specific getfiltered request', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getFilteredTransceivers("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=4')).toBeTruthy();
  });

  it('sets page to 1 when given a different filter', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getFilteredTransceivers("someothervalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=someothervalidfilter&perPage=30&page=1')).toBeTruthy();
  });

  it('sets page to 1 when going from getFiltered to getAll', () => {
    service.page = 4;
    service.filter = "somevalidfilter";
    service.getAllTransceivers();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=1')).toBeTruthy();
  });

  it('sets page to 1 when going from getAll to getFiltered', () => {
    service.page = 4;
    service.filter = null;
    service.getFilteredTransceivers("somevalidfilter");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=1')).toBeTruthy();
  });

  it('loadMore runs correct function: all', () => {
    service.page = 2;
    service.filter = null;
    service.loadMore();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&perPage=30&page=2')).toBeTruthy();
  });

  it('loadMore runs correct function: filtered', () => {
    service.page = 2;
    service.filter = "somevalidfilter"
    service.loadMore();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers?include=sensors&filter%5BserialNumber%5D=somevalidfilter&perPage=30&page=2')).toBeTruthy();
  });

  it('sends get transceiver data request: 123', () => {
    service.getTransceiverData(123, null);
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers/123/data?key=&sortKey=')).toBeTruthy();
    httpTestingController.verify();
  });

  it('sends get transceiver boot data request: 123', () => {
    service.getTransceiverData(123, "boot");
    expect
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers/123/data?filter=boot')).toBeTruthy();
  });

  it('sends get transceiver cell data request: 123', () => {
    service.getTransceiverData(123, "cell");
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers/123/data?filter=cell')).toBeTruthy();
  });

  it('sends transceiver reboot request: 123', () => {
    service.rebootTransceiver(123).subscribe();
    expect(httpTestingController.expectOne('https://api.uat.milk.levno.com/api/transceivers/123/reboot')).toBeTruthy();
  });
});
