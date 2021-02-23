import { TestBed } from '@angular/core/testing';

import { SimproService } from './simpro.service';

describe('SimproService', () => {
  let service: SimproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
