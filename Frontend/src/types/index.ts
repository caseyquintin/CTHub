export interface Container {
  ContainerID: number;
  ContainerNumber: string;
  ProjectNumber?: string;
  CurrentStatus?: string;
  ShiplineID?: number;
  Shipline?: Shipline;
  ContainerSize?: string;
  MainSource?: string;
  Transload?: string;
  BOLBookingNumber?: string;
  VendorIDNumber?: string;
  Vendor?: string;
  PONumber?: string;
  
  // Vessel info
  VesselLineID?: number;
  VesselLine?: VesselLine;
  VesselID?: number;
  Vessel?: Vessel;
  Voyage?: string;
  
  // Port info
  PortOfDeparture?: string;
  PortID?: number;
  Port?: Port;
  PortOfEntry?: string;
  TerminalID?: number;
  Terminal?: Terminal;
  
  // Rail info
  Rail?: string;
  RailDestination?: string;
  RailwayLine?: string;
  RailPickupNumber?: string;
  
  // Carrier info
  CarrierID?: number;
  Carrier?: string;
  
  // Date tracking
  Sail?: Date;
  SailActual?: string;
  Berth?: Date;
  BerthActual?: string;
  Arrival?: Date;
  ArrivalActual?: string;
  Offload?: Date;
  OffloadActual?: string;
  Available?: Date;
  PickupLFD?: Date;
  PortRailwayPickup?: Date;
  ReturnLFD?: Date;
  LoadToRail?: Date;
  RailDeparture?: Date;
  RailETA?: Date;
  Delivered?: Date;
  Returned?: Date;
  LastUpdated?: Date;
  
  // Notes
  Notes?: string;
}

export interface Port {
  portID: number;
  portOfEntry: string;
}

export interface Terminal {
  terminalID: number;
  terminalName: string;
  portID: number;
  link?: string;
}

export interface Shipline {
  shiplineID: number;
  shiplineName: string;
  link?: string;
  isDynamicLink: boolean;
}

export interface VesselLine {
  vesselLineID: number;
  vesselLineName: string;
  link?: string;
  isDynamicLink: boolean;
}

export interface Vessel {
  vesselID: number;
  vesselName: string;
  vesselLineID: number;
  imo?: string;
  mmsi?: string;
}

export interface DropdownOption {
  Id: number;
  Category: string;
  Value: string;
  IsActive: boolean;
  SortOrder: number;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}