import React, { useState, useEffect } from 'react';
import { XMarkIcon, BookmarkIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AdvancedFilters } from './AdvancedSearchModal';
import { FilterPreset, saveFilterPreset, getFilterPresets, deleteFilterPreset } from '../utils/filterUtils';
import { toast } from 'react-toastify';

interface FilterPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (filters: AdvancedFilters) => void;
  currentFilters: AdvancedFilters;
}

export const FilterPresetsModal: React.FC<FilterPresetsModalProps> = ({
  isOpen,
  onClose,
  onLoadPreset,
  currentFilters,
}) => {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPresets();
    }
  }, [isOpen]);

  const loadPresets = () => {
    setPresets(getFilterPresets());
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    try {
      const savedPreset = saveFilterPreset({
        name: newPresetName.trim(),
        filters: currentFilters,
      });
      
      setPresets([...presets, savedPreset]);
      setNewPresetName('');
      setShowSaveForm(false);
      toast.success('Filter preset saved successfully');
    } catch (error) {
      toast.error('Failed to save filter preset');
    }
  };

  const handleDeletePreset = (presetId: string) => {
    if (!window.confirm('Are you sure you want to delete this preset?')) {
      return;
    }

    try {
      deleteFilterPreset(presetId);
      setPresets(presets.filter(p => p.id !== presetId));
      toast.success('Filter preset deleted');
    } catch (error) {
      toast.error('Failed to delete filter preset');
    }
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    onLoadPreset(preset.filters);
    onClose();
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const getFilterSummary = (filters: AdvancedFilters): string => {
    const parts: string[] = [];
    
    if (filters.searchTerm) {
      parts.push(`Search: "${filters.searchTerm}"`);
    }
    
    if (filters.status.length > 0) {
      parts.push(`Status: ${filters.status.slice(0, 2).join(', ')}${filters.status.length > 2 ? '...' : ''}`);
    }
    
    if (filters.dateRange.field && filters.dateRange.startDate) {
      parts.push(`Date: ${filters.dateRange.field}`);
    }
    
    if (filters.containerSize.length > 0) {
      parts.push(`Size: ${filters.containerSize.join(', ')}`);
    }
    
    if (filters.shipline.length > 0) {
      parts.push(`Shipline: ${filters.shipline.slice(0, 2).join(', ')}${filters.shipline.length > 2 ? '...' : ''}`);
    }
    
    if (filters.vendor) {
      parts.push(`Vendor: ${filters.vendor}`);
    }
    
    if (filters.rail) {
      parts.push(`Rail: ${filters.rail === 'true' ? 'Yes' : 'No'}`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <BookmarkIcon className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Filter Presets</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Save Current Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Save Current Filters</h3>
              <button
                onClick={() => setShowSaveForm(!showSaveForm)}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Save Preset
              </button>
            </div>
            
            {showSaveForm && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current filters:</p>
                  <p className="text-xs text-gray-500">{getFilterSummary(currentFilters)}</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Enter preset name..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
                  />
                  <button
                    onClick={handleSavePreset}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveForm(false);
                      setNewPresetName('');
                    }}
                    className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Presets */}
          <div>
            <h3 className="text-lg font-medium mb-4">Saved Presets</h3>
            
            {presets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookmarkIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No saved presets yet</p>
                <p className="text-sm">Save your current filters to quickly access them later</p>
              </div>
            ) : (
              <div className="space-y-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleLoadPreset(preset)}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{preset.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(preset.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {getFilterSummary(preset.filters)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleLoadPreset(preset)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};