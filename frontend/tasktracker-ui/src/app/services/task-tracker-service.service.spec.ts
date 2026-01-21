import { TestBed } from '@angular/core/testing';

import { TaskTrackerServiceService } from './task-tracker-service.service';

describe('TaskTrackerServiceService', () => {
  let service: TaskTrackerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTrackerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
