import { Container } from '../types';
import { AdvancedFilters } from '../components/AdvancedSearchModal';
import { isWithinInterval, parseISO, isValid } from 'date-fns';

export const applyAdvancedFilters = (containers: Container[], filters: AdvancedFilters): Container[] => {
  let filteredContainers = [...containers];

  // Text search filter
  if (filters.searchTerm && filters.searchFields.length > 0) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredContainers = filteredContainers.filter(container => 
      filters.searchFields.some(field => {
        const value = getContainerFieldValue(container, field);
        return value && typeof value === 'string' && value.toLowerCase().includes(searchTerm);
      })
    );
  }

  // Status filter
  if (filters.status.length > 0) {
    filteredContainers = filteredContainers.filter(container =>
      container.CurrentStatus && filters.status.includes(container.CurrentStatus)
    );
  }

  // Date range filter
  if (filters.dateRange.field && filters.dateRange.startDate && filters.dateRange.endDate) {
    const startDate = parseISO(filters.dateRange.startDate);
    const endDate = parseISO(filters.dateRange.endDate);
    
    if (isValid(startDate) && isValid(endDate)) {
      filteredContainers = filteredContainers.filter(container => {
        const dateValue = getContainerFieldValue(container, filters.dateRange.field);
        if (!dateValue) return false;
        
        const containerDate = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
        if (!isValid(containerDate)) return false;
        
        return isWithinInterval(containerDate, { start: startDate, end: endDate });
      });
    }
  }

  // Container size filter
  if (filters.containerSize.length > 0) {
    filteredContainers = filteredContainers.filter(container =>
      container.ContainerSize && filters.containerSize.includes(container.ContainerSize)
    );
  }

  // Shipline filter
  if (filters.shipline.length > 0) {
    filteredContainers = filteredContainers.filter(container =>
      container.Shipline && filters.shipline.includes(container.Shipline.shiplineName)
    );
  }

  // Port of entry filter
  if (filters.portOfEntry.length > 0) {
    filteredContainers = filteredContainers.filter(container =>
      container.PortOfEntry && filters.portOfEntry.includes(container.PortOfEntry)
    );
  }

  // Vendor filter
  if (filters.vendor) {
    const vendorTerm = filters.vendor.toLowerCase();
    filteredContainers = filteredContainers.filter(container =>
      container.Vendor && container.Vendor.toLowerCase().includes(vendorTerm)
    );
  }

  // Rail filter
  if (filters.rail !== '') {
    filteredContainers = filteredContainers.filter(container =>
      container.Rail === filters.rail
    );
  }

  return filteredContainers;
};

// Helper function to get field values from container object, including nested properties
const getContainerFieldValue = (container: Container, field: string): string | Date | null => {
  switch (field) {
    case 'ContainerNumber':
      return container.ContainerNumber || null;
    case 'ProjectNumber':
      return container.ProjectNumber || null;
    case 'PONumber':
      return container.PONumber || null;
    case 'BOLBookingNumber':
      return container.BOLBookingNumber || null;
    case 'Vendor':
      return container.Vendor || null;
    case 'Voyage':
      return container.Voyage || null;
    case 'Notes':
      return container.Notes || null;
    case 'Sail':
      return container.Sail || null;
    case 'Arrival':
      return container.Arrival || null;
    case 'Available':
      return container.Available || null;
    case 'PickupLFD':
      return container.PickupLFD || null;
    case 'ReturnLFD':
      return container.ReturnLFD || null;
    case 'Delivered':
      return container.Delivered || null;
    case 'Returned':
      return container.Returned || null;
    case 'LastUpdated':
      return container.LastUpdated || null;
    default:
      return null;
  }
};

// Export filter presets functionality
export interface FilterPreset {
  id: string;
  name: string;
  filters: AdvancedFilters;
  createdAt: Date;
  isDefault?: boolean;
}

export const saveFilterPreset = (preset: Omit<FilterPreset, 'id' | 'createdAt'>): FilterPreset => {
  const id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newPreset: FilterPreset = {
    ...preset,
    id,
    createdAt: new Date(),
  };
  
  const existingPresets = getFilterPresets();
  const updatedPresets = [...existingPresets, newPreset];
  localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
  
  return newPreset;
};

export const getFilterPresets = (): FilterPreset[] => {
  try {
    const presets = localStorage.getItem('filterPresets');
    return presets ? JSON.parse(presets) : [];
  } catch {
    return [];
  }
};

export const deleteFilterPreset = (presetId: string): void => {
  const existingPresets = getFilterPresets();
  const updatedPresets = existingPresets.filter(preset => preset.id !== presetId);
  localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
};

export const getDefaultFilters = (): AdvancedFilters => ({
  searchTerm: '',
  searchFields: ['ContainerNumber', 'ProjectNumber', 'PONumber', 'BOLBookingNumber'],
  status: [],
  dateRange: { field: '', startDate: '', endDate: '' },
  containerSize: [],
  shipline: [],
  portOfEntry: [],
  vendor: '',
  rail: '',
});