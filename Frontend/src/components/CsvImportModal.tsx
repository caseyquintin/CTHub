import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { parse } from 'papaparse';
import { Container } from '../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (containers: Partial<Container>[]) => Promise<void>;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerFields = [
    { id: 'ContainerNumber', label: 'Container Number' },
    { id: 'ProjectNumber', label: 'Project Number' },
    { id: 'CurrentStatus', label: 'Status' },
    { id: 'ContainerSize', label: 'Container Size' },
    { id: 'BOLBookingNumber', label: 'BOL/Booking Number' },
    { id: 'Vendor', label: 'Vendor' },
    { id: 'PONumber', label: 'PO Number' },
    { id: 'Voyage', label: 'Voyage' },
    { id: 'PortOfDeparture', label: 'Port of Departure' },
    { id: 'PortOfEntry', label: 'Port of Entry' },
    { id: 'RailDestination', label: 'Rail Destination' },
    { id: 'Carrier', label: 'Carrier' },
    { id: 'Sail', label: 'Sail Date' },
    { id: 'Arrival', label: 'Arrival Date' },
    { id: 'Available', label: 'Available Date' },
    { id: 'PickupLFD', label: 'Pickup LFD' },
    { id: 'ReturnLFD', label: 'Return LFD' },
    { id: 'Delivered', label: 'Delivered Date' },
    { id: 'Returned', label: 'Returned Date' },
    { id: 'Notes', label: 'Notes' },
  ];

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview([]);
      setColumnMapping({});
      setAvailableFields([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Parse CSV for preview
      parse(selectedFile, {
        header: true,
        preview: 5,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data);
          // Get CSV headers for mapping
          if (results.meta.fields) {
            setAvailableFields(results.meta.fields);
            
            // Try to auto-map columns based on header names
            const autoMapping: Record<string, string> = {};
            results.meta.fields.forEach(field => {
              const normalizedField = field.toLowerCase().trim();
              
              // Try to find matching container field
              const matchingField = containerFields.find(cf => 
                normalizedField === cf.label.toLowerCase() || 
                normalizedField === cf.id.toLowerCase()
              );
              
              if (matchingField) {
                autoMapping[field] = matchingField.id;
              }
            });
            
            setColumnMapping(autoMapping);
          }
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
        },
      });
    }
  };

  const handleColumnMappingChange = (csvColumn: string, containerField: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [csvColumn]: containerField,
    }));
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    setLoading(true);

    try {
      // Parse the full CSV file
      parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Map CSV data to Container objects
            const containers: Partial<Container>[] = results.data.map((row: any) => {
              const container: Partial<Container> = {};

              // Apply column mapping to convert CSV columns to Container fields
              Object.entries(columnMapping).forEach(([csvColumn, containerField]) => {
                if (containerField && row[csvColumn] !== undefined) {
                  let value = row[csvColumn];

                  // Handle special field conversions
                  if (containerField === 'Rail' || containerField === 'Transload') {
                    // Convert string values to boolean
                    const lowercaseValue = value.toLowerCase();
                    value = lowercaseValue === 'yes' || lowercaseValue === 'true' || lowercaseValue === '1';
                  } else if (
                    containerField.includes('Date') || 
                    ['Sail', 'Berth', 'Arrival', 'Offload', 'Available', 'PickupLFD', 
                     'PortRailwayPickup', 'ReturnLFD', 'LoadToRail', 'RailDeparture', 
                     'RailETA', 'Delivered', 'Returned'].includes(containerField)
                  ) {
                    // Convert date strings to Date objects
                    if (value) {
                      try {
                        value = new Date(value);
                      } catch (error) {
                        console.warn(`Could not parse date: ${value}`, error);
                      }
                    } else {
                      value = undefined;
                    }
                  }

                  container[containerField as keyof Container] = value;
                }
              });

              return container;
            });

            // Validate minimum required fields
            const validContainers = containers.filter(container => 
              container.ContainerNumber && container.ContainerNumber.trim() !== ''
            );

            if (validContainers.length === 0) {
              toast.error('No valid containers found in CSV. Make sure to map Container Number field correctly.');
              setLoading(false);
              return;
            }

            await onImport(validContainers);
            toast.success(`Successfully imported ${validContainers.length} containers`);
            onClose();
          } catch (error) {
            console.error('Error processing CSV data:', error);
            toast.error('Error processing CSV data. Check console for details.');
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Error importing CSV file. Check console for details.');
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Import Containers from CSV
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
              </div>
              {file && <p className="mt-2 text-sm text-gray-500">File: {file.name}</p>}
            </div>

            {/* CSV Preview */}
            {preview.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium mb-3">Preview</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {availableFields.map((field) => (
                          <th
                            key={field}
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((row, index) => (
                        <tr key={index}>
                          {availableFields.map((field) => (
                            <td
                              key={field}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                            >
                              {row[field]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Column Mapping */}
            {availableFields.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium mb-3">Map CSV Columns to Container Fields</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableFields.map((csvColumn) => (
                    <div key={csvColumn} className="flex items-center space-x-2">
                      <span className="text-sm font-medium min-w-[150px]">{csvColumn}:</span>
                      <select
                        value={columnMapping[csvColumn] || ''}
                        onChange={(e) => handleColumnMappingChange(csvColumn, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">-- Skip Column --</option>
                        {containerFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!file || loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Importing...' : 'Import Containers'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};