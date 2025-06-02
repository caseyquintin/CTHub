import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../types';
import { useAppContext } from '../context/AppContext';
import { ContainerTable } from '../components/ContainerTable';
import { ContainerFormModal } from '../components/ContainerFormModal';
import { BulkEditModal } from '../components/BulkEditModal';
import { CsvImportModal } from '../components/CsvImportModal';
import { ColumnVisibilityModal } from '../components/ColumnVisibilityModal';
import { Pagination } from '../components/Pagination';
import { AdvancedSearchModal, AdvancedFilters } from '../components/AdvancedSearchModal';
import { FilterPresetsModal } from '../components/FilterPresetsModal';
import { applyAdvancedFilters, getDefaultFilters } from '../utils/filterUtils';
import { getContainersAdvanced } from '../api/advancedApi';
import { FunnelIcon, MagnifyingGlassIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import {
  getContainers,
  getContainersByStatus,
  createContainer,
  updateContainer,
  deleteContainer,
  bulkUpdateContainers,
  bulkDeleteContainers,
  bulkCreateContainers,
  getDropdownOptions
} from '../api';

const ContainersPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { containers, loading, selectedContainers, currentView } = state;
  
  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isFilterPresetsOpen, setIsFilterPresetsOpen] = useState(false);
  const [currentContainer, setCurrentContainer] = useState<Container | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(getDefaultFilters());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  
  // Check if we should use backend filtering
  const useBackendFiltering = process.env.REACT_APP_USE_BACKEND_FILTERING === 'true';

  // Load containers and dropdown options on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const options = await getDropdownOptions();
        dispatch({ type: 'SET_DROPDOWN_OPTIONS', payload: options });
        
        await loadContainers();
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  // Load containers based on current view and filtering method
  const loadContainers = async (filters?: AdvancedFilters, page: number = currentPage, statusFilter?: string, customPageSize?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Use the statusFilter parameter if provided, otherwise use currentView from state
      const activeStatus = statusFilter !== undefined ? statusFilter : currentView;
      // Use customPageSize if provided, otherwise use state pageSize
      const activePageSize = customPageSize !== undefined ? customPageSize : pageSize;
      
      if (useBackendFiltering && filters) {
        // Use server-side filtering
        const response = await getContainersAdvanced(filters);
        dispatch({ type: 'SET_CONTAINERS', payload: response.data });
        setTotalCount(response.data.length);
        setTotalPages(1);
      } else {
        // Use paginated API
        if (activeStatus === 'All') {
          const response = await getContainers(page, activePageSize);
          dispatch({ type: 'SET_CONTAINERS', payload: response.data });
          setTotalCount(response.totalCount);
          setTotalPages(response.totalPages);
          setCurrentPage(response.page);
        } else {
          // Check if this is a configured status filter
          const statusFilter = statusFilters.find(f => f.id === activeStatus);
          
          if (statusFilter) {
            if (statusFilter.statuses) {
              // For grouped statuses, we need to fetch all and then paginate client-side
              // First, get all containers matching the grouped statuses
              const allMatchingContainers: Container[] = [];
              
              for (const status of statusFilter.statuses) {
                try {
                  const data = await getContainersByStatus(status);
                  allMatchingContainers.push(...data);
                } catch (error) {
                  console.error(`Error loading containers for status ${status}:`, error);
                }
              }
              
              // Calculate pagination
              const totalItems = allMatchingContainers.length;
              const totalPagesCalc = Math.ceil(totalItems / activePageSize);
              const startIndex = (page - 1) * activePageSize;
              const endIndex = startIndex + activePageSize;
              const paginatedData = allMatchingContainers.slice(startIndex, endIndex);
              
              dispatch({ type: 'SET_CONTAINERS', payload: paginatedData });
              setTotalCount(totalItems);
              setTotalPages(totalPagesCalc);
              setCurrentPage(page);
            } else if (statusFilter.singleStatus) {
              // Single status filtering with proper database status
              const data = await getContainersByStatus(statusFilter.singleStatus);
              
              // Apply client-side pagination for single status
              const totalItems = data.length;
              const totalPagesCalc = Math.ceil(totalItems / activePageSize);
              const startIndex = (page - 1) * activePageSize;
              const endIndex = startIndex + activePageSize;
              const paginatedData = data.slice(startIndex, endIndex);
              
              dispatch({ type: 'SET_CONTAINERS', payload: paginatedData });
              setTotalCount(totalItems);
              setTotalPages(totalPagesCalc);
              setCurrentPage(page);
            }
          } else {
            // Fallback for direct status filtering (shouldn't happen with current setup)
            const data = await getContainersByStatus(activeStatus);
            
            // Apply client-side pagination
            const totalItems = data.length;
            const totalPagesCalc = Math.ceil(totalItems / activePageSize);
            const startIndex = (page - 1) * activePageSize;
            const endIndex = startIndex + activePageSize;
            const paginatedData = data.slice(startIndex, endIndex);
            
            dispatch({ type: 'SET_CONTAINERS', payload: paginatedData });
            setTotalCount(totalItems);
            setTotalPages(totalPagesCalc);
            setCurrentPage(page);
          }
        }
      }
    } catch (error) {
      console.error('Error loading containers:', error);
      toast.error('Failed to load containers');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handle view change
  const handleViewChange = (status: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: status });
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when changing status
    
    // Reload containers with new filter, passing the status explicitly
    loadContainers(undefined, 1, status);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadContainers(undefined, page, filterStatus);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    loadContainers(undefined, 1, filterStatus, newPageSize);
  };

  // Handle container operations
  const handleAddContainer = async (container: Partial<Container>) => {
    try {
      await createContainer(container);
      toast.success('Container added successfully');
      await loadContainers();
    } catch (error) {
      console.error('Error adding container:', error);
      toast.error('Failed to add container');
    }
  };

  const handleEditContainer = async (container: Partial<Container>) => {
    if (!currentContainer) return;
    
    try {
      await updateContainer(currentContainer.ContainerID, container);
      toast.success('Container updated successfully');
      await loadContainers();
      setCurrentContainer(null);
    } catch (error) {
      console.error('Error updating container:', error);
      toast.error('Failed to update container');
    }
  };

  const handleDeleteContainer = async (containerIds: number[]) => {
    if (!window.confirm(`Are you sure you want to delete ${containerIds.length} container(s)?`)) {
      return;
    }
    
    try {
      if (containerIds.length === 1) {
        await deleteContainer(containerIds[0]);
      } else {
        await bulkDeleteContainers(containerIds);
      }
      
      toast.success(`${containerIds.length} container(s) deleted successfully`);
      await loadContainers();
      dispatch({ type: 'DESELECT_ALL_CONTAINERS' });
    } catch (error) {
      console.error('Error deleting container(s):', error);
      toast.error('Failed to delete container(s)');
    }
  };

  const handleBulkEdit = async (updates: Record<string, any>, ids: number[]) => {
    try {
      await bulkUpdateContainers(updates, ids);
      toast.success(`${ids.length} containers updated successfully`);
      await loadContainers();
      dispatch({ type: 'DESELECT_ALL_CONTAINERS' });
    } catch (error) {
      console.error('Error updating containers:', error);
      toast.error('Failed to update containers');
    }
  };

  const handleImportContainers = async (containers: Partial<Container>[]) => {
    try {
      await bulkCreateContainers(containers);
      toast.success(`${containers.length} containers imported successfully`);
      await loadContainers();
    } catch (error) {
      console.error('Error importing containers:', error);
      toast.error('Failed to import containers');
    }
  };

  // Open edit modal with selected container
  const openEditModal = (container: Container) => {
    setCurrentContainer(container);
    setIsEditModalOpen(true);
  };

  // Filter statuses for view selection - grouped for efficient workflow
  const statusFilters: Array<{id: string, label: string, statuses?: string[], singleStatus?: string}> = [
    { id: 'All', label: 'All Containers' },
    { id: 'NOT_SAILED', label: 'Not Sailed', singleStatus: 'NOT SAILED' },
    { id: 'ON_VESSEL', label: 'On Vessel', statuses: ['ON VESSEL', 'XLOADING AT SEA'] },
    { id: 'RAIL', label: 'Rail', statuses: ['XLOADING TO RAIL', 'ON RAIL'] },
    { id: 'AVAILABLE', label: 'Available', singleStatus: 'AVAILABLE' },
    { id: 'NOT_AVAILABLE_HOLDS', label: 'Not Available/Holds', statuses: ['NOT AVAILABLE', 'NA - CUSTOMS', 'NA - LINE HOLD', 'NA - FEES', 'NA - LOCATION'] },
    { id: 'IN_TRANSIT', label: 'In Transit', statuses: ['PU BY VENDOR', 'PU APPT REQ', 'PU APPT SET', 'DEL APPT REQ', 'DEL APPT SET'] },
    { id: 'TRANSLOADING', label: 'Transloading', singleStatus: 'TRANSLOADING' },
    { id: 'DELIVERED', label: 'Delivered', singleStatus: 'DELIVERED' },
    { id: 'RETURNED', label: 'Returned', singleStatus: 'RETURNED' },
  ];

  // Apply filters to containers
  const filteredContainers = React.useMemo(() => {
    let result = containers;

    // Apply simple search term filter
    if (searchTerm) {
      result = result.filter(container => 
        container.ContainerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (container.ProjectNumber && container.ProjectNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (container.PONumber && container.PONumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (container.BOLBookingNumber && container.BOLBookingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply advanced filters if any are set
    const hasAdvancedFilters = 
      advancedFilters.searchTerm ||
      advancedFilters.status.length > 0 ||
      advancedFilters.dateRange.field ||
      advancedFilters.containerSize.length > 0 ||
      advancedFilters.shipline.length > 0 ||
      advancedFilters.portOfEntry.length > 0 ||
      advancedFilters.vendor ||
      advancedFilters.rail;

    if (hasAdvancedFilters) {
      result = applyAdvancedFilters(result, advancedFilters);
    }

    return result;
  }, [containers, searchTerm, advancedFilters]);

  // Handle advanced filter application
  const handleAdvancedFiltersApply = async (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
    // Clear simple search when advanced filters are applied
    if (filters.searchTerm && searchTerm) {
      setSearchTerm('');
    }
    
    // If using backend filtering, reload containers immediately
    if (useBackendFiltering) {
      await loadContainers(filters);
    }
  };

  // Check if advanced filters are active
  const hasActiveAdvancedFilters = 
    advancedFilters.searchTerm ||
    advancedFilters.status.length > 0 ||
    advancedFilters.dateRange.field ||
    advancedFilters.containerSize.length > 0 ||
    advancedFilters.shipline.length > 0 ||
    advancedFilters.portOfEntry.length > 0 ||
    advancedFilters.vendor ||
    advancedFilters.rail;

  // Clear all filters
  const handleClearFilters = async () => {
    setSearchTerm('');
    const defaultFilters = getDefaultFilters();
    setAdvancedFilters(defaultFilters);
    
    // If using backend filtering, reload containers
    if (useBackendFiltering) {
      await loadContainers(defaultFilters);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">Container Tracking</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Container
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Import CSV
          </button>
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Columns
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 lg:pb-0">
            {statusFilters.map((status) => (
              <button
                key={status.id}
                onClick={() => handleViewChange(status.id)}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium ${
                  filterStatus === status.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Search Controls */}
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
            {/* Simple Search Bar */}
            <div className="relative flex-1 lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Advanced Search Button */}
            <button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                hasActiveAdvancedFilters
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              Advanced
              {hasActiveAdvancedFilters && (
                <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                  ON
                </span>
              )}
            </button>

            {/* Filter Presets Button */}
            <button
              onClick={() => setIsFilterPresetsOpen(true)}
              className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <BookmarkIcon className="h-4 w-4" />
              Presets
            </button>
            
            {/* Clear Filters Button */}
            {(searchTerm || hasActiveAdvancedFilters) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Container Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading containers...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Top Pagination */}
          {totalCount > 0 && (
            <div className="px-4 py-3 border-b border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
                selectedCount={selectedContainers.length}
                onBulkEdit={selectedContainers.length > 0 ? () => setIsBulkEditModalOpen(true) : undefined}
                onBulkDelete={selectedContainers.length > 0 ? () => handleDeleteContainer(selectedContainers.map(c => c.ContainerID)) : undefined}
                position="top"
              />
            </div>
          )}
          
          <ContainerTable
            onEdit={openEditModal}
            onDelete={handleDeleteContainer}
            filteredContainers={filteredContainers}
          />
          
          {/* Bottom Pagination */}
          {totalCount > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
                position="bottom"
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ContainerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddContainer}
      />

      <ContainerFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentContainer(null);
        }}
        container={currentContainer || undefined}
        onSubmit={handleEditContainer}
      />

      <BulkEditModal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        onSubmit={handleBulkEdit}
      />

      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportContainers}
      />

      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
      />

      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApply={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
      />

      <FilterPresetsModal
        isOpen={isFilterPresetsOpen}
        onClose={() => setIsFilterPresetsOpen(false)}
        onLoadPreset={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
      />
    </div>
  );
};

export default ContainersPage;