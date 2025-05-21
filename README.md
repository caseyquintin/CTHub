**CTHub: Container Tracking Hub**

**Frontend**

-   **HTML5 + Bootstrap 5.3** for responsive layout and modal components
-   **jQuery 3.7.0** for DOM manipulation and AJAX requests
-   **DataTables.net** for dynamic, editable, scrollable data tables with:

-   Inline editing
-   Column visibility controls
-   Fixed headers
-   Scroller + buttons extensions

-   **Flatpickr** for modern date pickers in inline-editable cells
-   **Dynamic dropdowns** (e.g., Port of Entry > Terminal, Vessel Line > Vessel Name) populated via AJAX

**Frontend Logic Highlights**

-   Inline editable cells update via PATCH API calls
-   Dropdowns (status, ports, terminals) load from backend
-   Terminals are filtered based on selected PortID
-   Smart layout persistence (column visibility, scroll, etc.)
-   Custom toast notifications for user feedback
-   Ten second delay undo feature for container deletion

* * * * *

**Backend**

-   **ASP.NET Core Web API**
-   Controllers built using [ApiController] and [Route("api/...")]
-   **C#** used for building endpoints (e.g., PortsController.cs, OptionsController.cs, ContainerController.cs, TerminalsController.cs, VesselController.cs)
-   **SQL Server** for database with structure from CTHubDB.sql

-   Key Tables:

-   Containers -- core data model [includes ContainerID (PK), ShiplineID (FK), TerminalID (FK), VesselLineID (FK), VesselID (FK), PortID (FK), CarrierID (PK), FpmID (FK)]
-   Ports -- PortID (PK) + PortOfEntry
-   Terminals -- TerminalID (PK), Terminal, LookupType, Link, PortID (FK)
-   VesselLines -- VesselLine, Link, VesselLineID (PK)
-   Vessels -- VesselLine, IMO, MMSI, VesselName, VesselID, VesselLineID (FK)
-   Shiplines -- Shipline, Link, ShiplineID (PK)
-   FPMs -- FpmID (PK), Fpm, Active
-   DropdownOptions -- Id (PK), Category, Value, IsActive, SortOrder [Categories include ActualOrEstimate, ContainerSize, Boolean, MainSource, Status] - Meant for simple dropdown options.

-   **Dapper or ADO.NET** style SqlCommand usage (no Entity Framework here)
-   **Swagger UI** (for interactive API docs)

-   Accessible at: `http://localhost:5062/swagger`
-   Powered by: Swashbuckle.AspNetCore

-   Endpoints include:

-   /api/containers
-   /api/ports
-   /api/terminals/by-port/{portId}

* * * * *

**App Behavior**

-   Multiple-page admin dashboard with modals and full table controls
-   Supports bulk edit, delete, column selection
-   Designed for high usability
-   by logistics/admin staff

* * * * *

**File Tree**

