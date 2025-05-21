# Container Tracking System Troubleshooting Guide

This guide helps you resolve common issues that might occur when running the Container Tracking System.

## Database Connection Issues

### Error: Cannot connect to SQL Server

1. Make sure SQL Server is running on your machine
2. Check that the connection string in `appsettings.json` is correct:
   - The default connection string uses `(localdb)\mssqllocaldb` which requires SQL Server Express LocalDB
   - If you're using a different SQL Server instance, update the connection string accordingly

### Solution: Reset the database

If your database is in an inconsistent state, you can reset it using the provided script:

1. Run `reset_database.bat` from the root directory
2. This will drop the existing database and recreate it with migrations
3. Start the application again using `start_app.bat`

## API Connection Errors

### Error: ERR_CONNECTION_REFUSED when connecting to API

If you see connection errors when the frontend tries to connect to the backend:

1. Make sure the API is running (check if the terminal window shows "Now listening on: https://localhost:7243")
2. Verify the API URL in the frontend (`src/api/index.ts`) matches the actual URL of your running API
3. Check that CORS is properly configured in the API to allow requests from your frontend

### Solution: Start with the provided scripts

To ensure proper startup sequence:

1. Close any running instances of the application
2. Run `start_app.bat` which will:
   - Start the API
   - Wait for it to be available
   - Start the frontend only after verifying the API is running

## Property Name Mismatches

### Error: Property does not exist

If you see errors like `'Container' does not contain a definition for 'PropertyName'`, this indicates a mismatch between the property names in your code and the actual model:

1. Check the model definition in `ContainerTrackingSystem.Core/Models/`
2. Update your code to use the correct property names:
   - `BOLBookingNumber` instead of `BolBookingNumber`
   - `PONumber` instead of `PoNumber`
   - `IMO` instead of `Imo`
   - `MMSI` instead of `Mmsi`

## Frontend Issues

### Error: Module not found

If you see errors about missing modules:

1. Make sure all dependencies are installed:
   ```
   cd Frontend
   npm install
   ```

2. If specific modules are missing, install them:
   ```
   npm install missing-package-name
   ```

### TypeScript Errors

If you encounter TypeScript errors:

1. Check for property name mismatches between frontend and backend models
2. Update any outdated type definitions
3. Use proper typings for libraries, especially react-table which often needs @ts-ignore annotations

## Certificate Issues

### Error: Invalid certificate

If you see HTTPS certificate errors:

1. For development, you can use HTTP instead by modifying the API_URL in `src/api/index.ts` 
2. Alternatively, install a development certificate:
   ```
   dotnet dev-certs https --trust
   ```

## Steps to Run the Application

For best results, follow these steps:

1. Ensure SQL Server is running
2. Run `reset_database.bat` if starting fresh or having database issues
3. Run `start_app.bat` to start both backend and frontend
4. The application should open in your browser at http://localhost:3000

## Common Container Data Issues

If container data doesn't display correctly:

1. Check that the backend seeding worked by visiting https://localhost:7243/api/containers
2. If no data appears, run the database reset script and restart the application
3. Verify that the frontend is correctly calling the API endpoints

## Need More Help?

If you're still experiencing issues:

1. Check the development console in your browser for more specific errors
2. Look at the terminal output from both the frontend and backend processes
3. Review any error messages in the SQL Server logs