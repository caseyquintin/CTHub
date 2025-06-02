import { Container, DropdownOption, Port, Terminal, Shipline, VesselLine, Vessel } from '../../types';

export const mockContainer: Container = {
  ContainerID: 1,
  ContainerNumber: 'CAAU5462320',
  ProjectNumber: 'P123456',
  CurrentStatus: 'At Port',
  ShiplineID: 1,
  Shipline: {
    ShiplineID: 1,
    ShiplineName: 'Maersk',
    Link: 'https://maersk.com/track',
    IsDynamicLink: true,
  },
  ContainerSize: '40HC',
  MainSource: 'Asia',
  Transload: 'No',
  BOLBookingNumber: 'BOL123456',
  VendorIDNumber: 'V001',
  Vendor: 'Test Vendor',
  PONumber: 'PO123456',
  VesselLineID: 1,
  VesselLine: {
    vesselLineID: 1,
    vesselLineName: 'MSC',
    link: 'https://msc.com/track',
    isDynamicLink: true,
  },
  VesselID: 1,
  Vessel: {
    vesselID: 1,
    vesselName: 'MSC GENEVA',
    vesselLineID: 1,
    imo: '1234567',
    mmsi: '987654321',
  },
  Voyage: 'V001N',
  PortOfDeparture: 'Shanghai',
  PortID: 1,
  Port: {
    portID: 1,
    portOfEntry: 'Los Angeles',
  },
  PortOfEntry: 'Los Angeles',
  TerminalID: 1,
  Terminal: {
    terminalID: 1,
    terminalName: 'APM Terminals',
    portID: 1,
    link: 'https://apm.com/track',
  },
  Rail: 'Yes',
  RailDestination: 'Chicago',
  RailwayLine: 'BNSF',
  RailPickupNumber: 'R123456',
  CarrierID: 1,
  Carrier: 'BNSF Railway',
  Sail: new Date('2023-06-01'),
  SailActual: '06/01/2023',
  Berth: new Date('2023-06-10'),
  BerthActual: '06/10/2023',
  Arrival: new Date('2023-06-10'),
  ArrivalActual: '06/10/2023',
  Offload: new Date('2023-06-11'),
  OffloadActual: '06/11/2023',
  Available: new Date('2023-06-12'),
  PickupLFD: new Date('2023-06-15'),
  PortRailwayPickup: new Date('2023-06-14'),
  ReturnLFD: new Date('2023-06-20'),
  LoadToRail: new Date('2023-06-16'),
  RailDeparture: new Date('2023-06-17'),
  RailETA: new Date('2023-06-20'),
  Delivered: new Date('2023-06-21'),
  Returned: new Date('2023-06-25'),
  LastUpdated: new Date('2023-06-25'),
  Notes: 'Test container notes',
};

export const mockContainers: Container[] = [
  mockContainer,
  {
    ...mockContainer,
    ContainerID: 2,
    ContainerNumber: 'TCLU7890123',
    CurrentStatus: 'On Vessel',
    Rail: 'No',
    PortOfEntry: 'Long Beach',
  },
  {
    ...mockContainer,
    ContainerID: 3,
    ContainerNumber: 'MSCU4567890',
    CurrentStatus: 'Delivered',
    Rail: 'Yes',
    PortOfEntry: 'Oakland',
  },
];

export const mockDropdownOptions: DropdownOption[] = [
  {
    id: 1,
    category: 'ContainerSize',
    value: '20GP',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    category: 'ContainerSize',
    value: '40GP',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    category: 'ContainerSize',
    value: '40HC',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    category: 'Status',
    value: 'Not Sailed',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 5,
    category: 'Status',
    value: 'On Vessel',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 6,
    category: 'Status',
    value: 'At Port',
    isActive: true,
    sortOrder: 3,
  },
];

export const mockPorts: Port[] = [
  {
    portID: 1,
    portOfEntry: 'Los Angeles',
  },
  {
    portID: 2,
    portOfEntry: 'Long Beach',
  },
  {
    portID: 3,
    portOfEntry: 'Oakland',
  },
];

export const mockTerminals: Terminal[] = [
  {
    terminalID: 1,
    terminalName: 'APM Terminals',
    portID: 1,
    link: 'https://apm.com/track',
  },
  {
    terminalID: 2,
    terminalName: 'LBCT',
    portID: 2,
  },
];

export const mockShiplines: Shipline[] = [
  {
    ShiplineID: 1,
    ShiplineName: 'Maersk',
    Link: 'https://maersk.com/track',
    IsDynamicLink: true,
  },
  {
    ShiplineID: 2,
    ShiplineName: 'MSC',
    Link: 'https://msc.com/track',
    IsDynamicLink: true,
  },
];

export const mockVesselLines: VesselLine[] = [
  {
    vesselLineID: 1,
    vesselLineName: 'MSC',
    link: 'https://msc.com/track',
    isDynamicLink: true,
  },
  {
    vesselLineID: 2,
    vesselLineName: 'Maersk Line',
    link: 'https://maersk.com/track',
    isDynamicLink: true,
  },
];

export const mockVessels: Vessel[] = [
  {
    vesselID: 1,
    vesselName: 'MSC GENEVA',
    vesselLineID: 1,
    imo: '1234567',
    mmsi: '987654321',
  },
  {
    vesselID: 2,
    vesselName: 'Maersk Alabama',
    vesselLineID: 2,
    imo: '7654321',
    mmsi: '123456789',
  },
];

export const mockApiResponse = {
  Data: mockContainers,
  TotalCount: 1442,
  Page: 1,
  PageSize: 100,
  TotalPages: 15,
  HasNextPage: true,
  HasPreviousPage: false,
};