DataEntryAPI
 ┣ Controllers
 ┃ ┣ CarriersController.cs
 ┃ ┣ ContainerController.cs
 ┃ ┣ FPMsController.cs
 ┃ ┣ OptionsController.cs
 ┃ ┣ PortsController.cs
 ┃ ┣ ShiplinesController.cs
 ┃ ┣ TerminalsController.cs
 ┃ ┗ VesselsController.cs
 ┣ DTOs
 ┃ ┣ FieldUpdateDto.cs
 ┃ ┗ VesselLineDto.cs
 ┣ Models
 ┃ ┣ Container.cs
 ┃ ┣ FPMs.cs
 ┃ ┣ Ports.cs
 ┃ ┣ Shiplines.cs
 ┃ ┣ Terminal.cs
 ┃ ┣ Vessel.cs
 ┃ ┗ VesselLine.cs
 ┣ Properties
 ┃ ┗ launchSettings.json
 ┣ wwwroot
 ┃ ┣ assets
 ┃ ┃ ┣ AuditLogistics_LOGO.png
 ┃ ┃ ┣ AuditLogistics_LOGO_invert.png
 ┃ ┃ ┣ AuditLogistics_LOGO_simple.png
 ┃ ┃ ┗ favicon.ico
 ┃ ┣ css
 ┃ ┃ ┗ styles.css
 ┃ ┣ js
 ┃ ┃ ┣ modules
 ┃ ┃ ┃ ┣ bulkDelete.js
 ┃ ┃ ┃ ┣ bulkEditingModal.js
 ┃ ┃ ┃ ┣ columnChooser.js
 ┃ ┃ ┃ ┣ inlineEditingHandler.js
 ┃ ┃ ┃ ┣ newContainerModal.js
 ┃ ┃ ┃ ┣ singleDelete.js
 ┃ ┃ ┃ ┗ singleEditingModal.js
 ┃ ┃ ┣ versions
 ┃ ┃ ┃ ┣ scripts v1.0 - Port of Entry and Terminal DDs Working.js (4/16/2025)
 ┃ ┃ ┃ ┣ scripts v2.0 - Inline tabbing works.js (4/17/2025)
 ┃ ┃ ┃ ┣ scripts v3.0 - 1-2 plus cascading dropdowns.js (4/24/2025)
 ┃ ┃ ┃ ┣ scripts v4.0 - 1-3 plus new container modal is modularized.js (4/27/2025)
 ┃ ┃ ┃ ┣ scripts v5.0 - 1-4 plus inline editing is modularized.js (4/28/2025)
 ┃ ┃ ┃ ┣ scripts v6.0 - 1-5 plus all of those modals etc are modularized.js (4/28/2025)
 ┃ ┃ ┃ ┗ scripts v7.0 - 1-6 plus modals mostly functional fullscreen vertical scroll.js (5/1/2025)
 ┃ ┃ ┗ scripts.js
 ┃ ┣ libs
 ┃ ┃ ┣ bootstrap
 ┃ ┃ ┣ datatables
 ┃ ┃ ┃ ┣ css
 ┃ ┃ ┃ ┃ ┣ datatables.css
 ┃ ┃ ┃ ┃ ┗ datatables.min.css
 ┃ ┃ ┃ ┣ datatables.js
 ┃ ┃ ┃ ┗ datatables.min.js
 ┃ ┃ ┗ flatpickr
 ┃ ┃ ┃ ┣ flatpickr.min.css
 ┃ ┃ ┃ ┗ flatpickr.min.js
 ┃ ┣ index v1.0 - Edits and Deletes are working - Bulk and Single.html (4/8/2025)
 ┃ ┣ index v2.0 - Edits Deletes New are working.html (4/9/2025)
 ┃ ┣ index.html
 ┃ ┣ notsailed.html
 ┃ ┣ onvessel-arrived.html
 ┃ ┣ onvessel-notarrived.html
 ┃ ┣ rail.html
 ┃ ┣ returned.html
 ┃ ┣ settopickup.html
 ┃ ┗ settoreturn.html
 ┣ .gitignore
 ┣ appsettings.Development.json
 ┣ appsettings.json
 ┣ DataContext.cs
 ┣ DataEntryAPI.csproj
 ┣ DataEntryAPI.http
 ┣ DataEntryAPI.sln
 ┣ FileStructure.txt
 ┣ package-lock.json
 ┣ package.json
 ┗ Program.cs
 
* * * * *
 
⏲️🛠️**Short Term Development Goals**🛠️⏲️
 ✅ Configure initial system using tech stack noted above (started 3/21/2025, completed 4/25/2025)
 ✅ Set default Last Updated date to current when container is created or edited.
    ✅ Inline (5/10/2025)
    ✅ New Container (5/11/2025)
    ✅ Single Edit (5/11/2025)
    ✅ Bulk Edit (5/11/2025)
    ✅ Blank Line (5/10/2025)  
 ✅ Basic link generation for SSLs, Vessel Owners and Terminals (started 5/12/2025, completed 5/12/2025)
 ⏹️ Color coding for Actual/Estimate, Current Status and Main Source
 ✅ Make Search function more robust (5/10/2025)
 ⏹️ Filter table by status using pages and show only relevant columns
    ✅ All Active Containers
    ⏹️ Not Sailed
    ⏹️ On Vessel (Arrived)
    ⏹️ On Vessel (Not Arrived)
    ⏹️ Rail
    ⏹️ Set To Return
    ⏹️ Set To Pick Up
    ⏹️ Returned (1 year)
 ✅ Bulk Upload feature (.csv now, .xls/.xlsx later) (5/13/2025)
    
 ***New Container Modal***
 ⏹️ Add multiple containers with the same information
 ⏹️ Disable Rail fields when Rail is set to "No"

  ***Single Edit Modal***
 ⏹️ Disable Rail fields when Rail is set to "No"
 
 ***Bulk Edit Modal***
 ⏹️ Remove non-essential or unhelpful fields
    ✅Shipment #
 ⏹️ Disable Rail fields when Rail is set to "No"
 
 ***Inline***
 ✅ Disable Rail fields when Rail is set to "No"
 ✅ Dates should be able to be entered as 5/12 instead of 5/12/2025 (autocomplete year) [Single Edit does this already] (5/9/2025)
 ✅ Allow more mobility in Inline Editor (move up or down a row using keyboard)

 ***Search Function***
 ✅ Make Search function more robust (5/9/2025)

