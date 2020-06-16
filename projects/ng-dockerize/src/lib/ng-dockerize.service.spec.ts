import { TestBed } from '@angular/core/testing';

import { NgDockerizeService } from './ng-dockerize.service';

describe('NgDockerizeService', () => {
  let service: NgDockerizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgDockerizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
