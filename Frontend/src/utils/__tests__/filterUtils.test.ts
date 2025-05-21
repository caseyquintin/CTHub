import {
  applyAdvancedFilters,
  getDefaultFilters,
  getContainerFieldValue,
} from '../filterUtils';
import { mockContainers } from '../../__tests__/utils/mockData';
import { AdvancedFilters } from '../../components/AdvancedSearchModal';

describe('filterUtils', () => {
  describe('getDefaultFilters', () => {
    it('should return default filter configuration', () => {
      const defaultFilters = getDefaultFilters();

      expect(defaultFilters).toEqual({
        searchTerm: '',
        searchFields: ['ContainerNumber', 'ProjectNumber', 'PONumber', 'BOLBookingNumber'],
        status: [],
        dateRange: {
          field: '',
          startDate: '',
          endDate: '',
        },
        containerSize: [],
        shipline: [],
        portOfEntry: [],
        vendor: '',
        rail: '',
      });
    });
  });

  describe('getContainerFieldValue', () => {
    const container = mockContainers[0];

    it('should return correct values for string fields', () => {
      expect(getContainerFieldValue(container, 'ContainerNumber')).toBe(container.ContainerNumber);
      expect(getContainerFieldValue(container, 'ProjectNumber')).toBe(container.ProjectNumber);
      expect(getContainerFieldValue(container, 'PONumber')).toBe(container.PONumber);
      expect(getContainerFieldValue(container, 'BOLBookingNumber')).toBe(container.BOLBookingNumber);
      expect(getContainerFieldValue(container, 'Vendor')).toBe(container.Vendor);
      expect(getContainerFieldValue(container, 'Voyage')).toBe(container.Voyage);
      expect(getContainerFieldValue(container, 'Notes')).toBe(container.Notes);
    });

    it('should return correct values for date fields', () => {
      expect(getContainerFieldValue(container, 'Sail')).toBe(container.Sail);
      expect(getContainerFieldValue(container, 'Arrival')).toBe(container.Arrival);
      expect(getContainerFieldValue(container, 'Available')).toBe(container.Available);
      expect(getContainerFieldValue(container, 'PickupLFD')).toBe(container.PickupLFD);
      expect(getContainerFieldValue(container, 'ReturnLFD')).toBe(container.ReturnLFD);
      expect(getContainerFieldValue(container, 'Delivered')).toBe(container.Delivered);
      expect(getContainerFieldValue(container, 'Returned')).toBe(container.Returned);
      expect(getContainerFieldValue(container, 'LastUpdated')).toBe(container.LastUpdated);
    });

    it('should return null for unknown fields', () => {
      expect(getContainerFieldValue(container, 'UnknownField')).toBe(null);
    });

    it('should handle null/undefined values gracefully', () => {
      const containerWithNulls = { ...container, ProjectNumber: undefined, Notes: null };
      expect(getContainerFieldValue(containerWithNulls, 'ProjectNumber')).toBe(null);
      expect(getContainerFieldValue(containerWithNulls, 'Notes')).toBe(null);
    });
  });

  describe('applyAdvancedFilters', () => {
    it('should return all containers when no filters are applied', () => {
      const filters = getDefaultFilters();
      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toEqual(mockContainers);
    });

    it('should filter by search term across specified fields', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        searchTerm: 'CAAU5462320',
        searchFields: ['ContainerNumber'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].ContainerNumber).toBe('CAAU5462320');
    });

    it('should filter by search term across multiple fields', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        searchTerm: 'P123456',
        searchFields: ['ContainerNumber', 'ProjectNumber'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].ProjectNumber).toBe('P123456');
    });

    it('should filter by status', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        status: ['At Port'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].CurrentStatus).toBe('At Port');
    });

    it('should filter by multiple statuses', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        status: ['At Port', 'On Vessel'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toHaveLength(2);
      expect(result.map(c => c.CurrentStatus)).toEqual(['At Port', 'On Vessel']);
    });

    it('should filter by container size', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        containerSize: ['40HC'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.every(c => c.ContainerSize === '40HC')).toBe(true);
    });

    it('should filter by shipline', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        shipline: ['Maersk'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.every(c => c.Shipline?.shiplineName === 'Maersk')).toBe(true);
    });

    it('should filter by port of entry', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        portOfEntry: ['Los Angeles'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.every(c => c.PortOfEntry === 'Los Angeles')).toBe(true);
    });

    it('should filter by vendor', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        vendor: 'Test Vendor',
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.every(c => c.Vendor?.includes('Test Vendor'))).toBe(true);
    });

    it('should filter by rail status', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        rail: 'Yes',
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.every(c => c.Rail === 'Yes')).toBe(true);
    });

    it('should apply multiple filters simultaneously', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        status: ['At Port', 'Delivered'],
        containerSize: ['40HC'],
        rail: 'Yes',
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].CurrentStatus).toBe('Delivered');
      expect(result[0].ContainerSize).toBe('40HC');
      expect(result[0].Rail).toBe('Yes');
    });

    it('should handle date range filtering', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        dateRange: {
          field: 'Sail',
          startDate: '2023-05-01',
          endDate: '2023-07-01',
        },
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(container => {
        const fieldValue = getContainerFieldValue(container, 'Sail');
        if (fieldValue instanceof Date) {
          expect(fieldValue).toBeInstanceOf(Date);
          expect(fieldValue.getTime()).toBeGreaterThanOrEqual(new Date('2023-05-01').getTime());
          expect(fieldValue.getTime()).toBeLessThanOrEqual(new Date('2023-07-01').getTime());
        }
      });
    });

    it('should return empty array when no containers match filters', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        status: ['NonExistentStatus'],
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result).toEqual([]);
    });

    it('should handle case-insensitive vendor search', () => {
      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        vendor: 'test vendor',
      };

      const result = applyAdvancedFilters(mockContainers, filters);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(c => c.Vendor?.toLowerCase().includes('test vendor'))).toBe(true);
    });

    it('should handle containers with missing optional properties', () => {
      const containersWithMissingProps = [
        {
          ...mockContainers[0],
          Shipline: undefined,
          Vendor: undefined,
          PortOfEntry: undefined,
        },
      ];

      const filters: AdvancedFilters = {
        ...getDefaultFilters(),
        shipline: ['Maersk'],
      };

      const result = applyAdvancedFilters(containersWithMissingProps, filters);
      
      expect(result).toEqual([]);
    });
  });
});