* * * * *

⏳🛠️**Long Term Development Goals**🛠️⏳
⏹️ Intelligent Vessel Tracking Integration
   ⏹️ Implement direct integration with shipping line websites via vessel codes/voyage #s
   ⏹️ Enable one-click access to vessel schedules
   ⏹️ Support automated form submission for sites like HMM that require additional steps
   ⏹️ Create configurable link templates for different shipping lines
⏹️ Intelligent Container Status Lookup
   ⏹️ Implement direct integration with shipping line tracking systems
   ⏹️ Enable one-click access to container status from shipment records  
   ⏹️ Support automated lookup for container numbers per shipline
   ⏹️ Create configurable tracking URL templates for different shipping lines
⏹️ Contextual Terminal Lookup System
   ⏹️ Implement terminal lookup type selector (Availability/Vessel Schedule/General)
   ⏹️ Split terminal lookup types into separate database field (LookupType with Availability, Vessel Schedule and General as options)
   ⏹️ Create dynamic link generation based on terminal + lookup type combination
   ⏹️ Enable user-driven selection of appropriate terminal interfaces
⏹️ Role restrictions by User Profile definitions set in ALOT
⏹️ Container Notes Timeline - Changes in dates/information by Container ID
⏹️ Integrate with ALOT
   ⏹️ SN/DN system
   ⏹️ Internal Notes generation and application to shipments
⏹️ Container Tracking Report generation (Power Automate)

* * * * *

🪲**Current Bugs**🪲

***General***
⏹️ Fix missing horizontal scrollbar.

***New Container Modal***
✅ Actual/Estimate dropdowns are using boolean. (5/9/2025)
 
***Inline***
✅ Date pickers don't work. (5/9/2025)
✅ When typing into DDs w/IDs attached the first option with that letter is picked and the next cell is selected. (5/9/2025)
❓ Cascading DDs are still malfunctioning if changed too quickly // seems to be working okay as of 5/10
✅ Newly added rows stay yellow/orange until refresh - should go to normal as soon as a different row is selected. (5/10/2025)
✅ Allow for blank fields to be tabbed through without setting values. (5/12/2025)
 
***Single Edit***
✅ If field is cleared, old value remains instead of being submitted as NULL. (5/9/2025)

***Single Delete***
✅ Error when trying to delete newly created Blank Row without a Container Number attributed (Bulk Delete works!): (5/10/2025)
       
***Bulk Delete***

***Single and Bulk Delete Modal Windows***
✅ Debug Single Delete modal window (5/8/2025)
✅ Debug Bulk Delete modal window (5/8/2025)
 
***Search Function***
✅ Debug (5/9/2025)

* * * * *

## 🆕 Modern CTS Implementation - Additional Documentation

### CTS (Container Tracking System) - Modern React/TypeScript Implementation

This project also includes a modern reimplementation using React TypeScript frontend with ASP.NET Core 9.0 + Entity Framework backend, developed alongside the original CTHub system.

**CTS Backend (.NET Core 9.0)**
- **API**: ASP.NET Core Web API with Entity Framework Core
- **Database**: SQL Server (CTHUB instance on LT-QUINTIN2)
- **Projects**:
  - `ContainerTrackingSystem.API` - Controllers, configuration, Swagger
  - `ContainerTrackingSystem.Core` - Domain models and interfaces 
  - `ContainerTrackingSystem.Data` - DbContext, repositories, migrations

**CTS Frontend (React + TypeScript)**
- **Framework**: React 18.2.0 with TypeScript 4.9.5
- **UI**: Tailwind CSS with Headless UI components
- **State**: React Context API
- **Key Libraries**: 
  - React Table 7.8.0 for data grids
  - Formik + Yup for forms/validation
  - React Router for navigation
  - Axios for API calls
  - React DatePicker for date inputs
  - PapaParse for CSV import

