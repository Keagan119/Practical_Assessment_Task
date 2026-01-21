# Task Tracker Application

A full-stack task management application with a .NET 8 backend and Angular 16 frontend.

## Prerequisites

- .NET 8.0 SDK or later
- Node.js v16.14.2
- Angular 16
- Visual Studio Code or Visual Studio

## Backend (.NET 8)

### Setup and Run

1. Navigate to the backend directory:
   ```bash
   cd backend/TaskTracker.Api
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Build the solution:
   ```bash
   dotnet build
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` or `http://localhost:5000`.

### API

- Swagger UI: `https://localhost:5001/swagger`
- Health check: `https://localhost:5001/health`

## Frontend (Angular 16)

### Setup and Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend/tasktracker-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## Development

### Backend
- Built with .NET 8
- Entity Framework Core with InMemory provider
- Swagger/OpenAPI for API documentation
- CORS enabled for local development

### Frontend
- Angular 16
- TypeScript
- HTTP client for API communication

## Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `ASPNETCORE_URLS`: Web server URLs (default: `http://localhost:5000;https://localhost:5001`)

### Frontend
- `API_URL`: Base URL for the backend API (default: `https://localhost:5001`)

## Testing

### Backend Tests
```bash
cd backend/TaskTracker.Tests
dotnet restore
dotnet test
```

### Frontend Tests
```bash
cd frontend/tasktracker-ui
ng test --include=**/task-tracker-service.service.spec.ts
```