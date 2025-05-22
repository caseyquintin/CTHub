import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export interface AdvancedFilters {
  searchTerm: string;
  searchFields: string[];
  status: string[];
  dateRange: {
    field: string;
    startDate: string;
    endDate: string;
  };
  containerSize: string[];
  shipline: string[];
  portOfEntry: string[];
  vendor: string;
  rail: string;
  preset?: string;
}

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  currentFilters: AdvancedFilters;
}

const SEARCH_FIELDS = [
  { id: 'containerNumber', label: 'Container Number' },
  { id: 'projectNumber', label: 'Project Number' },
  { id: 'poNumber', label: 'PO Number' },
  { id: 'bolBookingNumber', label: 'BOL/Booking Number' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'voyage', label: 'Voyage' },
  { id: 'notes', label: 'Notes' },
];

const DATE_FIELDS = [
  { id: 'sail', label: 'Sail Date' },
  { id: 'arrival', label: 'Arrival Date' },
  { id: 'available', label: 'Available Date' },
  { id: 'pickupLFD', label: 'Pickup LFD' },
  { id: 'returnLFD', label: 'Return LFD' },
  { id: 'delivered', label: 'Delivered Date' },
  { id: 'returned', label: 'Returned Date' },
  { id: 'lastUpdated', label: 'Last Updated' },
];

const DATE_PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
  { id: 'last30', label: 'Last 30 Days' },
  { id: 'last90', label: 'Last 90 Days' },
];

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const { state } = useAppContext();
  const { dropdownOptions, containers } = state;
  
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const statusOptions = dropdownOptions
    .filter(opt => opt.Category === 'Status')
    .map(opt => ({ id: opt.Value, label: opt.Value }));

  const containerSizeOptions = dropdownOptions
    .filter(opt => opt.Category === 'ContainerSize')
    .map(opt => ({ id: opt.Value, label: opt.Value }));

  // Get unique values from containers
  const shiplineOptions = Array.from(
    new Set(containers.map(c => c.Shipline?.shiplineName).filter(Boolean))
  ).map(name => ({ id: name!, label: name! }));

  const portOptions = Array.from(
    new Set(containers.map(c => c.PortOfEntry).filter(Boolean))
  ).map(port => ({ id: port!, label: port! }));

  const handleFieldToggle = (fieldId: string) => {
    const updatedFields = filters.searchFields.includes(fieldId)
      ? filters.searchFields.filter(f => f !== fieldId)
      : [...filters.searchFields, fieldId];
    
    setFilters({ ...filters, searchFields: updatedFields });
  };

  const handleMultiSelectToggle = (category: keyof AdvancedFilters, value: string) => {
    const currentValues = filters[category] as string[];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters({ ...filters, [category]: updatedValues });
  };

  const handleDatePreset = (presetId: string) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    switch (presetId) {
      case 'today':
        startDate = endDate = today;
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'year':
        startDate = startOfYear(today);
        endDate = endOfYear(today);
        break;
      case 'last30':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last90':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        return;
    }

    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: AdvancedFilters = {
      searchTerm: '',
      searchFields: ['containerNumber', 'projectNumber', 'poNumber', 'bolBookingNumber'],
      status: [],
      dateRange: { field: '', startDate: '', endDate: '' },
      containerSize: [],
      shipline: [],
      portOfEntry: [],
      vendor: '',
      rail: '',
    };
    setFilters(resetFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FunnelIcon className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Advanced Search & Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Term and Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Text Search</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Term
              </label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                placeholder="Enter search term..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search In Fields
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SEARCH_FIELDS.map((field) => (
                  <label key={field.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.searchFields.includes(field.id)}
                      onChange={() => handleFieldToggle(field.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Date Range Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Field
                </label>
                <select
                  value={filters.dateRange.field}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, field: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Date Field</option>
                  {DATE_FIELDS.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, startDate: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, endDate: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Date Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleDatePreset(preset.id)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {statusOptions.map((status) => (
                <label key={status.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status.id)}
                    onChange={() => handleMultiSelectToggle('status', status.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Container Size Filter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Container Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {containerSizeOptions.map((size) => (
                <label key={size.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.containerSize.includes(size.id)}
                    onChange={() => handleMultiSelectToggle('containerSize', size.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipline Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Shipline</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {shiplineOptions.map((shipline) => (
                  <label key={shipline.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.shipline.includes(shipline.id)}
                      onChange={() => handleMultiSelectToggle('shipline', shipline.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{shipline.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Port Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Port of Entry</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {portOptions.map((port) => (
                  <label key={port.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.portOfEntry.includes(port.id)}
                      onChange={() => handleMultiSelectToggle('portOfEntry', port.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{port.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Vendor and Rail Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <input
                type="text"
                value={filters.vendor}
                onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                placeholder="Enter vendor name..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rail
              </label>
              <select
                value={filters.rail}
                onChange={(e) => setFilters({ ...filters, rail: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset All
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};