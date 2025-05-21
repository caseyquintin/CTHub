import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from '../context/AppContext';
import { Container } from '../types';
import { getDropdownOptionsByCategory, getPorts, getVesselLines } from '../api';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: Record<string, any>, ids: number[]) => Promise<void>;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { state } = useAppContext();
  const { selectedContainers } = state;
  const [fieldSelections, setFieldSelections] = useState<Record<string, boolean>>({});
  const [statusOptions, setStatusOptions] = useState<{Id: number, Value: string}[]>([]);
  const [sizeOptions, setSizeOptions] = useState<{Id: number, Value: string}[]>([]);
  const [ports, setPorts] = useState<{portID: number, portOfEntry: string}[]>([]);
  const [vesselLines, setVesselLines] = useState<{vesselLineID: number, vesselLineName: string}[]>([]);

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [statusOpts, sizeOpts, portsData, vesselLinesData] = await Promise.all([
          getDropdownOptionsByCategory('ContainerStatus'),
          getDropdownOptionsByCategory('ContainerSize'),
          getPorts(),
          getVesselLines()
        ]);
        
        setStatusOptions(statusOpts);
        setSizeOptions(sizeOpts);
        setPorts(portsData);
        setVesselLines(vesselLinesData);
      } catch (error) {
        console.error('Error loading form options:', error);
      }
    };
    
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  // Toggle field selection
  const toggleFieldSelection = (field: string) => {
    setFieldSelections((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const initialValues: Partial<Container> = {
    CurrentStatus: '',
    ContainerSize: '',
    Rail: '',
    Sail: undefined,
    Arrival: undefined,
    Available: undefined,
    PickupLFD: undefined,
    ReturnLFD: undefined,
    Delivered: undefined,
    Returned: undefined,
    PortID: undefined,
    VesselLineID: undefined,
    Notes: '',
  };

  const handleSubmit = async (values: Partial<Container>) => {
    // Filter out fields that weren't selected
    const updates: Record<string, any> = {};
    
    Object.keys(fieldSelections).forEach((field) => {
      if (fieldSelections[field] && values[field as keyof typeof values] !== undefined) {
        updates[field] = values[field as keyof typeof values];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }
    
    const ids = selectedContainers.map((c) => c.ContainerID);
    await onSubmit(updates, ids);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Bulk Edit {selectedContainers.length} Container{selectedContainers.length !== 1 ? 's' : ''}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {selectedContainers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No containers selected for bulk edit.</p>
            </div>
          ) : (
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-md font-medium mb-2">Select fields to update</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.CurrentStatus || false}
                          onChange={() => toggleFieldSelection('CurrentStatus')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Status</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.ContainerSize || false}
                          onChange={() => toggleFieldSelection('ContainerSize')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Container Size</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Rail || false}
                          onChange={() => toggleFieldSelection('Rail')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Rail</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.PortID || false}
                          onChange={() => toggleFieldSelection('PortID')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Port of Entry</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.VesselLineID || false}
                          onChange={() => toggleFieldSelection('VesselLineID')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Vessel Line</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Sail || false}
                          onChange={() => toggleFieldSelection('Sail')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Sail Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Arrival || false}
                          onChange={() => toggleFieldSelection('Arrival')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Arrival Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Available || false}
                          onChange={() => toggleFieldSelection('Available')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Available Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.PickupLFD || false}
                          onChange={() => toggleFieldSelection('PickupLFD')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Pickup LFD</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.ReturnLFD || false}
                          onChange={() => toggleFieldSelection('ReturnLFD')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Return LFD</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Delivered || false}
                          onChange={() => toggleFieldSelection('Delivered')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Delivered Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Returned || false}
                          onChange={() => toggleFieldSelection('Returned')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Returned Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={fieldSelections.Notes || false}
                          onChange={() => toggleFieldSelection('Notes')}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Notes</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-md font-medium mb-3">Set new values for selected fields</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {fieldSelections.CurrentStatus && (
                        <div>
                          <label htmlFor="CurrentStatus" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <Field
                            as="select"
                            name="CurrentStatus"
                            id="CurrentStatus"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select Status</option>
                            {statusOptions.map((option) => (
                              <option key={option.Id} value={option.Value}>
                                {option.Value}
                              </option>
                            ))}
                          </Field>
                        </div>
                      )}

                      {fieldSelections.ContainerSize && (
                        <div>
                          <label htmlFor="ContainerSize" className="block text-sm font-medium text-gray-700">
                            Container Size
                          </label>
                          <Field
                            as="select"
                            name="ContainerSize"
                            id="ContainerSize"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select Size</option>
                            {sizeOptions.map((option) => (
                              <option key={option.Id} value={option.Value}>
                                {option.Value}
                              </option>
                            ))}
                          </Field>
                        </div>
                      )}

                      {fieldSelections.Rail && (
                        <div>
                          <label htmlFor="Rail" className="block text-sm font-medium text-gray-700">
                            Rail
                          </label>
                          <Field
                            as="select"
                            name="Rail"
                            id="Rail"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </Field>
                        </div>
                      )}

                      {fieldSelections.PortID && (
                        <div>
                          <label htmlFor="PortID" className="block text-sm font-medium text-gray-700">
                            Port of Entry
                          </label>
                          <Field
                            as="select"
                            name="PortID"
                            id="PortID"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select Port</option>
                            {ports.map((port) => (
                              <option key={port.portID} value={port.portID}>
                                {port.portOfEntry}
                              </option>
                            ))}
                          </Field>
                        </div>
                      )}

                      {fieldSelections.VesselLineID && (
                        <div>
                          <label htmlFor="VesselLineID" className="block text-sm font-medium text-gray-700">
                            Vessel Line
                          </label>
                          <Field
                            as="select"
                            name="VesselLineID"
                            id="VesselLineID"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select Vessel Line</option>
                            {vesselLines.map((line) => (
                              <option key={line.vesselLineID} value={line.vesselLineID}>
                                {line.vesselLineName}
                              </option>
                            ))}
                          </Field>
                        </div>
                      )}

                      {fieldSelections.Sail && (
                        <div>
                          <label htmlFor="Sail" className="block text-sm font-medium text-gray-700">
                            Sail Date
                          </label>
                          <DatePicker
                            selected={values.Sail ? new Date(values.Sail) : null}
                            onChange={(date) => setFieldValue('Sail', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.Arrival && (
                        <div>
                          <label htmlFor="Arrival" className="block text-sm font-medium text-gray-700">
                            Arrival Date
                          </label>
                          <DatePicker
                            selected={values.Arrival ? new Date(values.Arrival) : null}
                            onChange={(date) => setFieldValue('Arrival', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.Available && (
                        <div>
                          <label htmlFor="Available" className="block text-sm font-medium text-gray-700">
                            Available Date
                          </label>
                          <DatePicker
                            selected={values.Available ? new Date(values.Available) : null}
                            onChange={(date) => setFieldValue('Available', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.PickupLFD && (
                        <div>
                          <label htmlFor="PickupLFD" className="block text-sm font-medium text-gray-700">
                            Pickup LFD
                          </label>
                          <DatePicker
                            selected={values.PickupLFD ? new Date(values.PickupLFD) : null}
                            onChange={(date) => setFieldValue('PickupLFD', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.ReturnLFD && (
                        <div>
                          <label htmlFor="ReturnLFD" className="block text-sm font-medium text-gray-700">
                            Return LFD
                          </label>
                          <DatePicker
                            selected={values.ReturnLFD ? new Date(values.ReturnLFD) : null}
                            onChange={(date) => setFieldValue('ReturnLFD', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.Delivered && (
                        <div>
                          <label htmlFor="Delivered" className="block text-sm font-medium text-gray-700">
                            Delivered Date
                          </label>
                          <DatePicker
                            selected={values.Delivered ? new Date(values.Delivered) : null}
                            onChange={(date) => setFieldValue('Delivered', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}

                      {fieldSelections.Returned && (
                        <div>
                          <label htmlFor="Returned" className="block text-sm font-medium text-gray-700">
                            Returned Date
                          </label>
                          <DatePicker
                            selected={values.Returned ? new Date(values.Returned) : null}
                            onChange={(date) => setFieldValue('Returned', date)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    {fieldSelections.Notes && (
                      <div className="mt-4">
                        <label htmlFor="Notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <Field
                          as="textarea"
                          name="Notes"
                          id="Notes"
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || Object.values(fieldSelections).every((v) => !v)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                      Update Containers
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </Dialog>
  );
};