import React, { useState, useEffect, useRef } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface ColumnFilterProps {
  columnId: string;
  columnValues: string[];
  selectedValues: string[];
  onFilterChange: (columnId: string, values: string[]) => void;
}

export const ColumnFilter: React.FC<ColumnFilterProps> = ({
  columnId,
  columnValues,
  selectedValues,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSelectedValues(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const uniqueValues = Array.from(new Set(columnValues)).sort();
  const filteredValues = uniqueValues.filter(value =>
    value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    setLocalSelectedValues(uniqueValues);
  };

  const handleClearAll = () => {
    setLocalSelectedValues([]);
  };

  const handleValueToggle = (value: string) => {
    setLocalSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onFilterChange(columnId, localSelectedValues);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSelectedValues(selectedValues);
    setIsOpen(false);
    setSearchTerm('');
  };

  const isFiltered = selectedValues.length > 0 && selectedValues.length < uniqueValues.length;
  const hasFilter = selectedValues.length > 0;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ml-2 p-1 rounded hover:bg-gray-200 ${hasFilter ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        aria-label="Filter column"
      >
        <FunnelIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg border border-gray-200 min-w-[250px] max-w-[300px]">
          <div className="p-3">
            {/* Search box */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Select/Clear buttons */}
            <div className="flex justify-between mt-3 mb-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Values list */}
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded">
              {filteredValues.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">No matching values</div>
              ) : (
                filteredValues.map((value, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={localSelectedValues.includes(value)}
                      onChange={() => handleValueToggle(value)}
                      className="mr-2"
                    />
                    <span className="text-sm flex-1">
                      {value || '(Blank)'}
                    </span>
                    {localSelectedValues.includes(value) && (
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </label>
                ))
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end mt-3 space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};