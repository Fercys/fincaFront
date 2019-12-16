import { TestBed } from '@angular/core/testing';

import { FarmZoneService } from './farm-zone.service';

describe('FarmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FarmZoneService = TestBed.get(FarmZoneService);
    expect(service).toBeTruthy();
  });
});
