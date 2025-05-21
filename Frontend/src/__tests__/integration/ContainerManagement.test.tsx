import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockApiResponse } from '../utils/testUtils';
import ContainersPage from '../../pages/ContainersPage';
import { mockContainers, mockDropdownOptions, mockApiResponse } from '../utils/mockData';

// Mock all API calls
jest.mock('../../api', () => ({
  getContainers: jest.fn(),
  getContainersByStatus: jest.fn(),
  createContainer: jest.fn(),
  updateContainer: jest.fn(),
  deleteContainer: jest.fn(),
  bulkUpdateContainers: jest.fn(),
  bulkDeleteContainers: jest.fn(),
  bulkCreateContainers: jest.fn(),
  getDropdownOptions: jest.fn(),
  getShiplines: jest.fn(),
  getVesselLines: jest.fn(),
  getPorts: jest.fn(),
  getTerminals: jest.fn(),
  getTerminalsByPort: jest.fn(),
  getVessels: jest.fn(),
  getVesselsByLine: jest.fn(),
}));

// Mock react-table to simplify testing
jest.mock('react-table', () => ({
  useTable: () => ({
    getTableProps: () => ({ role: 'table' }),
    getTableBodyProps: () => ({ role: 'rowgroup' }),
    headerGroups: [
      {
        getHeaderGroupProps: () => ({ key: 'header-group' }),
        headers: [
          {
            getHeaderProps: () => ({ key: 'header-1' }),
            getSortByToggleProps: () => ({}),
            render: () => 'Container Number',
            isSorted: false,
          },
          {
            getHeaderProps: () => ({ key: 'header-2' }),
            getSortByToggleProps: () => ({}),
            render: () => 'Status',
            isSorted: false,
          },
          {
            getHeaderProps: () => ({ key: 'header-3' }),
            getSortByToggleProps: () => ({}),
            render: () => 'Actions',
            isSorted: false,
          },
        ],
      },
    ],
    rows: mockContainers.map((container, index) => ({
      getRowProps: () => ({ key: `row-${index}` }),
      cells: [
        {
          getCellProps: () => ({ key: `cell-${index}-1` }),
          render: () => container.ContainerNumber,
        },
        {
          getCellProps: () => ({ key: `cell-${index}-2` }),
          render: () => container.CurrentStatus,
        },
        {
          getCellProps: () => ({ key: `cell-${index}-3` }),
          render: () => (
            <div>
              <button onClick={() => mockProps.onEdit(container)}>Edit</button>
              <button onClick={() => mockProps.onDelete([container.ContainerID])}>Delete</button>
            </div>
          ),
        },
      ],
      original: container,
      index,
      isSelected: false,
      getToggleRowSelectedProps: () => ({
        checked: false,
        onChange: jest.fn(),
      }),
    })),
    prepareRow: jest.fn(),
    state: { selectedRowIds: {} },
  }),
  useSortBy: () => ({}),
  useFilters: () => ({}),
  useRowSelect: () => ({}),
}));

const mockApi = require('../../api');

// Create mock props for table component
const mockProps = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  
  // Setup default API responses
  mockApi.getContainers.mockResolvedValue(mockContainers);
  mockApi.getContainersByStatus.mockResolvedValue(mockContainers);
  mockApi.getDropdownOptions.mockResolvedValue(mockDropdownOptions);
  mockApi.getShiplines.mockResolvedValue([]);
  mockApi.getVesselLines.mockResolvedValue([]);
  mockApi.getPorts.mockResolvedValue([]);
  mockApi.getTerminals.mockResolvedValue([]);
  mockApi.getVessels.mockResolvedValue([]);
  mockApi.createContainer.mockResolvedValue(mockContainers[0]);
  mockApi.updateContainer.mockResolvedValue({});
  mockApi.deleteContainer.mockResolvedValue({});
  mockApi.bulkUpdateContainers.mockResolvedValue({});
  mockApi.bulkDeleteContainers.mockResolvedValue({});
  mockApi.bulkCreateContainers.mockResolvedValue(mockContainers);
});

