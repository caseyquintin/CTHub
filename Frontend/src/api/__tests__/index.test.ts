import axios from 'axios';
import {
  getContainers,
  getContainersByStatus,
  getContainer,
  createContainer,
  updateContainer,
  patchContainer,
  deleteContainer,
  bulkCreateContainers,
  bulkUpdateContainers,
  bulkDeleteContainers,
  getDropdownOptions,
  getPorts,
  getTerminals,
  getShiplines,
  getVesselLines,
  getVessels,
} from '../index';
import { mockContainer, mockContainers, mockApiResponse, mockDropdownOptions } from '../../__tests__/utils/mockData';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Mock axios.create to return our mock instance
  mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
});

describe('Container API', () => {
  describe('getContainers', () => {
    it('should return array of containers from API response with Data property', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await getContainers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/containers');
      expect(result).toEqual(mockContainers);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array of containers from direct array response', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockContainers });

      const result = await getContainers();

      expect(result).toEqual(mockContainers);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array on API error', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await getContainers();

      expect(result).toEqual([]);
    });

    it('should handle null or undefined response data', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: null });

      const result = await getContainers();

      expect(result).toEqual([]);
    });
  });

  describe('getContainersByStatus', () => {
    it('should fetch containers by status', async () => {
      const status = 'At Port';
      const filteredContainers = mockContainers.filter(c => c.CurrentStatus === status);
      mockAxiosInstance.get.mockResolvedValueOnce({ data: filteredContainers });

      const result = await getContainersByStatus(status);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/containers/status/${status}`);
      expect(result).toEqual(filteredContainers);
    });
  });

  describe('getContainer', () => {
    it('should fetch a single container by ID', async () => {
      const containerId = 1;
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockContainer });

      const result = await getContainer(containerId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/containers/${containerId}`);
      expect(result).toEqual(mockContainer);
    });
  });

  describe('createContainer', () => {
    it('should create a new container', async () => {
      const newContainer = { ContainerNumber: 'TEST123456' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockContainer });

      const result = await createContainer(newContainer);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/containers', newContainer);
      expect(result).toEqual(mockContainer);
    });
  });

  describe('updateContainer', () => {
    it('should update an existing container', async () => {
      const containerId = 1;
      const updates = { CurrentStatus: 'Delivered' };
      mockAxiosInstance.put.mockResolvedValueOnce({ data: {} });

      await updateContainer(containerId, updates);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/containers/${containerId}`, updates);
    });
  });

  describe('patchContainer', () => {
    it('should partially update a container', async () => {
      const containerId = 1;
      const updates = { Notes: 'Updated notes' };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await patchContainer(containerId, updates);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/containers/${containerId}`, updates);
    });
  });

  describe('deleteContainer', () => {
    it('should delete a container', async () => {
      const containerId = 1;
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: {} });

      await deleteContainer(containerId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/containers/${containerId}`);
    });
  });

  describe('bulkCreateContainers', () => {
    it('should create multiple containers', async () => {
      const newContainers = [
        { ContainerNumber: 'BULK001' },
        { ContainerNumber: 'BULK002' },
      ];
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockContainers });

      const result = await bulkCreateContainers(newContainers);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/containers/bulk', newContainers);
      expect(result).toEqual(mockContainers);
    });
  });

  describe('bulkUpdateContainers', () => {
    it('should update multiple containers', async () => {
      const updates = { CurrentStatus: 'Delivered' };
      const ids = [1, 2, 3];
      mockAxiosInstance.put.mockResolvedValueOnce({ data: {} });

      await bulkUpdateContainers(updates, ids);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/containers/bulk?ids=1&ids=2&ids=3',
        updates
      );
    });
  });

  describe('bulkDeleteContainers', () => {
    it('should delete multiple containers', async () => {
      const ids = [1, 2, 3];
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: {} });

      await bulkDeleteContainers(ids);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/containers/bulk?ids=1&ids=2&ids=3');
    });
  });
});

describe('Dropdown API', () => {
  describe('getDropdownOptions', () => {
    it('should fetch dropdown options', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockDropdownOptions });

      const result = await getDropdownOptions();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dropdownOptions');
      expect(result).toEqual(mockDropdownOptions);
    });
  });
});

describe('Reference Data APIs', () => {
  describe('getPorts', () => {
    it('should fetch ports', async () => {
      const mockPorts = [{ portID: 1, portOfEntry: 'Los Angeles' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockPorts });

      const result = await getPorts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ports');
      expect(result).toEqual(mockPorts);
    });
  });

  describe('getTerminals', () => {
    it('should fetch terminals', async () => {
      const mockTerminals = [{ terminalID: 1, terminalName: 'APM Terminals' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockTerminals });

      const result = await getTerminals();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/terminals');
      expect(result).toEqual(mockTerminals);
    });
  });

  describe('getShiplines', () => {
    it('should fetch shiplines', async () => {
      const mockShiplines = [{ shiplineID: 1, shiplineName: 'Maersk' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockShiplines });

      const result = await getShiplines();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/shiplines');
      expect(result).toEqual(mockShiplines);
    });
  });

  describe('getVesselLines', () => {
    it('should fetch vessel lines', async () => {
      const mockVesselLines = [{ vesselLineID: 1, vesselLineName: 'MSC' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockVesselLines });

      const result = await getVesselLines();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/vesselLines');
      expect(result).toEqual(mockVesselLines);
    });
  });

  describe('getVessels', () => {
    it('should fetch vessels', async () => {
      const mockVessels = [{ vesselID: 1, vesselName: 'MSC GENEVA' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockVessels });

      const result = await getVessels();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/vessels');
      expect(result).toEqual(mockVessels);
    });
  });
});