### CTS Development Environment

**Database Configuration**
- **Server**: LT-QUINTIN2\CTHUB
- **Database**: ContainerTrackingSystem
- **Connection**: Encrypted with trusted certificate
- **User**: api_user with proper permissions

**Backend Configuration**
- **Port**: https://localhost:7243 (with Swagger at /swagger)
- **CORS**: Configured for frontend integration
- **Development Seeding**: Automatic test data population

**Frontend Configuration**  
- **Port**: http://localhost:3000
- **API URL**: Configurable for different environments
- **Build**: React Scripts 5.0.1

### CTS Development Commands

**Backend**
```bash
cd CTS/Backend/ContainerTrackingSystem.API
dotnet run                    # Start API
dotnet ef database update     # Apply migrations
```

**Frontend**  
```bash
cd CTS/Frontend
npm start                     # Start development server
npm test                      # Run test suite
npm run build                 # Production build
```

### CTS Automation Scripts
- `start_app.bat` - Complete application startup
- `reset_database.bat` - Database reset with fresh migrations
- `start_separate.bat` - Backend and frontend separately

### CTS Completed Milestones

- **Initial Project Setup** - May 19, 2025
  - Created .NET Core 9.0 backend with Entity Framework
  - Established database schema with initial migration
  - Set up React TypeScript frontend with Tailwind CSS

- **Core CRUD Operations** - May 20, 2025  
  - Implemented container management with full CRUD
  - Added React Table integration with inline editing
  - Completed modal forms with validation
  - Column mapping updates migration applied

- **Dropdown System Implementation** - May 21, 2025
  - Fixed Status column to use DropdownOptions table (ContainerStatus category)
  - Container Size and Rail fields use proper dropdown options
  - Inline editing supports dropdown selection for standardized fields
  - Database query: `SELECT * FROM DropdownOptions WHERE Category = 'ContainerStatus'`
  - **Connection String Override Issue Resolved** - Fixed Program.cs, DesignTimeDbContextFactory, and TestController to use "CTHubConnection" instead of "DefaultConnection"

### CTS Current Test Status
- **Database Connection**: ✅ CTHUB connection working
- **Data Loading**: ✅ 100 containers per page, 1442 total
- **API Response Format**: ✅ Proper PascalCase mapping
- **Basic CRUD**: ✅ Create, Read, Update, Delete operations
- **Status Filtering**: ✅ All status categories working
- **Form Validation**: ✅ Container number validation (min 4 chars)

### CTS Testing Infrastructure
- Comprehensive test checklist in Frontend/TESTING-CHECKLIST.md
- Unit tests for utilities and components
- Integration tests for container management
- Manual testing scenarios documented
- Test data seeding (50 containers, 5 ports, 5 terminals, etc.)

### CTS Future Milestones
- [ ] **Performance Optimization** - TBD
  - Implement pagination improvements for 10k+ containers
  - Add API caching and rate limiting
  - Optimize frontend bundle size

- [ ] **Advanced Reporting** - TBD
  - Container status analytics dashboard
  - Export functionality for reports
  - Custom date range filtering

- [ ] **Enterprise Features** - TBD
  - User authentication and role-based access
  - Audit logging for data changes
  - Multi-tenant support

### CTS Database Schema Improvements
Recent migrations include:
- `20250519155253_InitialCreate` - Initial database structure
- `20250520191500_UpdateColumnMappings` - Column mapping updates

**Enhanced Data Model Features**:
- Property name consistency (BOLBookingNumber, PONumber, etc.)
- Foreign key relationships for related entities
- Comprehensive date tracking fields
- Rail-specific field conditional logic

### System Architecture Comparison

| Feature | CTHub (Original) | CTS (Modern) |
|---------|------------------|--------------|
| Frontend | HTML5/Bootstrap/jQuery | React/TypeScript/Tailwind |
| Backend | ASP.NET Core + Dapper | ASP.NET Core + Entity Framework |
| Database Access | Direct SQL commands | Code-first migrations |
| Port | 5062 | 7243 (API) + 3000 (Frontend) |
| Status | Production Ready | Development/Testing |

**Note**: Both systems share the same database schema and core container tracking functionality, with CTS providing a modern development foundation for future enhancements.

