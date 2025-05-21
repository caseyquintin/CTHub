import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import { ColumnVisibility } from '../types';

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, dispatch } = useAppContext();
  const { columnVisibility } = state;

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    dispatch({ type: 'TOGGLE_COLUMN_VISIBILITY', payload: columnId });
  };

  // Reset to default column visibility
  const resetToDefaults = () => {
    const defaultVisibility: ColumnVisibility = {
      containerNumber: true,
      projectNumber: true,
      currentStatus: true,
      shipline: true,
      containerSize: true,
      mainSource: false,
      transload: false,
      bolBookingNumber: true,
      vendorIDNumber: false,
      vendor: true,
      poNumber: true,
      vesselLine: true,
      vesselName: true,
      voyage: true,
      portOfDeparture: false,
      portOfEntry: true,
      terminal: true,
      rail: true,
      railDestination: false,
      railwayLine: false,
      railPickupNumber: false,
      carrier: false,
      sail: true,
      berth: false,
      arrival: true,
      offload: false,
      available: true,
      pickupLFD: true,
      portRailwayPickup: false,
      returnLFD: true,
      loadToRail: false,
      railDeparture: false,
      railETA: false,
      delivered: true,
      returned: true,
      lastUpdated: false,
      notes: false,
    };
    
    dispatch({ type: 'SET_COLUMN_VISIBILITY', payload: defaultVisibility });
  };

  // Column groups
  const columnGroups = [
    {
      name: 'Basic Info',
      columns: [
        { id: 'containerNumber', label: 'Container Number' },
        { id: 'projectNumber', label: 'Project Number' },
        { id: 'currentStatus', label: 'Status' },
        { id: 'containerSize', label: 'Container Size' },
        { id: 'mainSource', label: 'Main Source' },
        { id: 'transload', label: 'Transload' },
      ],
    },
    {
      name: 'Shipping Details',
      columns: [
        { id: 'bolBookingNumber', label: 'BOL/Booking Number' },
        { id: 'vendorIDNumber', label: 'Vendor ID Number' },
        { id: 'vendor', label: 'Vendor' },
        { id: 'poNumber', label: 'PO Number' },
        { id: 'shipline', label: 'Shipline' },
      ],
    },
    {
      name: 'Vessel Info',
      columns: [
        { id: 'vesselLine', label: 'Vessel Line' },
        { id: 'vesselName', label: 'Vessel' },
        { id: 'voyage', label: 'Voyage' },
      ],
    },
    {
      name: 'Port & Terminal',
      columns: [
        { id: 'portOfDeparture', label: 'Port of Departure' },
        { id: 'portOfEntry', label: 'Port of Entry' },
        { id: 'terminal', label: 'Terminal' },
      ],
    },
    {
      name: 'Rail & Carrier',
      columns: [
        { id: 'rail', label: 'Rail' },
        { id: 'railDestination', label: 'Rail Destination' },
        { id: 'railwayLine', label: 'Railway Line' },
        { id: 'railPickupNumber', label: 'Rail Pickup Number' },
        { id: 'carrier', label: 'Carrier' },
      ],
    },
    {
      name: 'Dates',
      columns: [
        { id: 'sail', label: 'Sail' },
        { id: 'berth', label: 'Berth' },
        { id: 'arrival', label: 'Arrival' },
        { id: 'offload', label: 'Offload' },
        { id: 'available', label: 'Available' },
        { id: 'pickupLFD', label: 'Pickup LFD' },
        { id: 'portRailwayPickup', label: 'Port Railway Pickup' },
        { id: 'returnLFD', label: 'Return LFD' },
        { id: 'loadToRail', label: 'Load to Rail' },
        { id: 'railDeparture', label: 'Rail Departure' },
        { id: 'railETA', label: 'Rail ETA' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'returned', label: 'Returned' },
        { id: 'lastUpdated', label: 'Last Updated' },
      ],
    },
    {
      name: 'Other',
      columns: [
        { id: 'notes', label: 'Notes' },
      ],
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Column Visibility
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {columnGroups.map((group) => (
              <div key={group.name} className="mb-6">
                <h3 className="text-md font-medium mb-3 border-b pb-2">{group.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.columns.map((column) => (
                    <label key={column.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={columnVisibility[column.id] || false}
                        onChange={() => toggleColumnVisibility(column.id)}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">{column.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={resetToDefaults}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};