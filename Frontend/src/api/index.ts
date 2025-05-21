import axios from 'axios';
import { Container, DropdownOption, Port, Terminal, Shipline, VesselLine, Vessel } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5062/api';
const USE_BACKEND_FILTERING = process.env.REACT_APP_USE_BACKEND_FILTERING === 'true';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Container APIs
export const getContainers = async (page: number = 1, pageSize: number = 100): Promise<{
  data: Container[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> => {
  try {
    const response = await api.get(`/containers?page=${page}&pageSize=${pageSize}`);
    
    // Handle pagination response format
    if (response.data && typeof response.data === 'object' && 'Data' in response.data) {
      return {
        data: response.data.Data || [],
        totalCount: response.data.TotalCount || 0,
        page: response.data.Page || 1,
        pageSize: response.data.PageSize || 100,
        totalPages: response.data.TotalPages || 1,
        hasNextPage: response.data.HasNextPage || false,
        hasPreviousPage: response.data.HasPreviousPage || false,
      };
    }
    
    // Fallback for array format
    const data = Array.isArray(response.data) ? response.data : [];
    return {
      data,
      totalCount: data.length,
      page: 1,
      pageSize: data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      data: [],
      totalCount: 0,
      page: 1,
      pageSize: 100,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};

// Legacy function for backward compatibility
export const getContainersLegacy = async (): Promise<Container[]> => {
  const result = await getContainers();
  return result.data;
};

export const getContainersByStatus = async (status: string): Promise<Container[]> => {
  const response = await api.get(`/containers/status/${status}`);
  return response.data;
};

export const getContainer = async (id: number): Promise<Container> => {
  const response = await api.get(`/containers/${id}`);
  return response.data;
};

export const createContainer = async (container: Partial<Container>): Promise<Container> => {
  const response = await api.post('/containers', container);
  return response.data;
};

export const updateContainer = async (id: number, container: Partial<Container>): Promise<void> => {
  await api.put(`/containers/${id}`, container);
};

export const patchContainer = async (id: number, updates: Record<string, any>): Promise<void> => {
  await api.patch(`/containers/${id}`, updates);
};

export const deleteContainer = async (id: number): Promise<void> => {
  await api.delete(`/containers/${id}`);
};

export const bulkCreateContainers = async (containers: Partial<Container>[]): Promise<Container[]> => {
  const response = await api.post('/containers/bulk', containers);
  return response.data;
};

export const bulkUpdateContainers = async (updates: Record<string, any>, ids: number[]): Promise<void> => {
  const queryParams = ids.map(id => `ids=${id}`).join('&');
  await api.put(`/containers/bulk?${queryParams}`, updates);
};

export const bulkDeleteContainers = async (ids: number[]): Promise<void> => {
  const queryParams = ids.map(id => `ids=${id}`).join('&');
  await api.delete(`/containers/bulk?${queryParams}`);
};

// Dropdown APIs
export const getDropdownOptions = async (): Promise<DropdownOption[]> => {
  const response = await api.get('/dropdownOptions');
  return response.data;
};

export const getDropdownOptionsByCategory = async (category: string): Promise<DropdownOption[]> => {
  const response = await api.get(`/dropdownOptions/category/${category}`);
  return response.data;
};

// Port APIs
export const getPorts = async (): Promise<Port[]> => {
  const response = await api.get('/ports');
  return response.data;
};

// Terminal APIs
export const getTerminals = async (): Promise<Terminal[]> => {
  const response = await api.get('/terminals');
  return response.data;
};

export const getTerminalsByPort = async (portId: number): Promise<Terminal[]> => {
  const response = await api.get(`/terminals/port/${portId}`);
  return response.data;
};

// Shipline APIs
export const getShiplines = async (): Promise<Shipline[]> => {
  const response = await api.get('/shiplines');
  return response.data;
};

// VesselLine APIs
export const getVesselLines = async (): Promise<VesselLine[]> => {
  const response = await api.get('/vesselLines');
  return response.data;
};

// Vessel APIs
export const getVessels = async (): Promise<Vessel[]> => {
  const response = await api.get('/vessels');
  return response.data;
};

export const getVesselsByLine = async (vesselLineId: number): Promise<Vessel[]> => {
  const response = await api.get(`/vessels/vesselLine/${vesselLineId}`);
  return response.data;
};

export default api;