### CTS File Tree

```
📁 CTS-Claude/
├── 📄 CLAUDE.md                           # Project instructions and status
├── 📄 README.md                           # Main project documentation
├── 📄 ContainerTrackingSystem.sln         # Visual Studio solution file
├── 📁 CTHub/                              # Reference documentation
│   └── 📄 README.md
├── 📁 CTS/                                # Main Container Tracking System
│   ├── 📄 README.md                       # CTS documentation
│   ├── 📄 TROUBLESHOOTING.md              # Troubleshooting guide
│   ├── 📁 Backend/                        # .NET Core 9.0 Backend
│   │   ├── 📁 ContainerTrackingSystem.API/
│   │   │   ├── 📄 ContainerTrackingSystem.API.csproj
│   │   │   ├── 📄 Program.cs              # Application entry point
│   │   │   ├── 📄 DesignTimeDbContextFactory.cs
│   │   │   ├── 📄 TestConnection.cs       # Database connection testing
│   │   │   ├── 📄 appsettings.json        # Production configuration
│   │   │   ├── 📄 appsettings.Development.json # Development config
│   │   │   ├── 📄 containers.db           # SQLite database file
│   │   │   ├── 📁 Controllers/            # API Controllers
│   │   │   │   ├── 📄 ContainersController.cs
│   │   │   │   ├── 📄 DropdownOptionsController.cs
│   │   │   │   └── 📄 TestController.cs
│   │   │   ├── 📁 Properties/
│   │   │   │   └── 📄 launchSettings.json # Development server settings
│   │   │   ├── 📁 bin/                    # Compiled binaries
│   │   │   └── 📁 obj/                    # Build intermediate files
│   │   ├── 📁 ContainerTrackingSystem.Core/
│   │   │   ├── 📄 ContainerTrackingSystem.Core.csproj
│   │   │   ├── 📄 Class1.cs
│   │   │   ├── 📁 Interfaces/             # Repository interfaces
│   │   │   │   ├── 📄 IRepository.cs
│   │   │   │   └── 📄 IUnitOfWork.cs
│   │   │   ├── 📁 Models/                 # Domain models
│   │   │   │   ├── 📄 Container.cs        # Main container entity
│   │   │   │   ├── 📄 ContainerFilterRequest.cs
│   │   │   │   ├── 📄 DropdownOption.cs
│   │   │   │   ├── 📄 Fpm.cs
│   │   │   │   ├── 📄 Port.cs
│   │   │   │   ├── 📄 Shipline.cs
│   │   │   │   ├── 📄 Terminal.cs
│   │   │   │   ├── 📄 Vessel.cs
│   │   │   │   └── 📄 VesselLine.cs
│   │   │   ├── 📁 bin/
│   │   │   └── 📁 obj/
│   │   └── 📁 ContainerTrackingSystem.Data/
│   │       ├── 📄 ContainerTrackingSystem.Data.csproj
│   │       ├── 📄 ApplicationDbContext.cs  # Entity Framework DbContext
│   │       ├── 📄 Class1.cs
│   │       ├── 📄 DesignTimeDbContextFactory.cs
│   │       ├── 📄 SeedData.cs              # Database seeding
│   │       ├── 📄 UnitOfWork.cs            # Unit of Work pattern
│   │       ├── 📁 Migrations/              # EF Core migrations
│   │       │   ├── 📄 20250519155253_InitialCreate.cs
│   │       │   ├── 📄 20250519155253_InitialCreate.Designer.cs
│   │       │   ├── 📄 20250520191500_UpdateColumnMappings.cs
│   │       │   ├── 📄 20250520191500_UpdateColumnMappings.Designer.cs
│   │       │   └── 📄 ApplicationDbContextModelSnapshot.cs
│   │       ├── 📁 Repositories/            # Data access implementations
│   │       │   └── 📄 Repository.cs
│   │       ├── 📁 bin/
│   │       └── 📁 obj/
│   ├── 📁 Frontend/                        # React TypeScript Frontend
│   │   ├── 📄 package.json                # NPM dependencies & scripts
│   │   ├── 📄 package-lock.json           # Locked dependency versions
│   │   ├── 📄 tsconfig.json               # TypeScript configuration
│   │   ├── 📄 tailwind.config.js          # Tailwind CSS configuration
│   │   ├── 📄 postcss.config.js           # PostCSS configuration
│   │   ├── 📄 TESTING-CHECKLIST.md        # Test documentation
│   │   ├── 📄 db.json                     # Mock data for testing
│   │   ├── 📄 routes.json                 # Mock API routes
│   │   ├── 📄 mock-server.js              # JSON Server mock API
│   │   ├── 📄 server.js                   # Development server
│   │   ├── 📄 test-api-manual.js          # Manual API testing
│   │   ├── 📁 public/                     # Static assets
│   │   │   ├── 📄 index.html              # Main HTML template
│   │   │   ├── 📄 favicon.ico
│   │   │   ├── 📄 manifest.json
│   │   │   └── 📄 robots.txt
│   │   ├── 📁 src/                        # Source code
│   │   │   ├── 📄 index.tsx               # Application entry point
│   │   │   ├── 📄 index.css               # Global styles
│   │   │   ├── 📄 App.tsx                 # Main App component
│   │   │   ├── 📄 App2.tsx                # Alternative App component
│   │   │   ├── 📄 setupTests.ts           # Jest test setup
│   │   │   ├── 📄 reportWebVitals.ts      # Performance monitoring
│   │   │   ├── 📄 reportWebVitals2.ts
│   │   │   ├── 📄 react-app-env.d.ts      # React type definitions
│   │   │   ├── 📁 components/             # React components
│   │   │   │   ├── 📄 AdvancedSearchModal.tsx
│   │   │   │   ├── 📄 BulkEditModal.tsx
│   │   │   │   ├── 📄 ColumnVisibilityModal.tsx
│   │   │   │   ├── 📄 ContainerFormModal.tsx
│   │   │   │   ├── 📄 ContainerTable.tsx   # Main data table component
│   │   │   │   ├── 📄 CsvImportModal.tsx
│   │   │   │   ├── 📄 FilterPresetsModal.tsx
│   │   │   │   ├── 📄 InlineEditCell.tsx   # Inline editing component
│   │   │   │   ├── 📄 Layout.tsx
│   │   │   │   ├── 📄 Pagination.tsx
│   │   │   │   └── 📁 __tests__/          # Component tests
│   │   │   │       ├── 📄 ContainerFormModal.test.tsx
│   │   │   │       └── 📄 ContainerTable.test.tsx
│   │   │   ├── 📁 pages/                  # Page components
│   │   │   │   └── 📄 ContainersPage.tsx  # Main containers page
│   │   │   ├── 📁 context/                # React Context API
│   │   │   │   └── 📄 AppContext.tsx      # Application state management
│   │   │   ├── 📁 api/                    # API layer
│   │   │   │   ├── 📄 index.ts            # Main API functions
│   │   │   │   ├── 📄 index.ts.bak        # Backup API file
│   │   │   │   ├── 📄 advancedApi.ts      # Advanced API operations
│   │   │   │   └── 📁 __tests__/          # API tests
│   │   │   │       ├── 📄 index.test.ts
│   │   │   │       └── 📄 simple.test.ts
│   │   │   ├── 📁 types/                  # TypeScript type definitions
│   │   │   │   └── 📄 index.ts            # Main type definitions
│   │   │   ├── 📁 utils/                  # Utility functions
│   │   │   │   ├── 📄 filterUtils.ts      # Data filtering utilities
│   │   │   │   ├── 📄 linkGenerator.ts    # External link generation
│   │   │   │   └── 📁 __tests__/          # Utility tests
│   │   │   │       ├── 📄 filterUtils.test.ts
│   │   │   │       └── 📄 linkGenerator.test.ts
│   │   │   └── 📁 __tests__/              # Main test directory
│   │   │       ├── 📄 README.md           # Test documentation
│   │   │       ├── 📄 basic.test.ts       # Basic functionality tests
│   │   │       ├── 📄 utils-simple.test.ts
│   │   │       ├── 📁 integration/        # Integration tests
│   │   │       │   └── 📄 ContainerManagement.test.tsx
│   │   │       └── 📁 utils/              # Test utilities
│   │   │           ├── 📄 mockData.ts     # Mock data for tests
│   │   │           └── 📄 testUtils.tsx   # Test helper functions
│   │   ├── 📁 build/                      # Production build output
│   │   └── 📁 node_modules/               # NPM dependencies (1000+ packages)
│   ├── 📁 DebugLogs/                      # Application debug logs
│   │   ├── 📄 Backend-Debug.txt
│   │   ├── 📄 DevConsole-Debug.txt
│   │   └── 📄 Frontend-Debug.txt
│   ├── 📁 TestData/                       # Test data files
│   │   ├── 📄 README.md
│   │   └── 📄 test_containers.csv         # Sample container data
│   └── 📄 [Automation Scripts]            # Batch automation scripts
│       ├── 📄 check_cert_issues.bat
│       ├── 📄 debug_connections.bat
│       ├── 📄 debug_database.bat
│       ├── 📄 fix_connections.bat
│       ├── 📄 fix_frontend.bat
│       ├── 📄 reset_database.bat
│       ├── 📄 run_application.bat
│       ├── 📄 simple_checker.bat
│       ├── 📄 simple_fix.bat
│       ├── 📄 start_app.bat               # Complete app startup
│       ├── 📄 start_for_testing.bat
│       ├── 📄 start_separate.bat          # Backend/Frontend separately
│       └── 📄 switch_to_http.bat
└── 📄 [Setup Scripts]                     # Development setup scripts
    ├── 📄 add_ef_packages.ps1             # Entity Framework setup
    ├── 📄 copy_model_files.ps1            # Model file management
    ├── 📄 create_database.sql             # Database creation script
    ├── 📄 create_database_lt_quintin2.sql # LT-QUINTIN2 specific setup
    ├── 📄 create_projects.ps1             # Project structure setup
    ├── 📄 dotnet-install.sh               # .NET installation (Linux)
    ├── 📄 run_ef_migration.ps1            # Entity Framework migrations
    ├── 📄 setup_backend_manual.ps1        # Manual backend setup
    ├── 📄 setup_dotnet.sh                 # .NET setup (Linux)
    ├── 📄 setup_frontend.sh               # Frontend setup (Linux)
    ├── 📄 setup_frontend_fixed.ps1        # Fixed frontend setup
    ├── 📄 setup_windows.ps1               # Windows environment setup
    └── 📄 update_typescript_version.ps1   # TypeScript version management
```

