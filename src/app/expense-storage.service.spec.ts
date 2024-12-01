import { TestBed } from '@angular/core/testing';

import { ExpenseStorageService } from './expense-storage.service';

describe('ExpenseStorageService', () => {
  let service: ExpenseStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
