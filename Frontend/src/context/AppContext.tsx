import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Container, DropdownOption, ColumnVisibility } from '../types';

// Define the state structure
interface AppState {
  containers: Container[];
  loading: boolean;
  error: string | null;
  selectedContainers: Container[];
  dropdownOptions: DropdownOption[];
  columnVisibility: ColumnVisibility;
  currentView: string;
}

// Define the possible action types
type AppAction =
  | { type: 'SET_CONTAINERS'; payload: Container[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_CONTAINER'; payload: Container }
  | { type: 'DESELECT_CONTAINER'; payload: number }
  | { type: 'SELECT_ALL_CONTAINERS' }
  | { type: 'DESELECT_ALL_CONTAINERS' }
  | { type: 'SET_DROPDOWN_OPTIONS'; payload: DropdownOption[] }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; payload: string }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: ColumnVisibility }
  | { type: 'SET_CURRENT_VIEW'; payload: string };

// Define the context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the initial state
const initialState: AppState = {
  containers: [],
  loading: false,
  error: null,
  selectedContainers: [],
  dropdownOptions: [],
  columnVisibility: {
    ContainerNumber: true,
    ProjectNumber: true,
    CurrentStatus: true,
    Shipline: true,
    shiplineId: true,
    ContainerSize: true,
    MainSource: false,
    Transload: false,
    BOLBookingNumber: true,
    VendorIDNumber: false,
    Vendor: true,
    PONumber: true,
    VesselLine: true,
    VesselName: true,
    Voyage: true,
    PortOfDeparture: false,
    PortOfEntry: true,
    Terminal: true,
    Rail: true,
    RailDestination: false,
    RailwayLine: false,
    RailPickupNumber: false,
    Carrier: false,
    Sail: true,
    Berth: false,
    Arrival: true,
    Offload: false,
    Available: true,
    PickupLFD: true,
    PortRailwayPickup: false,
    ReturnLFD: true,
    LoadToRail: false,
    RailDeparture: false,
    RailETA: false,
    Delivered: true,
    Returned: true,
    LastUpdated: false,
    Notes: false,
  },
  currentView: 'All',
};

// Create the reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CONTAINERS':
      return { ...state, containers: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SELECT_CONTAINER':
      return {
        ...state,
        selectedContainers: [...state.selectedContainers, action.payload],
      };
    case 'DESELECT_CONTAINER':
      return {
        ...state,
        selectedContainers: state.selectedContainers.filter(
          (c) => c.ContainerID !== action.payload
        ),
      };
    case 'SELECT_ALL_CONTAINERS':
      return { ...state, selectedContainers: [...state.containers] };
    case 'DESELECT_ALL_CONTAINERS':
      return { ...state, selectedContainers: [] };
    case 'SET_DROPDOWN_OPTIONS':
      return { ...state, dropdownOptions: action.payload };
    case 'TOGGLE_COLUMN_VISIBILITY':
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [action.payload]: !state.columnVisibility[action.payload],
        },
      };
    case 'SET_COLUMN_VISIBILITY':
      return { ...state, columnVisibility: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
};

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};