import axios from 'axios';
import { Container } from '../types';
import { AdvancedFilters } from '../components/AdvancedSearchModal';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7243/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ContainerFilterRequest {
  searchTerm?: string;
  searchFields: string[];
  status: string[];
  dateField?: string;
  startDate?: string;
  endDate?: string;
  containerSize: string[];
  shipline: string[];
  portOfEntry: string[];
  vendor?: string;
  rail?: boolean;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

export interface ContainerFilterResponse {
  data: Container[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Convert frontend AdvancedFilters to backend ContainerFilterRequest
export const convertFiltersToRequest = (
  filters: AdvancedFilters,
  page: number = 1,
  pageSize: number = 100,
  sortBy?: string,
  sortDescending: boolean = false
): ContainerFilterRequest => {
  return {
    searchTerm: filters.searchTerm || undefined,
    searchFields: filters.searchFields,
    status: filters.status,
    dateField: filters.dateRange.field || undefined,
    startDate: filters.dateRange.startDate || undefined,
    endDate: filters.dateRange.endDate || undefined,
    containerSize: filters.containerSize,
    shipline: filters.shipline,
    portOfEntry: filters.portOfEntry,
    vendor: filters.vendor || undefined,
    rail: filters.rail ? filters.rail === 'true' : undefined,
    page,
    pageSize,
    sortBy,
    sortDescending,
  };
};

// Get containers with advanced filtering (server-side)
export const getContainersAdvanced = async (
  filters: AdvancedFilters,
  page: number = 1,
  pageSize: number = 100,
  sortBy?: string,
  sortDescending: boolean = false
): Promise<ContainerFilterResponse> => {
  const request = convertFiltersToRequest(filters, page, pageSize, sortBy, sortDescending);
  
  const params = new URLSearchParams();
  
  if (request.searchTerm) params.append('searchTerm', request.searchTerm);
  request.searchFields.forEach(field => params.append('searchFields', field));
  request.status.forEach(status => params.append('status', status));
  if (request.dateField) params.append('dateField', request.dateField);
  if (request.startDate) params.append('startDate', request.startDate);
  if (request.endDate) params.append('endDate', request.endDate);
  request.containerSize.forEach(size => params.append('containerSize', size));
  request.shipline.forEach(shipline => params.append('shipline', shipline));
  request.portOfEntry.forEach(port => params.append('portOfEntry', port));
  if (request.vendor) params.append('vendor', request.vendor);
  if (request.rail !== undefined) params.append('rail', request.rail.toString());
  params.append('page', request.page.toString());
  params.append('pageSize', request.pageSize.toString());
  if (request.sortBy) params.append('sortBy', request.sortBy);
  params.append('sortDescending', request.sortDescending.toString());

  const response = await api.get(`/containers?${params.toString()}`);
  return response.data;
};

// Get containers simple (backwards compatibility)
export const getContainersSimple = async (): Promise<Container[]> => {
  const response = await api.get('/containers/simple');
  return response.data;
};

export default api;