* * * * *

⏲️🛠️**CTS Short Term Development Goals**🛠️⏲️

***Frontend Enhancements***
⏹️ Implement color coding system for visual data classification
   ⏹️ Status-based color indicators (Not Sailed, On Vessel, Rail, etc.)
   ⏹️ Actual/Estimate visual differentiation 
   ⏹️ Main Source highlighting
⏹️ Complete status-specific page implementations
   ⏹️ Not Sailed containers view
   ⏹️ On Vessel (Arrived/Not Arrived) views
   ⏹️ Rail-specific container tracking
   ⏹️ Set To Return/Pick Up views
   ⏹️ Returned containers (1 year history)
⏹️ Enhanced form validation and user experience
   ⏹️ Container number format validation improvements
   ⏹️ Date range validation for shipment dates
   ⏹️ Required field enforcement with clear user feedback
⏹️ Advanced search functionality enhancements
   ⏹️ Saved search presets
   ⏹️ Complex multi-field search combinations
   ⏹️ Search result highlighting

***Backend API Improvements***
⏹️ Performance optimization for large datasets
   ⏹️ Server-side pagination optimization (10K+ containers)
   ⏹️ Database query optimization with proper indexing
   ⏹️ Response caching for dropdown data
⏹️ Advanced filtering API endpoints
   ⏹️ Complex date range filtering
   ⏹️ Multi-status combination filtering
   ⏹️ Custom field sorting and ordering
