# Container Tracking System (CTS) 

## Project Origins

This repository contains a modern reimplementation of the Container Tracking Hub (CTHub) system using React/TypeScript and ASP.NET Core with Entity Framework.

The original CTHub system can be found here:

- **Original CTHub Repository**: [github.com/caseyquintin/CTHub](https://github.com/caseyquintin/CTHub)
- **Key Improvements**: This modern implementation preserves all functionality of the original system while introducing React components, TypeScript type safety, Entity Framework, and improved testing infrastructure.
- **Database Compatibility**: Both systems work with the same database schema, allowing for a gradual transition from the original to modern implementation.

A modern container tracking system for logistics companies with status updates, location tracking, and comprehensive data management.

## Project Overview

This system allows logistics companies to track shipping containers with:
- Status updates
- Location tracking
- Date management
- Bulk operations
- Comprehensive data management
- Links to external tracking systems

## Tech Stack

- **Backend**: ASP.NET Core Web API
- **Frontend**: React with TypeScript and Tailwind CSS
- **Database**: SQL Server (code-first approach with Entity Framework Core)
- **State Management**: React Context API
- **API Documentation**: Swagger/OpenAPI

## Project Structure

```
CTS/
├── Backend/
│   ├── ContainerTrackingSystem.API/       # API controllers, Startup, etc.
│   ├── ContainerTrackingSystem.Core/      # Domain models and interfaces
│   └── ContainerTrackingSystem.Data/      # Database context, repositories, migrations
├── Frontend/
│   ├── public/                            # Static files
│   └── src/
│       ├── api/                           # API calls
│       ├── components/                    # React components
│       ├── context/                       # App state management
│       ├── pages/                         # Page components
│       └── types/                         # TypeScript type definitions
└── TestData/                              # Test data files and documentation
```

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v16 or later)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express LocalDB)

### Quick Start

The fastest way to get started is using the provided scripts:

1. **Set up the database and start the application**:
   ```
   start_app.bat
   ```
   This script will start the backend API, check that it's running correctly, and then start the frontend.

2. **If you encounter database issues**, reset the database:
   ```
   reset_database.bat
   ```
   This will drop the existing database and recreate it with migrations and seed data.

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd CTS/Backend/ContainerTrackingSystem.API
   ```

2. Update the connection string in `appsettings.json` or `appsettings.Development.json` to point to your SQL Server instance.

3. Apply database migrations:
   ```
   dotnet ef database update
   ```

4. Run the backend:
   ```
   dotnet run
   ```

The API will be available at https://localhost:7243 with Swagger UI at https://localhost:7243/swagger.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd CTS/Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be available at http://localhost:3000.

## Testing the Application

### Using Test Data

The application includes built-in test data that will be automatically seeded when you first run the API. This includes:

- 5 Shiplines with tracking links
- 5 Vessel Lines with tracking links
- 5 Vessels
- 5 Ports
- 5 Terminals with tracking links
- Various dropdown options (statuses, container sizes, etc.)
- 50 containers with various statuses and data

For more details on the test data, see `TestData/README.md`.

### Testing Features

1. **Container Management**:
   - View the containers table and try filtering by status
   - Use the search box to find containers by number, project, etc.
   - Try inline editing by clicking on cell values
   - Add a new container using the "Add Container" button

2. **Bulk Operations**:
   - Select multiple containers using the checkboxes
   - Try the "Bulk Edit" to update fields for all selected containers
   - Try "Delete Selected" to remove multiple containers at once

3. **Column Visibility**:
   - Click the "Columns" button to show/hide table columns
   - Toggle various columns and check that the table updates

4. **CSV Import**:
   - Use the "Import CSV" button
   - Select the provided `TestData/test_containers.csv` file
   - Map the columns and import the data

5. **Tracking Links**:
   - Find a container with a shipline or terminal that has a tracking link
   - Click the link icon to verify it opens the external tracking system

## Troubleshooting

If you encounter issues while running the application, please see the `TROUBLESHOOTING.md` file for common problems and solutions.

## Features

### Container Management
- Data table with inline editing capability for all fields
- Modal forms for detailed container editing/creation
- Status-based filtering views (Not Sailed, On Vessel, Rail, Returned, etc.)
- Bulk operations (edit, delete multiple containers)

### Dropdown Management
- Cascading dropdowns (e.g., Port selection filters available Terminals)
- Pre-populated option lists for standard fields (status, container size, etc.)
- Dynamic management of dropdown options

### Dynamic Link Generation
- Generate links to carrier/shipline tracking websites
- Support for customizable link templates with variable substitution
- Ability to mark links as dynamic (with container/voyage substitution)

### Data Entry Features
- Inline editing with keyboard navigation
- Bulk CSV import functionality
- Smart date handling (auto-completing partial dates)
- Conditional form fields (e.g., rail fields disabled when Rail is "No")

## License

This project is licensed under the MIT License - see the LICENSE file for details.