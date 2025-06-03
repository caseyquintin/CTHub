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
  const [filterStatus, setFilterStatus] = useState('Returns'); // Default to Returns Focus tab
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
        
        // Load containers with the default filter
        await loadContainers(undefined, 1, 'Returns');
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, []); // Remove dispatch dependency to prevent infinite loops

  // Load containers based on current view and filtering method
  const loadContainers = async (filters?: AdvancedFilters, page: number = currentPage, statusFilter?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Use the statusFilter parameter if provided, otherwise use currentView from state
      const activeStatus = statusFilter !== undefined ? statusFilter : currentView;
      
      if (useBackendFiltering && filters) {
        // Use server-side filtering
        const response = await getContainersAdvanced(filters);
        dispatch({ type: 'SET_CONTAINERS', payload: response.data });
        setTotalCount(response.data.length);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        // Always use status-based filtering for the new tab structure
        const data = await getContainersByStatus(activeStatus);
        dispatch({ type: 'SET_CONTAINERS', payload: data });
        setTotalCount(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
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
    loadContainers(undefined, page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    loadContainers(undefined, 1);
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

  // Filter statuses for view selection with new structure
  const statusFilters = [
    { id: 'Returns', label: '1️⃣ Returns Focus', description: 'First thing every morning - check for returns' },
    { id: 'Active', label: '2️⃣ Active Management', description: 'What needs coordination today' },
    { id: 'EarlyTransit', label: '3️⃣ Early Transit', description: 'Check for movement updates' },
    { id: 'Imminent', label: '4️⃣ Imminent Arrivals', description: 'Arriving within 2 days' },
    { id: 'AllVessels', label: '5️⃣ All Vessels', description: 'General vessel monitoring' },
    { id: 'Archive', label: '✅ Archive', description: 'Returned containers' },
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

  // Update pagination state when filtered data changes
  useEffect(() => {
    const filteredCount = filteredContainers.length;
    const calculatedTotalPages = Math.ceil(filteredCount / pageSize);
    
    setTotalCount(filteredCount);
    setTotalPages(calculatedTotalPages);
    
    // Reset to first page if current page is out of bounds
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredContainers.length, pageSize, currentPage]);

  // Apply pagination - slice the data for current page
  const paginatedContainers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredContainers.slice(startIndex, endIndex);
  }, [filteredContainers, currentPage, pageSize]);

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
          <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.id}
                onClick={() => handleViewChange(status.id)}
                title={status.description}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status.id
                    ? 'bg-indigo-600 text-white shadow-md'
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
          {/* Top Pagination - Navigation Controls Only */}
          <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              {/* Selection Count with Bulk Actions */}
              <div className="flex items-center gap-4">
              {selectedContainers.length > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedContainers.length} container{selectedContainers.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBulkEditModalOpen(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Bulk Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContainer(selectedContainers.map(c => c.ContainerID))}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete Selected
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Middle spacer to match bottom pagination structure */}
            <div></div>
            
            {/* Navigation Controls */}
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page Numbers */}
                {(() => {
                  const visiblePages = [];
                  const delta = 2;
                  
                  if (totalPages <= 1) {
                    visiblePages.push(1);
                  } else {
                    // Always show first page
                    visiblePages.push(1);
                    
                    // Calculate start and end of middle range
                    const start = Math.max(2, currentPage - delta);
                    const end = Math.min(totalPages - 1, currentPage + delta);
                    
                    if (start > 2) {
                      if (start > 3) {
                        visiblePages.push('...');
                      }
                    }
                    
                    // Add middle range
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        visiblePages.push(i);
                      }
                    }
                    
                    // Add last page
                    if (totalPages > 1) {
                      if (end < totalPages - 1) {
                        if (end < totalPages - 2) {
                          visiblePages.push('...');
                        }
                        visiblePages.push(totalPages);
                      } else {
                        if (!visiblePages.includes(totalPages)) {
                          visiblePages.push(totalPages);
                        }
                      }
                    }
                  }
                  
                  return visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          disabled={loading || (totalPages <= 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed ${
                            currentPage === page
                              ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ));
                })()}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          
          <ContainerTable
            onEdit={openEditModal}
            onDelete={handleDeleteContainer}
            filteredContainers={paginatedContainers}
          />
          
          {/* Bottom Pagination - Always Show */}
          <div className="border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
            />
          </div>
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