⏹️ Data validation and business rules
   ⏹️ Server-side validation for all container fields
   ⏹️ Business rule enforcement (Rail field dependencies)
   ⏹️ Duplicate container number prevention

***Testing & Quality Assurance***
⏹️ Expand test coverage to 80%+ across all components
⏹️ End-to-end testing implementation with Cypress
⏹️ Performance testing for large dataset operations
⏹️ Cross-browser compatibility testing (Chrome, Firefox, Edge)
⏹️ Mobile responsiveness improvements and testing

***Integration & External Links***
⏹️ Enhanced external tracking system integration
   ⏹️ Automated link validation for carrier websites
   ⏹️ Template management for tracking URL patterns
   ⏹️ Error handling for broken external links
⏹️ CSV/Excel import improvements
   ⏹️ Advanced error reporting for import failures
   ⏹️ Bulk validation with detailed feedback
   ⏹️ Progress indicators for large file imports

* * * * *

⏳🛠️**CTS Long Term Development Goals**🛠️⏳

***Enterprise Features***
⏹️ User Authentication & Authorization System
   ⏹️ JWT-based authentication with role management
   ⏹️ User profile management with permissions
   ⏹️ Activity logging and audit trails
   ⏹️ Multi-tenant support for different organizations
⏹️ Advanced Reporting & Analytics
   ⏹️ Real-time dashboard with KPI metrics
   ⏹️ Custom report builder with drag-and-drop interface
   ⏹️ Automated report generation and email delivery
   ⏹️ Data visualization with charts and graphs
   ⏹️ Export capabilities (PDF, Excel, CSV)

