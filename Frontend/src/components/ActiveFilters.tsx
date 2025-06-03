import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ActiveFiltersProps {
  columnFilters: Record<string, string[]>;
  onClearFilter: (columnId: string) => void;
  onClearAllFilters: () => void;
  getColumnDisplayName: (columnId: string) => string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  columnFilters,
  onClearFilter,
  onClearAllFilters,
  getColumnDisplayName,
}) => {
  const activeFilters = Object.entries(columnFilters).filter(([_, values]) => values.length > 0);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-3 rounded-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
        <button
          onClick={onClearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([columnId, values]) => (
          <div
            key={columnId}
            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            <span className="font-medium">{getColumnDisplayName(columnId)}:</span>
            <span className="ml-1">
              {values.length === 1 
                ? values[0] || '(Blank)'
                : `${values.length} selected`}
            </span>
            <button
              onClick={() => onClearFilter(columnId)}
              className="ml-2 hover:text-blue-900"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};