import { TestBed } from '@angular/core/testing';

import { GenerateResult } from './generate-result';

describe('GenerateResult', () => {
  let service: GenerateResult;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateResult);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