***Integration & Automation***
⏹️ ALOT (Audit Logistics) System Integration
   ⏹️ Shipment Number (SN) / Delivery Number (DN) system sync
   ⏹️ Internal notes generation and application
   ⏹️ Automated workflow triggers based on container status
⏹️ Power Automate Integration
   ⏹️ Container tracking report automation
   ⏹️ Email notifications for status changes
   ⏹️ Scheduled data synchronization
⏹️ External API Integrations
   ⏹️ Real-time vessel tracking APIs
   ⏹️ Port authority system connections
   ⏹️ Shipping line direct data feeds

***Advanced Container Tracking***
⏹️ Intelligent Status Prediction
   ⏹️ ML-based arrival time prediction
   ⏹️ Delay detection and alert system
   ⏹️ Historical pattern analysis
⏹️ Real-time Notifications
   ⏹️ WebSocket-based live updates
   ⏹️ Push notifications for mobile devices
   ⏹️ Configurable alert thresholds
⏹️ Container Journey Timeline
   ⏹️ Visual timeline of container movement
   ⏹️ Historical change tracking with timestamps
   ⏹️ Photo and document attachments

***Platform & Infrastructure***
⏹️ Microservices Architecture Migration
   ⏹️ Service decomposition for scalability
   ⏹️ API Gateway implementation
   ⏹️ Container orchestration with Docker/Kubernetes
⏹️ Cloud Deployment & Scaling
   ⏹️ Azure/AWS deployment configurations
   ⏹️ Auto-scaling based on load
   ⏹️ Database clustering and replication
⏹️ Mobile Application Development
   ⏹️ React Native mobile app
   ⏹️ Offline capability with data synchronization
   ⏹️ Barcode/QR code scanning integration

* * * * *

🪲**CTS Current Bugs**🪲

***Frontend Issues***
⏹️ **React Table Performance**
   ⏹️ Slow rendering with 1000+ rows in single page view
   ⏹️ Memory usage increases during extended table interactions
   ⏹️ Column resizing occasionally causes layout shifts

***API & Backend Issues***
⏹️ **Database Connection Handling**
   ⏹️ Intermittent connection drops during high load testing
   ⏹️ Entity Framework query timeout on complex joins
   ⏹️ Migration rollback issues in development environment

***General System Issues***
⏹️ **Cross-browser Compatibility**
   ⏹️ Date picker styling inconsistencies in Firefox
   ⏹️ Table horizontal scrolling behavior varies by browser
   ⏹️ Modal positioning issues on smaller screens
⏹️ **Error Handling & User Experience**
   ⏹️ Generic error messages don't provide actionable feedback
   ⏹️ Network timeout handling needs user-friendly messaging
   ⏹️ Form validation errors sometimes persist after correction

***Development & Testing Issues***
⏹️ **Test Environment Stability**
   ⏹️ Mock server occasionally fails to start with npm test
   ⏹️ Integration tests need better cleanup between test runs
   ⏹️ TypeScript compilation warnings in test files
⏹️ **Build & Deployment**
   ⏹️ Production build bundle size optimization needed
   ⏹️ Automation scripts need error handling improvements
   ⏹️ Development server hot reload sometimes fails on file changes

***Data Integrity Issues***
⏹️ **Validation & Business Rules**
   ⏹️ Rail field conditional logic needs server-side enforcement
   ⏹️ Container number uniqueness check has race condition potential
   ⏹️ Date range validation allows impossible date combinations

Note: Priority should be given to performance and data integrity issues that affect production functionality.
