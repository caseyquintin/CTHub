# Container Tracking System - Test Suite

This directory contains comprehensive tests for the Container Tracking System frontend application.

## Test Structure

```
src/__tests__/
├── README.md                                   # This file
├── setup.ts                                    # Jest setup and global mocks
├── utils/
│   ├── mockData.ts                             # Mock data for tests
│   └── testUtils.tsx                           # Custom render functions and utilities
└── integration/
    └── ContainerManagement.test.tsx            # End-to-end workflow tests

src/api/__tests__/
└── index.test.ts                               # API layer tests

src/components/__tests__/
├── ContainerTable.test.tsx                     # Container table component tests
└── ContainerFormModal.test.tsx                 # Form modal component tests

src/utils/__tests__/
├── filterUtils.test.ts                         # Filter utility function tests
└── linkGenerator.test.ts                       # Link generation utility tests
```

## Test Categories

### 1. Unit Tests
- **API Functions** (`src/api/__tests__/`): Test all API calls, error handling, and data transformation
- **Utility Functions** (`src/utils/__tests__/`): Test filtering, link generation, and helper functions
- **Components** (`src/components/__tests__/`): Test individual React components in isolation

### 2. Integration Tests
- **User Workflows** (`src/__tests__/integration/`): Test complete user journeys and component interactions

## Mock Data

The test suite uses comprehensive mock data that mirrors the CTHUB database structure:

- **mockContainer**: Single container with all properties populated
- **mockContainers**: Array of containers with different statuses and properties
- **mockApiResponse**: Paginated API response format from backend
- **mockDropdownOptions**: Dropdown/select options for forms
- **Reference Data**: Ports, terminals, shiplines, vessel lines, vessels

## Test Utilities

### Custom Render Function
The `render` function from `testUtils.tsx` automatically wraps components with necessary providers:
- React Router (BrowserRouter)
- Application Context (AppProvider)
- Toast notifications (ToastContainer)

### Helper Functions
- `createMockApiResponse()`: Generate paginated API responses
- `createAxiosMock()`: Mock axios HTTP client
- `waitForLoadingToFinish()`: Wait for async operations
- `createFormEvent()` / `createSelectEvent()`: Generate form events

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage --watchAll=false
```

### Run Specific Test Files
```bash
# API tests only
npm test -- api/__tests__

# Component tests only
npm test -- components/__tests__

# Integration tests only
npm test -- integration

# Specific test file
npm test -- ContainerTable.test.tsx
```

## Test Coverage Goals

The test suite aims for:
- **80%+ Overall Coverage**: Statements, branches, functions, and lines
- **90%+ API Layer Coverage**: All endpoints and error scenarios
- **75%+ Component Coverage**: Key user interactions and edge cases
- **100% Utility Function Coverage**: Pure functions with predictable outputs

## Mocking Strategy

### External Dependencies
- **axios**: Mocked for all HTTP requests
- **react-table**: Mocked to simplify table rendering in tests
- **react-router**: Provided via custom render wrapper
- **Browser APIs**: Mocked (matchMedia, IntersectionObserver, ResizeObserver)

### Internal Components
- **API calls**: Mocked at module level for consistent behavior
- **Context**: Provided via test utilities for realistic component testing
- **Form libraries**: Real Formik and Yup for validation testing

## Writing New Tests

### API Tests
```typescript
import { apiFunction } from '../apiModule';
import { mockData } from '../../__tests__/utils/mockData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiFunction', () => {
  it('should handle success response', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const result = await apiFunction();
    expect(result).toEqual(mockData);
  });
});
```

### Component Tests
```typescript
import { render, screen, fireEvent } from '../../__tests__/utils/testUtils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
import { render, screen, waitFor } from '../utils/testUtils';
import userEvent from '@testing-library/user-event';
import PageComponent from '../../pages/PageComponent';

describe('User Workflow', () => {
  it('should complete full workflow', async () => {
    const user = userEvent.setup();
    render(<PageComponent />);
    
    // Simulate user interactions
    await user.click(screen.getByText('Button'));
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Debugging Tests

### Common Issues
1. **Async Operations**: Use `waitFor()` for async state updates
2. **API Mocking**: Ensure mocks are cleared between tests with `jest.clearAllMocks()`
3. **Provider Wrapper**: Use custom `render()` function for components that need context
4. **Console Warnings**: Suppressed in setup.ts but can be re-enabled for debugging

### Debug Commands
```bash
# Run with verbose output
npm test -- --verbose

# Run single test with debug
npm test -- --testNamePattern="test name" --verbose

# Debug with node inspector
node --inspect-brk node_modules/.bin/react-scripts test --runInBand --no-cache
```

## Continuous Integration

Tests are designed to run in CI environments with:
- Deterministic execution (no random delays)
- Comprehensive mocking (no external dependencies)
- Clear error messages for debugging
- Coverage reporting for quality gates

## Best Practices

1. **Test User Behavior**: Focus on what users can see and do, not implementation details
2. **Comprehensive Mocking**: Mock external dependencies but test internal logic
3. **Clear Test Names**: Describe the scenario and expected outcome
4. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
5. **Error Scenarios**: Test both happy path and error cases
6. **Accessibility**: Include basic accessibility testing where relevant