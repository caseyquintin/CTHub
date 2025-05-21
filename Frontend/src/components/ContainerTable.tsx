import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTable, useSortBy, useFilters, useRowSelect, Column, TableState } from 'react-table';
import { useAppContext } from '../context/AppContext';
import { Container } from '../types';
import { format, isValid } from 'date-fns';
import { ChevronUpIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/24/solid';
import { InlineEditCell } from './InlineEditCell';
import { patchContainer } from '../api';
import { toast } from 'react-toastify';
import { getShiplineTrackingUrl, getVesselLineTrackingUrl, getTerminalTrackingUrl } from '../utils/linkGenerator';

interface ContainerTableProps {
  onEdit: (container: Container) => void;
  onDelete: (containerIds: number[]) => void;
  filteredContainers?: Container[];
}

// Extend react-table's Column type to include our custom properties
type ColumnWithCustomProperties<D extends object = {}> = Column<D> & {
  visible?: boolean;
};

// Define types for react-table with row selection
interface TableInstanceWithRowSelection<D extends object> extends TableState<D> {
  selectedRowIds: Record<string, boolean>;
}

export const ContainerTable: React.FC<ContainerTableProps> = ({ 
  onEdit, 
  onDelete,
  filteredContainers
}) => {
  const { state: appState, dispatch } = useAppContext();
  const { containers, loading, columnVisibility } = appState;
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Ensure we have valid array data before proceeding
  const ensureArray = (data: any): Container[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.Data)) return data.Data;
    return [];
  };

  // Use filtered containers from props if provided, otherwise use all containers
  const displayedContainers = ensureArray(filteredContainers || containers);
  

  // Format dates for display
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isValid(dateObj) ? format(dateObj, 'MM/dd/yyyy') : '';
    } catch {
      return '';
    }
  };

  // Handle inline cell edit
  const handleCellEdit = async (rowIndex: number, columnId: string, value: any) => {
    try {
      const container = displayedContainers[rowIndex];
      const updates = { [columnId]: value };
      
      await patchContainer(container.ContainerID, updates);
      
      // Update the local state
      const updatedContainers = [...containers];
      const containerIndex = updatedContainers.findIndex(c => c.ContainerID === container.ContainerID);
      
      if (containerIndex !== -1) {
        updatedContainers[containerIndex] = { ...container, [columnId]: value };
        dispatch({ type: 'SET_CONTAINERS', payload: updatedContainers });
      }
      
      setEditingCell(null);
      toast.success('Container updated successfully');
    } catch (error) {
      toast.error('Failed to update container');
      console.error('Error updating container:', error);
    }
  };

  // Status cell styling based on status value
  const getStatusCellStyle = (status: string) => {
    switch (status) {
      case 'Not Sailed':
        return 'bg-blue-50 text-blue-700';
      case 'On Vessel':
        return 'bg-purple-50 text-purple-700';
      case 'At Port':
        return 'bg-yellow-50 text-yellow-700';
      case 'On Rail':
        return 'bg-indigo-50 text-indigo-700';
      case 'Delivered':
        return 'bg-green-50 text-green-700';
      case 'Returned':
        return 'bg-gray-50 text-gray-700';
      default:
        return '';
    }
  };

  // Define columns based on visibility settings
  const columns = useMemo(() => {
    const baseColumns: ColumnWithCustomProperties<Container>[] = [
      {
        Header: 'Container Number',
        accessor: 'ContainerNumber',
        visible: columnVisibility.containerNumber,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Project #',
        accessor: 'ProjectNumber',
        visible: columnVisibility.projectNumber,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Status',
        accessor: 'CurrentStatus',
        visible: columnVisibility.currentStatus,
        Cell: ({ row, value, column }: any) => (
          <div className={`rounded px-2 py-1 ${getStatusCellStyle(value)}`}>
            <InlineEditCell
              value={value}
              row={row}
              column={column}
              onEdit={handleCellEdit}
              isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
              onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
            />
          </div>
        ),
      },
      {
        Header: 'Shipline',
        accessor: (row: Container) => row.Shipline?.shiplineName,
        id: 'shiplineName',
        visible: columnVisibility.shipline,
        Cell: ({ row }: any) => {
          const container = row.original;
          const shipline = container.shipline;
          if (!shipline) return null;
          
          const trackingUrl = getShiplineTrackingUrl(shipline, container);
          
          return (
            <div className="flex items-center">
              <span className="mr-2">{shipline.shiplineName}</span>
              {trackingUrl && (
                <a 
                  href={trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Size',
        accessor: 'ContainerSize',
        visible: columnVisibility.containerSize,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'BOL/Booking #',
        accessor: 'BOLBookingNumber',
        visible: columnVisibility.bolBookingNumber,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Vendor',
        accessor: 'Vendor',
        visible: columnVisibility.vendor,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'PO #',
        accessor: 'PONumber',
        visible: columnVisibility.poNumber,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Vessel Line',
        accessor: (row: Container) => row.VesselLine?.vesselLineName,
        id: 'vesselLineName',
        visible: columnVisibility.vesselLine,
        Cell: ({ row }: any) => {
          const container = row.original;
          const vesselLine = container.vesselLine;
          if (!vesselLine) return null;
          
          const trackingUrl = getVesselLineTrackingUrl(vesselLine, container);
          
          return (
            <div className="flex items-center">
              <span className="mr-2">{vesselLine.vesselLineName}</span>
              {trackingUrl && (
                <a 
                  href={trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Vessel',
        accessor: (row: Container) => row.Vessel?.vesselName,
        id: 'vesselName',
        visible: columnVisibility.vesselName,
        Cell: ({ row }: any) => row.original.vessel?.vesselName || '',
      },
      {
        Header: 'Voyage',
        accessor: 'Voyage',
        visible: columnVisibility.voyage,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Port of Entry',
        accessor: 'PortOfEntry',
        visible: columnVisibility.portOfEntry,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Terminal',
        accessor: (row: Container) => row.Terminal?.terminalName,
        id: 'terminalName',
        visible: columnVisibility.terminal,
        Cell: ({ row }: any) => {
          const container = row.original;
          const terminal = container.terminal;
          if (!terminal) return null;
          
          const trackingUrl = getTerminalTrackingUrl(terminal, container);
          
          return (
            <div className="flex items-center">
              <span className="mr-2">{terminal.terminalName}</span>
              {trackingUrl && (
                <a 
                  href={trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Rail',
        accessor: 'Rail',
        visible: columnVisibility.rail,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value || 'No'}
            row={row}
            column={column}
            onEdit={(rowIndex, columnId, newValue) => {
              handleCellEdit(rowIndex, columnId, newValue);
            }}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Sail',
        accessor: 'Sail',
        visible: columnVisibility.sail,
        Cell: ({ row, value }: any) => (
          <div className="flex flex-col">
            <span>{formatDate(value)}</span>
            {row.original.SailActual && (
              <span className="text-xs text-gray-500">{row.original.SailActual}</span>
            )}
          </div>
        ),
      },
      {
        Header: 'Arrival',
        accessor: 'Arrival',
        visible: columnVisibility.arrival,
        Cell: ({ row, value }: any) => (
          <div className="flex flex-col">
            <span>{formatDate(value)}</span>
            {row.original.ArrivalActual && (
              <span className="text-xs text-gray-500">{row.original.ArrivalActual}</span>
            )}
          </div>
        ),
      },
      {
        Header: 'Available',
        accessor: 'Available',
        visible: columnVisibility.available,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Pickup LFD',
        accessor: 'PickupLFD',
        visible: columnVisibility.pickupLFD,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Return LFD',
        accessor: 'ReturnLFD',
        visible: columnVisibility.returnLFD,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Delivered',
        accessor: 'Delivered',
        visible: columnVisibility.delivered,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Returned',
        accessor: 'Returned',
        visible: columnVisibility.returned,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Last Updated',
        accessor: 'LastUpdated',
        visible: columnVisibility.lastUpdated,
        Cell: ({ row, value }: any) => <span>{formatDate(value)}</span>,
      },
      {
        Header: 'Notes',
        accessor: 'Notes',
        visible: columnVisibility.notes,
        Cell: ({ row, value, column }: any) => (
          <InlineEditCell
            value={value}
            row={row}
            column={column}
            onEdit={handleCellEdit}
            isEditing={editingCell?.rowIndex === row.index && editingCell?.columnId === column.id}
            onStartEdit={() => setEditingCell({ rowIndex: row.index, columnId: column.id })}
          />
        ),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(row.original)}
              className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete([row.original.ContainerID])}
              className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ),
      },
    ];

    return baseColumns.filter((column) => column.visible !== false);
  }, [columnVisibility, containers, editingCell, onEdit, onDelete]);

  // @ts-ignore - react-table has incorrect typings that we need to workaround
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // Rename state to tableState to avoid naming conflicts
    state: tableState,
  } = useTable(
    {
      // @ts-ignore - react-table has incorrect typings
      columns,
      data: displayedContainers,
      initialState: {
        // @ts-ignore - react-table type issues
        selectedRowIds: {},
      },
    },
    useFilters,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          // @ts-ignore - react-table type issues
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // @ts-ignore - react-table type issues
          Cell: ({ row }) => (
            <div>
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Extract selectedRowIds from state
  // @ts-ignore - react-table type issues
  const { selectedRowIds } = tableState;

  // Sync selected rows to context
  useEffect(() => {
    if (!selectedRowIds) return;
    
    const selectedIds = Object.keys(selectedRowIds).map(Number);
    dispatch({ 
      type: 'DESELECT_ALL_CONTAINERS' 
    });
    
    if (selectedIds.length > 0) {
      const selected = displayedContainers.filter(container => {
        // Get the row index from selectedRowIds and check if the current container is at that index
        const rowIndexes = Object.keys(selectedRowIds);
        return rowIndexes.some(index => {
          const rowIndex = Number(index);
          return rowIndex < displayedContainers.length && displayedContainers[rowIndex].ContainerID === container.ContainerID;
        });
      });
      
      selected.forEach(container => {
        dispatch({ 
          type: 'SELECT_CONTAINER', 
          payload: container 
        });
      });
    }
  }, [selectedRowIds, displayedContainers, dispatch]);

  // Sync the scrollable content width
  useEffect(() => {
    const syncScrollWidth = () => {
      if (tableRef.current && topScrollRef.current) {
        const tableWidth = tableRef.current.scrollWidth;
        const scrollContent = topScrollRef.current.querySelector('.scroll-content') as HTMLElement;
        if (scrollContent) {
          scrollContent.style.width = `${tableWidth}px`;
        }
      }
    };

    syncScrollWidth();
    // Sync on resize
    const handleResize = () => syncScrollWidth();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [displayedContainers, columnVisibility]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading containers...</div>;
  }

  if (displayedContainers.length === 0) {
    return <div className="flex justify-center p-8">No containers found.</div>;
  }

  // Sync scroll between top and bottom scrollbars
  const handleTopScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (topScrollRef.current) {
      topScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div>
      {/* Top horizontal scrollbar */}
      <div 
        ref={topScrollRef}
        className="overflow-x-auto overflow-y-hidden h-4 mb-1 border-b border-gray-200"
        onScroll={handleTopScroll}
      >
        <div className="scroll-content h-1">
          {/* Invisible content that matches table width */}
        </div>
      </div>
      
      {/* Main table container */}
      <div 
        ref={tableScrollRef}
        className="overflow-x-auto"
        onScroll={handleTableScroll}
      >
        <table
          {...getTableProps()}
          ref={tableRef}
          className="min-w-full divide-y divide-gray-200 border-collapse"
        >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  // @ts-ignore - react-table type issues
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    {column.render('Header')}
                    {/* @ts-ignore - react-table type issues */}
                    {column.isSorted ? (
                      // @ts-ignore - react-table type issues
                      column.isSortedDesc ? (
                        <ChevronDownIcon className="ml-1 w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="ml-1 w-4 h-4" />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`hover:bg-gray-50 ${
                  // @ts-ignore - react-table type issues
                  row.isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};