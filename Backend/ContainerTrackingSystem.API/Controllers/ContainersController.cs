using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContainersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ContainersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Containers
        [HttpGet]
        public async Task<ActionResult<ContainerFilterResponse<Container>>> GetContainers([FromQuery] ContainerFilterRequest request)
        {
            var query = _unitOfWork.Containers.Query()
                .AsQueryable();

            // Apply filters
            query = ApplyFilters(query, request);

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            query = ApplySorting(query, request.SortBy, request.SortDescending);

            // Apply pagination with projection including navigation properties
            var containers = await query
                .Include(c => c.Shipline)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new Container
                {
                    ContainerID = c.ContainerID,
                    ContainerNumber = c.ContainerNumber,
                    ProjectNumber = c.ProjectNumber,
                    CurrentStatus = c.CurrentStatus,
                    ShiplineID = c.ShiplineID,
                    Shipline = c.Shipline == null ? null : new Shipline
                    {
                        ShiplineID = c.Shipline.ShiplineID,
                        ShiplineName = c.Shipline.ShiplineName,
                        Link = c.Shipline.Link,
                        IsDynamicLink = c.Shipline.IsDynamicLink
                    },
                    ContainerSize = c.ContainerSize,
                    MainSource = c.MainSource,
                    Transload = c.Transload,
                    BOLBookingNumber = c.BOLBookingNumber,
                    VendorIDNumber = c.VendorIDNumber,
                    Vendor = c.Vendor,
                    PONumber = c.PONumber,
                    VesselLineID = c.VesselLineID,
                    VesselID = c.VesselID,
                    Voyage = c.Voyage,
                    PortOfDeparture = c.PortOfDeparture,
                    PortID = c.PortID,
                    PortOfEntry = c.PortOfEntry,
                    TerminalID = c.TerminalID,
                    Rail = c.Rail,
                    RailDestination = c.RailDestination,
                    RailwayLine = c.RailwayLine,
                    RailPickupNumber = c.RailPickupNumber,
                    CarrierID = c.CarrierID,
                    Carrier = c.Carrier,
                    Sail = c.Sail,
                    SailActual = c.SailActual,
                    Berth = c.Berth,
                    BerthActual = c.BerthActual,
                    Arrival = c.Arrival,
                    ArrivalActual = c.ArrivalActual,
                    Offload = c.Offload,
                    OffloadActual = c.OffloadActual,
                    Available = c.Available,
                    PickupLFD = c.PickupLFD,
                    PortRailwayPickup = c.PortRailwayPickup,
                    ReturnLFD = c.ReturnLFD,
                    LoadToRail = c.LoadToRail,
                    RailDeparture = c.RailDeparture,
                    RailETA = c.RailETA,
                    Delivered = c.Delivered,
                    Returned = c.Returned,
                    LastUpdated = c.LastUpdated,
                    Notes = c.Notes
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            var response = new ContainerFilterResponse<Container>
            {
                Data = containers,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };

            return Ok(response);
        }

        // GET: api/Containers/simple (backwards compatibility)
        [HttpGet("simple")]
        public async Task<ActionResult<IEnumerable<Container>>> GetContainersSimple()
        {
            var containers = await _unitOfWork.Containers.Query()
                .Include(c => c.Shipline)
                .Include(c => c.VesselLine)
                .Include(c => c.Vessel)
                .Include(c => c.Port)
                .Include(c => c.Terminal)
                .ToListAsync();
                
            return Ok(containers);
        }

        // GET: api/Containers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Container>> GetContainer(int id)
        {
            var container = await _unitOfWork.Containers.Query()
                .Include(c => c.Shipline)
                .Include(c => c.VesselLine)
                .Include(c => c.Vessel)
                .Include(c => c.Port)
                .Include(c => c.Terminal)
                .FirstOrDefaultAsync(c => c.ContainerID == id);

            if (container == null)
            {
                return NotFound();
            }

            return container;
        }

        // GET: api/Containers/status/NotSailed
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Container>>> GetContainersByStatus(string status)
        {
            try
            {
                Console.WriteLine($"GetContainersByStatus called with raw status: '{status}'");
                
                // URL decode the status parameter to handle spaces and special characters
                var decodedStatus = System.Net.WebUtility.UrlDecode(status);
                Console.WriteLine($"Decoded status: '{decodedStatus}'");
                
                var containers = await _unitOfWork.Containers.Query()
                    .Where(c => c.CurrentStatus == decodedStatus)
                    .Select(c => new Container
                    {
                        ContainerID = c.ContainerID,
                        ContainerNumber = c.ContainerNumber,
                        ProjectNumber = c.ProjectNumber,
                        CurrentStatus = c.CurrentStatus,
                        ShiplineID = c.ShiplineID,
                        Shipline = c.Shipline != null ? new Shipline
                        {
                            ShiplineID = c.Shipline.ShiplineID,
                            ShiplineName = c.Shipline.ShiplineName,
                            Link = c.Shipline.Link,
                            IsDynamicLink = c.Shipline.IsDynamicLink
                        } : null,
                        ContainerSize = c.ContainerSize,
                        MainSource = c.MainSource,
                        Transload = c.Transload,
                        BOLBookingNumber = c.BOLBookingNumber,
                        VendorIDNumber = c.VendorIDNumber,
                        Vendor = c.Vendor,
                        PONumber = c.PONumber,
                        VesselLineID = c.VesselLineID,
                        VesselLine = c.VesselLine != null ? new VesselLine
                        {
                            VesselLineID = c.VesselLine.VesselLineID,
                            VesselLineName = c.VesselLine.VesselLineName,
                            Link = c.VesselLine.Link,
                            IsDynamicLink = c.VesselLine.IsDynamicLink
                        } : null,
                        VesselID = c.VesselID,
                        Vessel = c.Vessel != null ? new Vessel
                        {
                            VesselID = c.Vessel.VesselID,
                            VesselName = c.Vessel.VesselName,
                            VesselLineID = c.Vessel.VesselLineID,
                            IMO = c.Vessel.IMO,
                            MMSI = c.Vessel.MMSI
                        } : null,
                        Voyage = c.Voyage,
                        PortOfDeparture = c.PortOfDeparture,
                        PortID = c.PortID,
                        Port = c.Port != null ? new Port
                        {
                            PortID = c.Port.PortID,
                            PortOfEntry = c.Port.PortOfEntry
                        } : null,
                        PortOfEntry = c.PortOfEntry,
                        TerminalID = c.TerminalID,
                        Terminal = c.Terminal != null ? new Terminal
                        {
                            TerminalID = c.Terminal.TerminalID,
                            TerminalName = c.Terminal.TerminalName,
                            PortID = c.Terminal.PortID,
                            Link = c.Terminal.Link
                        } : null,
                        Rail = c.Rail,
                        RailDestination = c.RailDestination,
                        RailwayLine = c.RailwayLine,
                        RailPickupNumber = c.RailPickupNumber,
                        CarrierID = c.CarrierID,
                        Carrier = c.Carrier,
                        Sail = c.Sail,
                        SailActual = c.SailActual,
                        Berth = c.Berth,
                        BerthActual = c.BerthActual,
                        Arrival = c.Arrival,
                        ArrivalActual = c.ArrivalActual,
                        Offload = c.Offload,
                        OffloadActual = c.OffloadActual,
                        Available = c.Available,
                        PickupLFD = c.PickupLFD,
                        PortRailwayPickup = c.PortRailwayPickup,
                        ReturnLFD = c.ReturnLFD,
                        LoadToRail = c.LoadToRail,
                        RailDeparture = c.RailDeparture,
                        RailETA = c.RailETA,
                        Delivered = c.Delivered,
                        Returned = c.Returned,
                        LastUpdated = c.LastUpdated,
                        Notes = c.Notes
                    })
                    .ToListAsync();

                Console.WriteLine($"Found {containers.Count} containers with status '{decodedStatus}'");
                
                return Ok(containers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetContainersByStatus: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner stack trace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { 
                    error = ex.Message,
                    innerError = ex.InnerException?.Message,
                    status = status,
                    type = ex.GetType().Name
                });
            }
        }

        // PUT: api/Containers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContainer(int id, Container container)
        {
            if (id != container.ContainerID)
            {
                return BadRequest();
            }

            container.LastUpdated = DateTime.Now;
            _unitOfWork.Containers.Update(container);

            try
            {
                await _unitOfWork.CompleteAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ContainerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PATCH: api/Containers/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchContainer(int id, [FromBody] Dictionary<string, object> updates)
        {
            var container = await _unitOfWork.Containers.GetByIdAsync(id);

            if (container == null)
            {
                return NotFound();
            }

            // Apply the updates
            foreach (var update in updates)
            {
                var propertyInfo = typeof(Container).GetProperty(update.Key);
                if (propertyInfo != null)
                {
                    try
                    {
                        object? value = null;
                        var targetType = propertyInfo.PropertyType;
                        var underlyingType = Nullable.GetUnderlyingType(targetType);

                        if (update.Value == null)
                        {
                            value = null;
                        }
                        else
                        {
                            // Handle JsonElement values from System.Text.Json
                            var rawValue = update.Value;
                            if (rawValue is System.Text.Json.JsonElement jsonElement)
                            {
                                rawValue = jsonElement.ValueKind switch
                                {
                                    System.Text.Json.JsonValueKind.String => jsonElement.GetString(),
                                    System.Text.Json.JsonValueKind.Number => jsonElement.GetDecimal(),
                                    System.Text.Json.JsonValueKind.True => true,
                                    System.Text.Json.JsonValueKind.False => false,
                                    System.Text.Json.JsonValueKind.Null => null,
                                    _ => jsonElement.ToString()
                                };
                            }

                            if (rawValue == null)
                            {
                                value = null;
                            }
                            else if (underlyingType != null)
                            {
                                // Handle nullable types (DateTime?, int?, etc.)
                                value = Convert.ChangeType(rawValue, underlyingType);
                            }
                            else
                            {
                                // Handle non-nullable types
                                value = Convert.ChangeType(rawValue, targetType);
                            }
                        }

                        propertyInfo.SetValue(container, value);
                    }
                    catch (Exception ex)
                    {
                        // Log the conversion error but continue with other updates
                        Console.WriteLine($"Error converting property {update.Key}: {ex.Message}");
                    }
                }
            }

            container.LastUpdated = DateTime.Now;
            _unitOfWork.Containers.Update(container);
            
            try
            {
                var result = await _unitOfWork.CompleteAsync();
                Console.WriteLine($"SaveChanges returned: {result} affected rows");
                
                if (result == 0)
                {
                    Console.WriteLine("WARNING: No rows were affected by the update");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during SaveChanges: {ex.Message}");
                return BadRequest($"Failed to save changes: {ex.Message}");
            }

            return NoContent();
        }

        // POST: api/Containers
        [HttpPost]
        public async Task<ActionResult<Container>> PostContainer(Container container)
        {
            container.LastUpdated = DateTime.Now;
            await _unitOfWork.Containers.AddAsync(container);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction("GetContainer", new { id = container.ContainerID }, container);
        }

        // POST: api/Containers/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<IEnumerable<Container>>> PostBulkContainers(IEnumerable<Container> containers)
        {
            foreach (var container in containers)
            {
                container.LastUpdated = DateTime.Now;
            }
            
            await _unitOfWork.Containers.AddRangeAsync(containers);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction("GetContainers", null, containers);
        }

        // PUT: api/Containers/bulk
        [HttpPut("bulk")]
        public async Task<IActionResult> PutBulkContainers([FromBody] Dictionary<string, object> updates, [FromQuery] List<int> ids)
        {
            var containers = await _unitOfWork.Containers.Query()
                .Where(c => ids.Contains(c.ContainerID))
                .ToListAsync();

            if (containers == null || !containers.Any())
            {
                return NotFound();
            }

            foreach (var container in containers)
            {
                // Apply the updates
                foreach (var update in updates)
                {
                    var propertyInfo = typeof(Container).GetProperty(update.Key);
                    if (propertyInfo != null)
                    {
                        try
                        {
                            object? value = null;
                            var targetType = propertyInfo.PropertyType;
                            var underlyingType = Nullable.GetUnderlyingType(targetType);

                            if (update.Value == null)
                            {
                                value = null;
                            }
                            else
                            {
                                // Handle JsonElement values from System.Text.Json
                                var rawValue = update.Value;
                                if (rawValue is System.Text.Json.JsonElement jsonElement)
                                {
                                    rawValue = jsonElement.ValueKind switch
                                    {
                                        System.Text.Json.JsonValueKind.String => jsonElement.GetString(),
                                        System.Text.Json.JsonValueKind.Number => jsonElement.GetDecimal(),
                                        System.Text.Json.JsonValueKind.True => true,
                                        System.Text.Json.JsonValueKind.False => false,
                                        System.Text.Json.JsonValueKind.Null => null,
                                        _ => jsonElement.ToString()
                                    };
                                }

                                if (rawValue == null)
                                {
                                    value = null;
                                }
                                else if (underlyingType != null)
                                {
                                    // Handle nullable types (DateTime?, int?, etc.)
                                    value = Convert.ChangeType(rawValue, underlyingType);
                                }
                                else
                                {
                                    // Handle non-nullable types
                                    value = Convert.ChangeType(rawValue, targetType);
                                }
                            }

                            propertyInfo.SetValue(container, value);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error converting property {update.Key}: {ex.Message}");
                        }
                    }
                }

                container.LastUpdated = DateTime.Now;
            }

            _unitOfWork.Containers.UpdateRange(containers);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/Containers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContainer(int id)
        {
            var container = await _unitOfWork.Containers.GetByIdAsync(id);
            if (container == null)
            {
                return NotFound();
            }

            _unitOfWork.Containers.Remove(container);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/Containers/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> DeleteBulkContainers([FromQuery] List<int> ids)
        {
            var containers = await _unitOfWork.Containers.Query()
                .Where(c => ids.Contains(c.ContainerID))
                .ToListAsync();

            if (containers == null || !containers.Any())
            {
                return NotFound();
            }

            _unitOfWork.Containers.RemoveRange(containers);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        private async Task<bool> ContainerExists(int id)
        {
            return await _unitOfWork.Containers.AnyAsync(e => e.ContainerID == id);
        }

        private IQueryable<Container> ApplyFilters(IQueryable<Container> query, ContainerFilterRequest request)
        {
            // Text search filter
            if (!string.IsNullOrEmpty(request.SearchTerm) && request.SearchFields.Any())
            {
                var searchTerm = request.SearchTerm.ToLower();
                var searchPredicate = PredicateBuilder.False<Container>();

                foreach (var field in request.SearchFields)
                {
                    switch (field.ToLower())
                    {
                        case "containernumber":
                            searchPredicate = searchPredicate.Or(c => c.ContainerNumber.ToLower().Contains(searchTerm));
                            break;
                        case "projectnumber":
                            searchPredicate = searchPredicate.Or(c => c.ProjectNumber != null && c.ProjectNumber.ToLower().Contains(searchTerm));
                            break;
                        case "ponumber":
                            searchPredicate = searchPredicate.Or(c => c.PONumber != null && c.PONumber.ToLower().Contains(searchTerm));
                            break;
                        case "bolbookingnumber":
                            searchPredicate = searchPredicate.Or(c => c.BOLBookingNumber != null && c.BOLBookingNumber.ToLower().Contains(searchTerm));
                            break;
                        case "vendor":
                            searchPredicate = searchPredicate.Or(c => c.Vendor != null && c.Vendor.ToLower().Contains(searchTerm));
                            break;
                        case "voyage":
                            searchPredicate = searchPredicate.Or(c => c.Voyage != null && c.Voyage.ToLower().Contains(searchTerm));
                            break;
                        case "notes":
                            searchPredicate = searchPredicate.Or(c => c.Notes != null && c.Notes.ToLower().Contains(searchTerm));
                            break;
                    }
                }

                query = query.Where(searchPredicate);
            }

            // Status filter
            if (request.Status.Any())
            {
                query = query.Where(c => request.Status.Contains(c.CurrentStatus));
            }

            // Date range filter
            if (!string.IsNullOrEmpty(request.DateField) && request.StartDate.HasValue && request.EndDate.HasValue)
            {
                var startDate = request.StartDate.Value.Date;
                var endDate = request.EndDate.Value.Date.AddDays(1); // Include end date

                switch (request.DateField.ToLower())
                {
                    case "sail":
                        query = query.Where(c => c.Sail >= startDate && c.Sail < endDate);
                        break;
                    case "arrival":
                        query = query.Where(c => c.Arrival >= startDate && c.Arrival < endDate);
                        break;
                    case "available":
                        query = query.Where(c => c.Available >= startDate && c.Available < endDate);
                        break;
                    case "pickuplfd":
                        query = query.Where(c => c.PickupLFD >= startDate && c.PickupLFD < endDate);
                        break;
                    case "returnlfd":
                        query = query.Where(c => c.ReturnLFD >= startDate && c.ReturnLFD < endDate);
                        break;
                    case "delivered":
                        query = query.Where(c => c.Delivered >= startDate && c.Delivered < endDate);
                        break;
                    case "returned":
                        query = query.Where(c => c.Returned >= startDate && c.Returned < endDate);
                        break;
                    case "lastupdated":
                        query = query.Where(c => c.LastUpdated >= startDate && c.LastUpdated < endDate);
                        break;
                }
            }

            // Container size filter
            if (request.ContainerSize.Any())
            {
                query = query.Where(c => request.ContainerSize.Contains(c.ContainerSize));
            }

            // Shipline filter
            if (request.Shipline.Any())
            {
                query = query.Where(c => c.Shipline != null && request.Shipline.Contains(c.Shipline.ShiplineName));
            }

            // Port of entry filter
            if (request.PortOfEntry.Any())
            {
                query = query.Where(c => request.PortOfEntry.Contains(c.PortOfEntry));
            }

            // Vendor filter
            if (!string.IsNullOrEmpty(request.Vendor))
            {
                var vendorTerm = request.Vendor.ToLower();
                query = query.Where(c => c.Vendor != null && c.Vendor.ToLower().Contains(vendorTerm));
            }

            // Rail filter
            if (request.Rail.HasValue)
            {
                var railValue = request.Rail.Value ? "Yes" : "No";
                query = query.Where(c => c.Rail == railValue);
            }

            return query;
        }

        private IQueryable<Container> ApplySorting(IQueryable<Container> query, string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy))
            {
                return query.OrderBy(c => c.ContainerID);
            }

            switch (sortBy.ToLower())
            {
                case "containernumber":
                    return sortDescending ? query.OrderByDescending(c => c.ContainerNumber) : query.OrderBy(c => c.ContainerNumber);
                case "projectnumber":
                    return sortDescending ? query.OrderByDescending(c => c.ProjectNumber) : query.OrderBy(c => c.ProjectNumber);
                case "currentstatus":
                    return sortDescending ? query.OrderByDescending(c => c.CurrentStatus) : query.OrderBy(c => c.CurrentStatus);
                case "sail":
                    return sortDescending ? query.OrderByDescending(c => c.Sail) : query.OrderBy(c => c.Sail);
                case "arrival":
                    return sortDescending ? query.OrderByDescending(c => c.Arrival) : query.OrderBy(c => c.Arrival);
                case "lastupdated":
                    return sortDescending ? query.OrderByDescending(c => c.LastUpdated) : query.OrderBy(c => c.LastUpdated);
                default:
                    return query.OrderBy(c => c.ContainerID);
            }
        }
    }

    // Helper class for dynamic predicate building
    public static class PredicateBuilder
    {
        public static Expression<Func<T, bool>> True<T>() { return f => true; }
        public static Expression<Func<T, bool>> False<T>() { return f => false; }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1,
                                                      Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
            return Expression.Lambda<Func<T, bool>>
                  (Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1,
                                                       Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
            return Expression.Lambda<Func<T, bool>>
                  (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
        }
    }
}
