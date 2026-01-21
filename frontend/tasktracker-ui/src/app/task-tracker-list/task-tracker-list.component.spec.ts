import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTrackerListComponent } from './task-tracker-list.component';

describe('TaskTrackerListComponent', () => {
  let component: TaskTrackerListComponent;
  let fixture: ComponentFixture<TaskTrackerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskTrackerListComponent]
    });
    fixture = TestBed.createComponent(TaskTrackerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
