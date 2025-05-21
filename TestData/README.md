# Container Tracking System Test Data

This directory contains test data for the Container Tracking System.

## Backend Data Seeding

The system comes with automatic data seeding for development purposes. When you run the backend API application in development mode, it will automatically seed the database with test data including:

- 5 Shiplines with tracking links
- 5 Vessel Lines with tracking links
- 5 Vessels
- 5 Ports
- 5 Terminals with tracking links
- Various dropdown options (statuses, container sizes, etc.)
- 50 containers with various statuses and data

The seeding only happens if the database is empty, so it won't overwrite your existing data.

### How to Use Backend Seeding

1. Make sure your database connection string is correctly set in `appsettings.json`
2. Run the API project: `dotnet run`
3. The database will be created (if it doesn't exist), migrations will be applied, and test data will be seeded

## CSV Import Test Data

For testing the frontend CSV import functionality, a sample CSV file `test_containers.csv` is provided in this directory.

### How to Use the CSV Import File

1. Start the frontend application: `npm start`
2. Go to the Containers page
3. Click "Import CSV"
4. Select the `test_containers.csv` file
5. Map the columns (the column names should auto-map correctly)
6. Import the containers

## Testing Scenarios

With this test data, you can test the following scenarios:

1. **Container Status Filtering:** The seed data includes containers in all status categories.
2. **Search Functionality:** Search for containers by number, project, etc.
3. **Inline Editing:** Test editing container fields directly in the table.
4. **Bulk Operations:** Select multiple containers and perform bulk edits or deletions.
5. **Tracking Links:** Check the tracking link functionality for shiplines, vessel lines, and terminals.
6. **CSV Import:** Test importing containers using the CSV file.

## Clearing Test Data

If you want to clear the test data and start fresh:

1. Stop the backend API
2. Delete the database
3. Restart the API - it will create a new database and seed it with fresh test data

Or, if you prefer to keep the database structure and just clear the data:

```sql
DELETE FROM Containers;
DELETE FROM Terminals;
DELETE FROM Ports;
DELETE FROM Vessels;
DELETE FROM VesselLines;
DELETE FROM Shiplines;
DELETE FROM DropdownOptions;
```