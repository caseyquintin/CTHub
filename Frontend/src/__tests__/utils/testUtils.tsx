import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from '../../context/AppContext';

// Custom render function that includes all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
        <ToastContainer />
      </AppProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper function to create mock API responses
export const createMockApiResponse = <T>(data: T, options?: {
  totalCount?: number;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}) => ({
  Data: data,
  TotalCount: options?.totalCount ?? (Array.isArray(data) ? data.length : 1),
  Page: options?.page ?? 1,
  PageSize: options?.pageSize ?? 100,
  TotalPages: Math.ceil((options?.totalCount ?? 1) / (options?.pageSize ?? 100)),
  HasNextPage: options?.hasNextPage ?? false,
  HasPreviousPage: options?.hasPreviousPage ?? false,
});

// Helper function to mock axios
export const createAxiosMock = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
});

// Helper function to wait for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

// Mock implementation for React Table
export const mockUseTable = {
  getTableProps: () => ({ role: 'table' }),
  getTableBodyProps: () => ({ role: 'rowgroup' }),
  headerGroups: [],
  rows: [],
  prepareRow: jest.fn(),
  state: { selectedRowIds: {} },
};

// Helper to create form event
export const createFormEvent = (name: string, value: any) => ({
  target: { name, value, type: 'text' },
  currentTarget: { name, value },
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

// Helper to create select event
export const createSelectEvent = (name: string, value: any) => ({
  target: { name, value, type: 'select' },
  currentTarget: { name, value },
});