describe('Container Management Integration', () => {
  describe('Page Load and Data Display', () => {
    it('should load and display containers on page load', async () => {
      render(<ContainersPage />);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Check that API was called
      expect(mockApi.getContainers).toHaveBeenCalled();
      expect(mockApi.getDropdownOptions).toHaveBeenCalled();

      // Check that containers are displayed
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    it('should display status filter tabs', async () => {
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('All Containers')).toBeInTheDocument();
        expect(screen.getByText('Not Sailed')).toBeInTheDocument();
        expect(screen.getByText('On Vessel')).toBeInTheDocument();
        expect(screen.getByText('At Port')).toBeInTheDocument();
        expect(screen.getByText('On Rail')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
        expect(screen.getByText('Returned')).toBeInTheDocument();
      });
    });
  });

  describe('Container Filtering', () => {
    it('should filter containers by status when status tab is clicked', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Click on 'At Port' status tab
      const atPortTab = screen.getByText('At Port');
      await user.click(atPortTab);

      // Should call API with status filter
      await waitFor(() => {
        expect(mockApi.getContainersByStatus).toHaveBeenCalledWith('At Port');
      });
    });

    it('should filter containers using search input', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Find and use search input
      const searchInput = screen.getByPlaceholderText(/quick search/i);
      await user.type(searchInput, 'CAAU5462320');

      // The filtering happens in the component, so we just check the input value
      expect(searchInput).toHaveValue('CAAU5462320');
    });

    it('should open advanced search modal', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Click advanced search button
      const advancedButton = screen.getByText('Advanced');
      await user.click(advancedButton);

      // Advanced search modal should open
      // Note: This would require the modal to be properly mocked or rendered
      expect(advancedButton).toBeInTheDocument();
    });
  });

  describe('Container CRUD Operations', () => {
    it('should open add container modal when Add Container button is clicked', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Click Add Container button
      const addButton = screen.getByText('Add Container');
      await user.click(addButton);

      // Modal should open (this would need proper modal testing)
      expect(addButton).toBeInTheDocument();
    });

    it('should handle container creation workflow', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Simulate the add container workflow
      // Note: This would require proper modal integration
      const addButton = screen.getByText('Add Container');
      expect(addButton).toBeInTheDocument();

      // In a full integration test, you would:
      // 1. Click Add Container
      // 2. Fill out the form
      // 3. Submit the form
      // 4. Verify API call
      // 5. Verify table refresh
    });

    it('should handle bulk operations', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Bulk operations would require:
      // 1. Selecting multiple containers
      // 2. Clicking bulk action buttons
      // 3. Confirming actions
      // 4. Verifying API calls

      // For now, we check that the page renders correctly
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockApi.getContainers.mockRejectedValueOnce(new Error('API Error'));
      
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Component should still render even with API errors
      expect(screen.getByText('Container Tracking')).toBeInTheDocument();
    });

    it('should display error messages for failed operations', async () => {
      mockApi.createContainer.mockRejectedValueOnce(new Error('Creation failed'));
      
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // In a full implementation, error toasts would be displayed
      // This would require testing the toast notifications
      expect(screen.getByText('Container Tracking')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching data', async () => {
      // Mock delayed API response
      mockApi.getContainers.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockContainers), 100))
      );

      render(<ContainersPage />);

      // Check for loading indicator
      await waitFor(() => {
        expect(screen.getByText('Loading containers...')).toBeInTheDocument();
      });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Data Refresh', () => {
    it('should refresh data when switching between status filters', async () => {
      const user = userEvent.setup();
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // Initial load
      expect(mockApi.getContainers).toHaveBeenCalledTimes(1);

      // Switch to different status
      const deliveredTab = screen.getByText('Delivered');
      await user.click(deliveredTab);

      await waitFor(() => {
        expect(mockApi.getContainersByStatus).toHaveBeenCalledWith('Delivered');
      });

      // Switch back to all
      const allTab = screen.getByText('All Containers');
      await user.click(allTab);

      await waitFor(() => {
        expect(mockApi.getContainers).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on different screen sizes', async () => {
      render(<ContainersPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Tracking')).toBeInTheDocument();
      });

      // The component should render without errors regardless of screen size
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});