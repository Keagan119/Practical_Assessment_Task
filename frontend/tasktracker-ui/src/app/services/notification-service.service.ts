import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  private readonly defaultSuccessConfig: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-snackbar'],
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  private readonly defaultErrorConfig: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-snackbar'],
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.snackBar.open(message, action, { ...this.defaultSuccessConfig, ...config });
  }

  showError(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.snackBar.open(`Error: ${message}`, action, { ...this.defaultErrorConfig, ...config });
  }

  handleApiError(error: any, defaultMessage: string = 'An error occurred'): void {
    let errorMessage = defaultMessage;
    
    if (error?.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error?.error?.title) {
      errorMessage = error.error.title;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    this.showError(errorMessage);
  }
}