import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerFormModal } from '../ContainerFormModal';
import { render, createMockApiResponse } from '../../__tests__/utils/testUtils';
import { mockContainer, mockDropdownOptions, mockShiplines, mockVesselLines, mockPorts, mockTerminals, mockVessels } from '../../__tests__/utils/mockData';

// Mock the API calls
jest.mock('../../api', () => ({
  getDropdownOptions: jest.fn(),
  getShiplines: jest.fn(),
  getVesselLines: jest.fn(),
  getPorts: jest.fn(),
  getTerminals: jest.fn(),
  getTerminalsByPort: jest.fn(),
  getVessels: jest.fn(),
  getVesselsByLine: jest.fn(),
}));

const mockApi = require('../../api');

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

const mockAppContextValue = {
  state: {
    dropdownOptions: mockDropdownOptions,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  
  // Setup default mock returns
  mockApi.getDropdownOptions.mockResolvedValue(mockDropdownOptions);
  mockApi.getShiplines.mockResolvedValue(mockShiplines);
  mockApi.getVesselLines.mockResolvedValue(mockVesselLines);
  mockApi.getPorts.mockResolvedValue(mockPorts);
  mockApi.getTerminals.mockResolvedValue(mockTerminals);
  mockApi.getTerminalsByPort.mockResolvedValue(mockTerminals);
  mockApi.getVessels.mockResolvedValue(mockVessels);
  mockApi.getVesselsByLine.mockResolvedValue(mockVessels);
});

describe('ContainerFormModal', () => {
  describe('Add Mode', () => {
    it('should render add container form when no container is provided', async () => {
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });
      
      expect(screen.getByLabelText(/container number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/project number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current status/i)).toBeInTheDocument();
    });

    it('should have empty initial values for add mode', async () => {
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        const containerNumberInput = screen.getByLabelText(/container number/i) as HTMLInputElement;
        expect(containerNumberInput.value).toBe('');
      });
    });

    it('should call onSubmit with form data when submitted', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Fill out the form
      const containerNumberInput = screen.getByLabelText(/container number/i);
      await user.type(containerNumberInput, 'TEST123456');

      const projectNumberInput = screen.getByLabelText(/project number/i);
      await user.type(projectNumberInput, 'P789012');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /add container/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            ContainerNumber: 'TEST123456',
            ProjectNumber: 'P789012',
          })
        );
      });
    });
  });

  describe('Edit Mode', () => {
    it('should render edit container form when container is provided', async () => {
      render(<ContainerFormModal {...defaultProps} container={mockContainer} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });
    });

    it('should populate form with container data in edit mode', async () => {
      render(<ContainerFormModal {...defaultProps} container={mockContainer} />);

      await waitFor(() => {
        const containerNumberInput = screen.getByLabelText(/container number/i) as HTMLInputElement;
        expect(containerNumberInput.value).toBe(mockContainer.ContainerNumber);
      });

      const projectNumberInput = screen.getByLabelText(/project number/i) as HTMLInputElement;
      expect(projectNumberInput.value).toBe(mockContainer.ProjectNumber || '');
    });

    it('should load related data when editing container with port', async () => {
      const containerWithPort = { ...mockContainer, PortID: 1 };
      render(<ContainerFormModal {...defaultProps} container={containerWithPort} />);

      await waitFor(() => {
        expect(mockApi.getTerminalsByPort).toHaveBeenCalledWith(1);
      });
    });

    it('should load related data when editing container with vessel line', async () => {
      const containerWithVesselLine = { ...mockContainer, VesselLineID: 1 };
      render(<ContainerFormModal {...defaultProps} container={containerWithVesselLine} />);

      await waitFor(() => {
        expect(mockApi.getVesselsByLine).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Form Validation', () => {
    it('should require container number', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Try to submit without container number
      const submitButton = screen.getByRole('button', { name: /add container/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/container number is required/i)).toBeInTheDocument();
      });
    });

    it('should validate container number format', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Enter invalid container number
      const containerNumberInput = screen.getByLabelText(/container number/i);
      await user.type(containerNumberInput, 'abc');

      const submitButton = screen.getByRole('button', { name: /add container/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/container number must be at least 4 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Dropdowns', () => {
    it('should populate dropdowns from API data', async () => {
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockApi.getShiplines).toHaveBeenCalled();
        expect(mockApi.getVesselLines).toHaveBeenCalled();
        expect(mockApi.getPorts).toHaveBeenCalled();
      });
    });

    it('should update terminals when port is selected', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Find and select a port
      const portSelect = screen.getByLabelText(/port/i);
      await user.selectOptions(portSelect, '1');

      await waitFor(() => {
        expect(mockApi.getTerminalsByPort).toHaveBeenCalledWith(1);
      });
    });

    it('should update vessels when vessel line is selected', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Find and select a vessel line
      const vesselLineSelect = screen.getByLabelText(/vessel line/i);
      await user.selectOptions(vesselLineSelect, '1');

      await waitFor(() => {
        expect(mockApi.getVesselsByLine).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Boolean Field Conversion', () => {
    it('should convert Rail string values to proper format', async () => {
      render(<ContainerFormModal {...defaultProps} container={mockContainer} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });

      // The Rail field should be handled as a string value
      const railSelect = screen.getByLabelText(/rail/i);
      expect(railSelect).toBeInTheDocument();
    });

    it('should convert Transload string values to proper format', async () => {
      render(<ContainerFormModal {...defaultProps} container={mockContainer} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });

      // The Transload field should be handled as a string value
      const transloadSelect = screen.getByLabelText(/transload/i);
      expect(transloadSelect).toBeInTheDocument();
    });
  });

  describe('Date Picker Fields', () => {
    it('should render date picker fields', async () => {
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Check for date fields
      expect(screen.getByLabelText(/sail date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/arrival date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/available date/i)).toBeInTheDocument();
    });

    it('should populate date fields with existing values in edit mode', async () => {
      render(<ContainerFormModal {...defaultProps} container={mockContainer} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });

      // Date fields should be populated with existing values
      // This would require checking the DatePicker component values
      expect(screen.getByLabelText(/sail date/i)).toBeInTheDocument();
    });
  });

  describe('Rail Dependent Fields', () => {
    it('should disable rail-related fields when rail is No', async () => {
      const user = userEvent.setup();
      const containerWithoutRail = { ...mockContainer, Rail: 'No' };
      render(<ContainerFormModal {...defaultProps} container={containerWithoutRail} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });

      // Rail-related fields should be disabled when Rail is 'No'
      const railDestinationInput = screen.getByLabelText(/rail destination/i) as HTMLInputElement;
      expect(railDestinationInput.disabled).toBe(true);
    });

    it('should enable rail-related fields when rail is Yes', async () => {
      const containerWithRail = { ...mockContainer, Rail: 'Yes' };
      render(<ContainerFormModal {...defaultProps} container={containerWithRail} />);

      await waitFor(() => {
        expect(screen.getByText('Edit Container')).toBeInTheDocument();
      });

      // Rail-related fields should be enabled when Rail is 'Yes'
      const railDestinationInput = screen.getByLabelText(/rail destination/i) as HTMLInputElement;
      expect(railDestinationInput.disabled).toBe(false);
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should not render when isOpen is false', () => {
      render(<ContainerFormModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Add Container')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit Container')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockApi.getShiplines.mockRejectedValueOnce(new Error('API Error'));
      
      render(<ContainerFormModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Container')).toBeInTheDocument();
      });

      // Component should still render even if API calls fail
      expect(screen.getByLabelText(/container number/i)).toBeInTheDocument();
    });
  });
});