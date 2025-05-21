# Container Tracking System - Manual Testing Checklist

## Prerequisites
- [ ] Backend API running at http://localhost:5062
- [ ] Frontend running at http://localhost:3000  
- [ ] CTHUB database accessible
- [ ] Browser DevTools open (F12)

## Core Functionality Tests

### Database Connection
- [ ] Page loads without errors
- [ ] 100 containers display in table
- [ ] Pagination shows "1442 total containers"
- [ ] Console shows no API errors
- [ ] Data loads in under 5 seconds

### Container Display
- [ ] Container numbers show correctly (CAAU5462320, etc.)
- [ ] Status values display (At Port, On Vessel, etc.)
- [ ] Rail field shows "Yes"/"No" (not true/false)
- [ ] Dates display in MM/dd/yyyy format
- [ ] All columns render properly

### Navigation & Filtering
- [ ] Status tabs work (All, Not Sailed, On Vessel, etc.)
- [ ] Quick search finds containers by number
- [ ] Advanced search modal opens
- [ ] Clear filters button works
- [ ] Filtering updates table correctly

### CRUD Operations
#### Create Container
- [ ] "Add Container" button opens modal
- [ ] Form validation works (required fields)
- [ ] Container number validation (min 4 chars)
- [ ] Dropdown options populate
- [ ] Submit creates new container
- [ ] Table refreshes after creation
- [ ] Success toast appears

#### Edit Container  
- [ ] "Edit" button opens modal with data
- [ ] Form pre-populated with existing values
- [ ] Dependent dropdowns work (Port → Terminal)
- [ ] Rail field enables/disables related fields
- [ ] Save updates container
- [ ] Table refreshes after edit

#### Delete Container
- [ ] "Delete" button shows confirmation
- [ ] Single delete works
- [ ] Bulk delete works (select multiple)
- [ ] Table refreshes after deletion
- [ ] Success toast appears

### Form Behavior
- [ ] Rail "Yes" enables rail-related fields
- [ ] Rail "No" disables rail-related fields
- [ ] Port selection loads terminals
- [ ] Vessel Line selection loads vessels
- [ ] Date pickers work correctly
- [ ] Form validation prevents submission of invalid data

### Error Handling
- [ ] Invalid API responses handled gracefully
- [ ] Network errors show appropriate messages
- [ ] Form errors display clearly
- [ ] Loading states show during API calls

### Performance
- [ ] Initial page load < 5 seconds
- [ ] Table operations < 2 seconds
- [ ] Search/filtering < 1 second
- [ ] Modal open/close < 500ms
- [ ] No memory leaks (DevTools → Memory)

### Browser Compatibility
- [ ] Chrome works
- [ ] Firefox works  
- [ ] Edge works
- [ ] No console errors in any browser

### Data Validation
#### Sample Container Check
- Container ID: 24615
- Container Number: CAAU5462320
- [ ] Loads correctly
- [ ] Can be edited
- [ ] Shows proper status
- [ ] Rail field works

#### API Response Format Check
- [ ] Response has `Data` array property
- [ ] Response has `TotalCount` property
- [ ] Response has pagination properties
- [ ] Container objects have PascalCase properties

## Test Scenarios

### Scenario 1: New User Workflow
1. Load application
2. Browse all containers
3. Filter by "At Port" status  
4. Search for specific container
5. View container details
6. Edit a container
7. Add new container

### Scenario 2: Bulk Operations
1. Select multiple containers
2. Perform bulk edit
3. Verify changes applied
4. Select different containers  
5. Perform bulk delete
6. Confirm deletion

### Scenario 3: Advanced Search
1. Open advanced search
2. Set multiple filter criteria
3. Apply filters
4. Verify filtered results
5. Clear filters
6. Verify all data returns

## Common Issues to Check

### Known Working Features ✅
- CTHUB database connection
- Container data loading (100 items)
- PascalCase property mapping
- API response format `{Data: [...], TotalCount: 1442}`
- Status filtering
- Basic table rendering

### Areas Requiring Attention ⚠️
- Complex React Table interactions
- Form validation edge cases  
- Error message handling
- Loading state transitions
- Browser performance with large datasets

## Sign-off

**Tester:** ________________  
**Date:** ________________  
**Environment:** ________________  
**Database:** CTHUB @ LT-QUINTIN2  
**API Version:** ________________  

**Overall Status:** [ ] PASS [ ] FAIL  
**Ready for Production:** [ ] YES [ ] NO  

**Notes:**
_________________________________
_________________________________
_________________________________