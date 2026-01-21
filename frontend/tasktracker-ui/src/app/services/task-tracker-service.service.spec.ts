import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskTrackerServiceService } from './task-tracker-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NotificationServiceService } from './notification-service.service';

describe('TaskTrackerServiceService', () => {
  let service: TaskTrackerServiceService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationServiceService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NotificationServiceService', ['showError', 'showSuccess']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskTrackerServiceService,
        { provide: NotificationServiceService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TaskTrackerServiceService);
    notificationServiceSpy = TestBed.inject(NotificationServiceService) as jasmine.SpyObj<NotificationServiceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle network errors', () => {
      
      const errorResponse = new HttpErrorResponse({
        error: 'test error',
        status: 0,
        statusText: 'Unknown Error'
      });

       
      const result = service['handleError'](errorResponse);

       
      result.subscribe({
        error: (error) => {
          expect(error.message).toBe('Unable to connect to the server. Please check your connection.');
        }
      });
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Unable to connect to the server. Please check your connection.'
      );
    });

    it('should handle 400 Bad Request with error details', () => {
      
      const errorResponse = new HttpErrorResponse({
        error: { 
          title: 'Bad Request',
          detail: 'Invalid input data'
        },
        status: 400,
        statusText: 'Bad Request'
      });

       
      const result = service['handleError'](errorResponse);

       
      result.subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid input data');
        }
      });
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Invalid input data');
    });

    it('should handle 500 Server Error', () => {
      
      const errorResponse = new HttpErrorResponse({
        error: 'Server error',
        status: 500,
        statusText: 'Internal Server Error'
      });

       
      const result = service['handleError'](errorResponse);

       
      result.subscribe({
        error: (error) => {
          expect(error.message).toBe('A server error occurred. Please try again later.');
        }
      });
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'A server error occurred. Please try again later.'
      );
    });

    it('should handle unknown error format', () => {
  
  const errorResponse = new HttpErrorResponse({
    error: 'Unknown error format',
    status: 418,
    statusText: 'I\'m a teapot'
  });
   
  const result = service['handleError'](errorResponse);
   
  result.subscribe({
    error: (error) => {
      expect(error.message).toBe('Http failure response for (unknown url): 418 I\'m a teapot');
    }
  });
  expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
    'Http failure response for (unknown url): 418 I\'m a teapot'
  );
});
  });
});