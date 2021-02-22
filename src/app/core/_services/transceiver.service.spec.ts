import { TestBed } from '@angular/core/testing';

import { TransceiverService } from './transceiver.service';

describe('DataService', () => {
  let service: TransceiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransceiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
