# Task Tracker Overview

## Design

### Backend
- **In-Memory Database**: Used EF Core InMemory provider for easy data access during development
- **Minimal API**: Implemented a  minimal API for a lightweight and focused implementation
- **Error Handling**: Implemented a global validation handler to ensure consistent error responses

### Frontend
- **Angular Services**: Created a dedicated service for API communication
- **Reactive Forms**: Used Angulars reactive forms for better form handling and validation
- **Strict Angular Types**: Made use of TypeScript interfaces for type safety across the application

## Challenges

### Unit Testing
While implementing unit tests for the TaskController, I encountered difficulties getting certain unit tests to pass. The test was intended to verify that the API correctly returns a 400 response when invalid data is submitted, but the behavior was not immediately clear during test execution.

As I had limited prior experience with unit testing in ASP.NET Core, understanding the expected behavior of controller actions in a test environment was challenging.

### Diagnosis
With the assistance of AI tooling, I investigated the issue and learned that controller unit tests do not execute the full ASP.NET Core request pipeline. As a result, certain framework behaviors such as automatic model validation and response formatting provided by the [ApiController] attribute do not occur in the same way as they do during normal API execution.

### Resolution
Using AI guidance, I adjusted the unit test to align with how ASP.NET Core behaves in a controller only test environment. Instead of asserting directly on HTTP status codes, the test was updated to verify the presence of validation errors within the returned ValidationProblemDetails object.
