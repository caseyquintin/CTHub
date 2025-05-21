import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container } from '../types';
import { useAppContext } from '../context/AppContext';
import { 
  getDropdownOptionsByCategory, 
  getPorts, 
  getTerminalsByPort, 
  getVesselLines, 
  getVesselsByLine 
} from '../api';

interface ContainerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  container?: Container;
  onSubmit: (container: Partial<Container>) => void;
}

// Validation schema
const ContainerSchema = Yup.object().shape({
  ContainerNumber: Yup.string().required('Required'),
  ProjectNumber: Yup.string(),
  CurrentStatus: Yup.string(),
  ContainerSize: Yup.string(),
  BOLBookingNumber: Yup.string(),
  Vendor: Yup.string(),
  PONumber: Yup.string(),
  Voyage: Yup.string(),
  PortOfEntry: Yup.string(),
  Rail: Yup.boolean(),
});

export const ContainerFormModal: React.FC<ContainerFormModalProps> = ({
  isOpen,
  onClose,
  container,
  onSubmit,
}) => {
  const { state } = useAppContext();
  const [statusOptions, setStatusOptions] = useState<{Id: number, Value: string}[]>([]);
  const [sizeOptions, setSizeOptions] = useState<{Id: number, Value: string}[]>([]);
  const [actualEstimateOptions, setActualEstimateOptions] = useState<{Id: number, Value: string}[]>([]);
  const [ports, setPorts] = useState<{portID: number, portOfEntry: string}[]>([]);
  const [terminals, setTerminals] = useState<{terminalID: number, terminalName: string}[]>([]);
  const [vesselLines, setVesselLines] = useState<{vesselLineID: number, vesselLineName: string}[]>([]);
  const [vessels, setVessels] = useState<{vesselID: number, vesselName: string}[]>([]);
  
  // Track selected port and vessel line for cascading dropdowns
  const [selectedPortId, setSelectedPortId] = useState<number | undefined>(container?.PortID);
  const [selectedVesselLineId, setSelectedVesselLineId] = useState<number | undefined>(container?.VesselLineID);

  // Initialize form for editing
  const initialValues: Partial<Container> = container || {
    ContainerNumber: '',
    ProjectNumber: '',
    CurrentStatus: '',
    ShiplineID: undefined,
    ContainerSize: '',
    MainSource: '',
    Transload: '',
    BOLBookingNumber: '',
    VendorIDNumber: '',
    Vendor: '',
    PONumber: '',
    VesselLineID: undefined,
    VesselID: undefined,
    Voyage: '',
    PortOfDeparture: '',
    PortID: undefined,
    PortOfEntry: '',
    TerminalID: undefined,
    Rail: '',
    RailDestination: '',
    RailwayLine: '',
    RailPickupNumber: '',
    CarrierID: undefined,
    Carrier: '',
    Sail: undefined,
    SailActual: 'Estimate',
    Berth: undefined,
    BerthActual: 'Estimate',
    Arrival: undefined,
    ArrivalActual: 'Estimate',
    Offload: undefined,
    OffloadActual: 'Estimate',
    Available: undefined,
    PickupLFD: undefined,
    PortRailwayPickup: undefined,
    ReturnLFD: undefined,
    LoadToRail: undefined,
    RailDeparture: undefined,
    RailETA: undefined,
    Delivered: undefined,
    Returned: undefined,
    Notes: '',
  };

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [statusOpts, sizeOpts, actualEstimateOpts, portsData, vesselLinesData] = await Promise.all([
          getDropdownOptionsByCategory('ContainerStatus'),
          getDropdownOptionsByCategory('ContainerSize'),
          getDropdownOptionsByCategory('ActualEstimate'),
          getPorts(),
          getVesselLines()
        ]);
        
        setStatusOptions(statusOpts);
        setSizeOptions(sizeOpts);
        setActualEstimateOptions(actualEstimateOpts);
        setPorts(portsData);
        setVesselLines(vesselLinesData);
        
        // Load related data if editing
        if (container) {
          if (container.PortID) {
            const terminalsData = await getTerminalsByPort(container.PortID);
            setTerminals(terminalsData);
          }
          
          if (container.VesselLineID) {
            const vesselsData = await getVesselsByLine(container.VesselLineID);
            setVessels(vesselsData);
          }
        }
      } catch (error) {
        console.error('Error loading form options:', error);
      }
    };
    
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen, container]);

  // Handle port selection change
  const handlePortChange = async (portId: number) => {
    setSelectedPortId(portId);
    try {
      const terminalsData = await getTerminalsByPort(portId);
      setTerminals(terminalsData);
    } catch (error) {
      console.error('Error loading terminals:', error);
    }
  };

  // Handle vessel line selection change
  const handleVesselLineChange = async (vesselLineId: number) => {
    setSelectedVesselLineId(vesselLineId);
    try {
      const vesselsData = await getVesselsByLine(vesselLineId);
      setVessels(vesselsData);
    } catch (error) {
      console.error('Error loading vessels:', error);
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

        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              {container ? 'Edit Container' : 'Add New Container'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={ContainerSchema}
            onSubmit={(values) => {
              // Convert boolean values to strings for database
              if (typeof values.Rail === 'boolean') {
                values.Rail = values.Rail ? 'Yes' : 'No';
              }
              if (typeof values.Transload === 'boolean') {
                values.Transload = values.Transload ? 'Yes' : 'No';
              }
              
              onSubmit(values);
              onClose();
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Accordion Sections */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="ContainerNumber" className="block text-sm font-medium text-gray-700">
                          Container Number*
                        </label>
                        <Field
                          type="text"
                          name="ContainerNumber"
                          id="ContainerNumber"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <ErrorMessage name="ContainerNumber" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="ProjectNumber" className="block text-sm font-medium text-gray-700">
                          Project Number
                        </label>
                        <Field
                          type="text"
                          name="ProjectNumber"
                          id="ProjectNumber"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="CurrentStatus" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <Field
                          as="select"
                          name="CurrentStatus"
                          id="CurrentStatus"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((option) => (
                            <option key={option.Id} value={option.Value}>
                              {option.Value}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="ContainerSize" className="block text-sm font-medium text-gray-700">
                          Container Size
                        </label>
                        <Field
                          as="select"
                          name="ContainerSize"
                          id="ContainerSize"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select Size</option>
                          {sizeOptions.map((option) => (
                            <option key={option.Id} value={option.Value}>
                              {option.Value}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="BOLBookingNumber" className="block text-sm font-medium text-gray-700">
                          BOL/Booking Number
                        </label>
                        <Field
                          type="text"
                          name="BOLBookingNumber"
                          id="BOLBookingNumber"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="Transload" className="block text-sm font-medium text-gray-700">
                          Transload
                        </label>
                        <Field
                          as="select"
                          name="Transload"
                          id="Transload"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Vendor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="Vendor" className="block text-sm font-medium text-gray-700">
                          Vendor
                        </label>
                        <Field
                          type="text"
                          name="Vendor"
                          id="Vendor"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="VendorIDNumber" className="block text-sm font-medium text-gray-700">
                          Vendor ID Number
                        </label>
                        <Field
                          type="text"
                          name="VendorIDNumber"
                          id="VendorIDNumber"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="PONumber" className="block text-sm font-medium text-gray-700">
                          PO Number
                        </label>
                        <Field
                          type="text"
                          name="PONumber"
                          id="PONumber"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vessel Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Vessel Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="VesselLineID" className="block text-sm font-medium text-gray-700">
                          Vessel Line
                        </label>
                        <Field
                          as="select"
                          name="VesselLineID"
                          id="VesselLineID"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue('VesselLineID', e.target.value ? Number(e.target.value) : undefined);
                            setFieldValue('VesselID', undefined); // Reset vessel when line changes
                            if (e.target.value) {
                              handleVesselLineChange(Number(e.target.value));
                            }
                          }}
                        >
                          <option value="">Select Vessel Line</option>
                          {vesselLines.map((line) => (
                            <option key={line.vesselLineID} value={line.vesselLineID}>
                              {line.vesselLineName}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="VesselID" className="block text-sm font-medium text-gray-700">
                          Vessel
                        </label>
                        <Field
                          as="select"
                          name="VesselID"
                          id="VesselID"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          disabled={!selectedVesselLineId}
                        >
                          <option value="">Select Vessel</option>
                          {vessels.map((vessel) => (
                            <option key={vessel.vesselID} value={vessel.vesselID}>
                              {vessel.vesselName}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="Voyage" className="block text-sm font-medium text-gray-700">
                          Voyage
                        </label>
                        <Field
                          type="text"
                          name="Voyage"
                          id="Voyage"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Port Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Port Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="PortOfDeparture" className="block text-sm font-medium text-gray-700">
                          Port of Departure
                        </label>
                        <Field
                          type="text"
                          name="PortOfDeparture"
                          id="PortOfDeparture"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="PortID" className="block text-sm font-medium text-gray-700">
                          Port of Entry
                        </label>
                        <Field
                          as="select"
                          name="PortID"
                          id="PortID"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue('PortID', e.target.value ? Number(e.target.value) : undefined);
                            setFieldValue('TerminalID', undefined); // Reset terminal when port changes
                            
                            // Get port name for PortOfEntry field
                            if (e.target.value) {
                              const portId = Number(e.target.value);
                              const selectedPort = ports.find(p => p.portID === portId);
                              if (selectedPort) {
                                setFieldValue('PortOfEntry', selectedPort.portOfEntry);
                              }
                              handlePortChange(portId);
                            }
                          }}
                        >
                          <option value="">Select Port</option>
                          {ports.map((port) => (
                            <option key={port.portID} value={port.portID}>
                              {port.portOfEntry}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="TerminalID" className="block text-sm font-medium text-gray-700">
                          Terminal
                        </label>
                        <Field
                          as="select"
                          name="TerminalID"
                          id="TerminalID"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          disabled={!selectedPortId}
                        >
                          <option value="">Select Terminal</option>
                          {terminals.map((terminal) => (
                            <option key={terminal.terminalID} value={terminal.terminalID}>
                              {terminal.terminalName}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Rail Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Rail Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="Rail" className="block text-sm font-medium text-gray-700">
                          Rail
                        </label>
                        <Field
                          as="select"
                          name="Rail"
                          id="Rail"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="RailDestination" className="block text-sm font-medium text-gray-700">
                          Rail Destination
                        </label>
                        <Field
                          type="text"
                          name="RailDestination"
                          id="RailDestination"
                          disabled={!values.Rail}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="RailwayLine" className="block text-sm font-medium text-gray-700">
                          Railway Line
                        </label>
                        <Field
                          type="text"
                          name="RailwayLine"
                          id="RailwayLine"
                          disabled={!values.Rail}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="RailPickupNumber" className="block text-sm font-medium text-gray-700">
                          Rail Pickup Number
                        </label>
                        <Field
                          type="text"
                          name="RailPickupNumber"
                          id="RailPickupNumber"
                          disabled={!values.Rail}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carrier Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Carrier Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="Carrier" className="block text-sm font-medium text-gray-700">
                          Carrier
                        </label>
                        <Field
                          type="text"
                          name="Carrier"
                          id="Carrier"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Date Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="Sail" className="block text-sm font-medium text-gray-700">
                          Sail Date
                        </label>
                        <DatePicker
                          selected={values.Sail ? new Date(values.Sail) : null}
                          onChange={(date) => setFieldValue('Sail', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="SailActual" className="block text-sm font-medium text-gray-700">
                          Sail Actual/Estimate
                        </label>
                        <Field
                          as="select"
                          name="SailActual"
                          id="SailActual"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          {actualEstimateOptions.map((option) => (
                            <option key={option.Id} value={option.Value}>
                              {option.Value}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="Arrival" className="block text-sm font-medium text-gray-700">
                          Arrival Date
                        </label>
                        <DatePicker
                          selected={values.Arrival ? new Date(values.Arrival) : null}
                          onChange={(date) => setFieldValue('Arrival', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="ArrivalActual" className="block text-sm font-medium text-gray-700">
                          Arrival Actual/Estimate
                        </label>
                        <Field
                          as="select"
                          name="ArrivalActual"
                          id="ArrivalActual"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          {actualEstimateOptions.map((option) => (
                            <option key={option.Id} value={option.Value}>
                              {option.Value}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <label htmlFor="Available" className="block text-sm font-medium text-gray-700">
                          Available Date
                        </label>
                        <DatePicker
                          selected={values.Available ? new Date(values.Available) : null}
                          onChange={(date) => setFieldValue('Available', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="PickupLFD" className="block text-sm font-medium text-gray-700">
                          Pickup LFD
                        </label>
                        <DatePicker
                          selected={values.PickupLFD ? new Date(values.PickupLFD) : null}
                          onChange={(date) => setFieldValue('PickupLFD', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="ReturnLFD" className="block text-sm font-medium text-gray-700">
                          Return LFD
                        </label>
                        <DatePicker
                          selected={values.ReturnLFD ? new Date(values.ReturnLFD) : null}
                          onChange={(date) => setFieldValue('ReturnLFD', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="Delivered" className="block text-sm font-medium text-gray-700">
                          Delivered Date
                        </label>
                        <DatePicker
                          selected={values.Delivered ? new Date(values.Delivered) : null}
                          onChange={(date) => setFieldValue('Delivered', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="Returned" className="block text-sm font-medium text-gray-700">
                          Returned Date
                        </label>
                        <DatePicker
                          selected={values.Returned ? new Date(values.Returned) : null}
                          onChange={(date) => setFieldValue('Returned', date)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Notes</h3>
                    <div>
                      <Field
                        as="textarea"
                        name="Notes"
                        id="Notes"
                        rows={3}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {container ? 'Update' : 'Create'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
};