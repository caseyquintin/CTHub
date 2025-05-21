# Script to copy model files to the appropriate project locations

# Change to the root directory
cd "$PSScriptRoot"

# Define source and destination directories
$sourceDir = "$PSScriptRoot\CTS"
$destCoreDir = "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.Core"
$destDataDir = "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.Data"
$destApiDir = "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.API"

# Create necessary directories
mkdir -Force "$destCoreDir\Models"
mkdir -Force "$destCoreDir\Interfaces"
mkdir -Force "$destDataDir\Repositories"
mkdir -Force "$destApiDir\Controllers"

Write-Host "Copying Core model files..."

# Copy Core model files
@"
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class Container
    {
        [Key]
        public int ContainerID { get; set; }
        
        [Required]
        [StringLength(20)]
        public string ContainerNumber { get; set; }
        
        [StringLength(50)]
        public string ProjectNumber { get; set; }
        
        [StringLength(50)]
        public string CurrentStatus { get; set; }
        
        public int? ShiplineID { get; set; }
        [ForeignKey("ShiplineID")]
        public virtual Shipline Shipline { get; set; }
        
        [StringLength(50)]
        public string ContainerSize { get; set; }
        
        [StringLength(100)]
        public string MainSource { get; set; }
        
        public bool Transload { get; set; }
        
        [StringLength(100)]
        public string BOLBookingNumber { get; set; }
        
        [StringLength(100)]
        public string VendorIDNumber { get; set; }
        
        [StringLength(100)]
        public string Vendor { get; set; }
        
        [StringLength(100)]
        public string PONumber { get; set; }
        
        // Vessel info
        public int? VesselLineID { get; set; }
        [ForeignKey("VesselLineID")]
        public virtual VesselLine VesselLine { get; set; }
        
        public int? VesselID { get; set; }
        [ForeignKey("VesselID")]
        public virtual Vessel Vessel { get; set; }
        
        [StringLength(50)]
        public string Voyage { get; set; }
        
        // Port info
        [StringLength(100)]
        public string PortOfDeparture { get; set; }
        
        public int? PortID { get; set; }
        [ForeignKey("PortID")]
        public virtual Port Port { get; set; }
        
        [StringLength(100)]
        public string PortOfEntry { get; set; }
        
        public int? TerminalID { get; set; }
        [ForeignKey("TerminalID")]
        public virtual Terminal Terminal { get; set; }
        
        // Rail info
        public bool Rail { get; set; }
        
        [StringLength(100)]
        public string RailDestination { get; set; }
        
        [StringLength(100)]
        public string RailwayLine { get; set; }
        
        [StringLength(100)]
        public string RailPickupNumber { get; set; }
        
        // Carrier info
        public int? CarrierID { get; set; }
        [StringLength(100)]
        public string Carrier { get; set; }
        
        // Date tracking
        public DateTime? Sail { get; set; }
        
        [StringLength(20)]
        public string SailActual { get; set; }
        
        public DateTime? Berth { get; set; }
        
        [StringLength(20)]
        public string BerthActual { get; set; }
        
        public DateTime? Arrival { get; set; }
        
        [StringLength(20)]
        public string ArrivalActual { get; set; }
        
        public DateTime? Offload { get; set; }
        
        [StringLength(20)]
        public string OffloadActual { get; set; }
        
        public DateTime? Available { get; set; }
        
        public DateTime? PickupLFD { get; set; }
        
        public DateTime? PortRailwayPickup { get; set; }
        
        public DateTime? ReturnLFD { get; set; }
        
        public DateTime? LoadToRail { get; set; }
        
        public DateTime? RailDeparture { get; set; }
        
        public DateTime? RailETA { get; set; }
        
        public DateTime? Delivered { get; set; }
        
        public DateTime? Returned { get; set; }
        
        public DateTime LastUpdated { get; set; }
        
        // Notes
        public string Notes { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Container.cs"

@"
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class Port
    {
        [Key]
        public int PortID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string PortOfEntry { get; set; }
        
        public virtual ICollection<Terminal> Terminals { get; set; }
        public virtual ICollection<Container> Containers { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Port.cs"

@"
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class Terminal
    {
        [Key]
        public int TerminalID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string TerminalName { get; set; }
        
        public int PortID { get; set; }
        [ForeignKey("PortID")]
        public virtual Port Port { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public virtual ICollection<Container> Containers { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Terminal.cs"

@"
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class Shipline
    {
        [Key]
        public int ShiplineID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ShiplineName { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public bool IsDynamicLink { get; set; }
        
        public virtual ICollection<Container> Containers { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Shipline.cs"

@"
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class VesselLine
    {
        [Key]
        public int VesselLineID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string VesselLineName { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public bool IsDynamicLink { get; set; }
        
        public virtual ICollection<Vessel> Vessels { get; set; }
        public virtual ICollection<Container> Containers { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\VesselLine.cs"

@"
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class Vessel
    {
        [Key]
        public int VesselID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string VesselName { get; set; }
        
        public int VesselLineID { get; set; }
        [ForeignKey("VesselLineID")]
        public virtual VesselLine VesselLine { get; set; }
        
        [StringLength(50)]
        public string IMO { get; set; }
        
        [StringLength(50)]
        public string MMSI { get; set; }
        
        public virtual ICollection<Container> Containers { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Vessel.cs"

@"
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class Fpm
    {
        [Key]
        public int FpmID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FpmName { get; set; }
        
        public bool Active { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\Fpm.cs"

@"
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class DropdownOption
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Value { get; set; }
        
        public bool IsActive { get; set; }
        
        public int SortOrder { get; set; }
    }
}
"@ | Set-Content "$destCoreDir\Models\DropdownOption.cs"

Write-Host "Copying Core interface files..."

# Copy Interface files
@"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Core.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Update(T entity);
        void UpdateRange(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        Task<int> CountAsync();
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        IQueryable<T> Query();
    }
}
"@ | Set-Content "$destCoreDir\Interfaces\IRepository.cs"

@"
using ContainerTrackingSystem.Core.Models;
using System;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Container> Containers { get; }
        IRepository<Port> Ports { get; }
        IRepository<Terminal> Terminals { get; }
        IRepository<Shipline> Shiplines { get; }
        IRepository<VesselLine> VesselLines { get; }
        IRepository<Vessel> Vessels { get; }
        IRepository<Fpm> Fpms { get; }
        IRepository<DropdownOption> DropdownOptions { get; }

        Task<int> CompleteAsync();
    }
}
"@ | Set-Content "$destCoreDir\Interfaces\IUnitOfWork.cs"

Write-Host "Copying Data files..."

# Copy Data files
@"
using ContainerTrackingSystem.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ContainerTrackingSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Container> Containers { get; set; }
        public DbSet<Port> Ports { get; set; }
        public DbSet<Terminal> Terminals { get; set; }
        public DbSet<Shipline> Shiplines { get; set; }
        public DbSet<VesselLine> VesselLines { get; set; }
        public DbSet<Vessel> Vessels { get; set; }
        public DbSet<Fpm> Fpms { get; set; }
        public DbSet<DropdownOption> DropdownOptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Container entity
            modelBuilder.Entity<Container>()
                .Property(c => c.LastUpdated)
                .HasDefaultValueSql("GETDATE()");
                
            // Seed dropdown options
            modelBuilder.Entity<DropdownOption>().HasData(
                // Container Status options
                new DropdownOption { Id = 1, Category = "ContainerStatus", Value = "Not Sailed", IsActive = true, SortOrder = 1 },
                new DropdownOption { Id = 2, Category = "ContainerStatus", Value = "On Vessel", IsActive = true, SortOrder = 2 },
                new DropdownOption { Id = 3, Category = "ContainerStatus", Value = "At Port", IsActive = true, SortOrder = 3 },
                new DropdownOption { Id = 4, Category = "ContainerStatus", Value = "On Rail", IsActive = true, SortOrder = 4 },
                new DropdownOption { Id = 5, Category = "ContainerStatus", Value = "Delivered", IsActive = true, SortOrder = 5 },
                new DropdownOption { Id = 6, Category = "ContainerStatus", Value = "Returned", IsActive = true, SortOrder = 6 },
                
                // Container Size options
                new DropdownOption { Id = 7, Category = "ContainerSize", Value = "20'", IsActive = true, SortOrder = 1 },
                new DropdownOption { Id = 8, Category = "ContainerSize", Value = "40'", IsActive = true, SortOrder = 2 },
                new DropdownOption { Id = 9, Category = "ContainerSize", Value = "40' HC", IsActive = true, SortOrder = 3 },
                new DropdownOption { Id = 10, Category = "ContainerSize", Value = "45'", IsActive = true, SortOrder = 4 },
                
                // Actual/Estimate options
                new DropdownOption { Id = 11, Category = "ActualEstimate", Value = "Actual", IsActive = true, SortOrder = 1 },
                new DropdownOption { Id = 12, Category = "ActualEstimate", Value = "Estimate", IsActive = true, SortOrder = 2 }
            );
        }
    }
}
"@ | Set-Content "$destDataDir\ApplicationDbContext.cs"

@"
using ContainerTrackingSystem.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Update(T entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                Update(entity);
            }
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public async Task<int> CountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public IQueryable<T> Query()
        {
            return _dbSet.AsQueryable();
        }
    }
}
"@ | Set-Content "$destDataDir\Repositories\Repository.cs"

@"
using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using ContainerTrackingSystem.Data.Repositories;
using System;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private Repository<Container> _containers;
        private Repository<Port> _ports;
        private Repository<Terminal> _terminals;
        private Repository<Shipline> _shiplines;
        private Repository<VesselLine> _vesselLines;
        private Repository<Vessel> _vessels;
        private Repository<Fpm> _fpms;
        private Repository<DropdownOption> _dropdownOptions;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IRepository<Container> Containers => _containers ??= new Repository<Container>(_context);
        public IRepository<Port> Ports => _ports ??= new Repository<Port>(_context);
        public IRepository<Terminal> Terminals => _terminals ??= new Repository<Terminal>(_context);
        public IRepository<Shipline> Shiplines => _shiplines ??= new Repository<Shipline>(_context);
        public IRepository<VesselLine> VesselLines => _vesselLines ??= new Repository<VesselLine>(_context);
        public IRepository<Vessel> Vessels => _vessels ??= new Repository<Vessel>(_context);
        public IRepository<Fpm> Fpms => _fpms ??= new Repository<Fpm>(_context);
        public IRepository<DropdownOption> DropdownOptions => _dropdownOptions ??= new Repository<DropdownOption>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
"@ | Set-Content "$destDataDir\UnitOfWork.cs"

Write-Host "Copying API controller files..."

# Copy Controllers
@"
using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<ActionResult<IEnumerable<Container>>> GetContainers()
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
            var containers = await _unitOfWork.Containers.Query()
                .Where(c => c.CurrentStatus == status)
                .Include(c => c.Shipline)
                .Include(c => c.VesselLine)
                .Include(c => c.Vessel)
                .Include(c => c.Port)
                .Include(c => c.Terminal)
                .ToListAsync();

            return Ok(containers);
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
                if (propertyInfo != null && update.Value != null)
                {
                    var value = Convert.ChangeType(update.Value, propertyInfo.PropertyType);
                    propertyInfo.SetValue(container, value);
                }
            }

            container.LastUpdated = DateTime.Now;
            _unitOfWork.Containers.Update(container);
            await _unitOfWork.CompleteAsync();

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
                    if (propertyInfo != null && update.Value != null)
                    {
                        var value = Convert.ChangeType(update.Value, propertyInfo.PropertyType);
                        propertyInfo.SetValue(container, value);
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
    }
}
"@ | Set-Content "$destApiDir\Controllers\ContainersController.cs"

@"
using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropdownOptionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DropdownOptionsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/DropdownOptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DropdownOption>>> GetDropdownOptions()
        {
            var options = await _unitOfWork.DropdownOptions.Query()
                .OrderBy(o => o.Category)
                .ThenBy(o => o.SortOrder)
                .ToListAsync();
                
            return Ok(options);
        }

        // GET: api/DropdownOptions/category/ContainerStatus
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<DropdownOption>>> GetDropdownOptionsByCategory(string category)
        {
            var options = await _unitOfWork.DropdownOptions.Query()
                .Where(o => o.Category == category && o.IsActive)
                .OrderBy(o => o.SortOrder)
                .ToListAsync();

            return Ok(options);
        }

        // GET: api/DropdownOptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DropdownOption>> GetDropdownOption(int id)
        {
            var option = await _unitOfWork.DropdownOptions.GetByIdAsync(id);

            if (option == null)
            {
                return NotFound();
            }

            return option;
        }

        // PUT: api/DropdownOptions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDropdownOption(int id, DropdownOption option)
        {
            if (id != option.Id)
            {
                return BadRequest();
            }

            _unitOfWork.DropdownOptions.Update(option);

            try
            {
                await _unitOfWork.CompleteAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await DropdownOptionExists(id))
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

        // POST: api/DropdownOptions
        [HttpPost]
        public async Task<ActionResult<DropdownOption>> PostDropdownOption(DropdownOption option)
        {
            await _unitOfWork.DropdownOptions.AddAsync(option);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction("GetDropdownOption", new { id = option.Id }, option);
        }

        // DELETE: api/DropdownOptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDropdownOption(int id)
        {
            var option = await _unitOfWork.DropdownOptions.GetByIdAsync(id);
            if (option == null)
            {
                return NotFound();
            }

            _unitOfWork.DropdownOptions.Remove(option);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        private async Task<bool> DropdownOptionExists(int id)
        {
            return await _unitOfWork.DropdownOptions.AnyAsync(e => e.Id == id);
        }
    }
}
"@ | Set-Content "$destApiDir\Controllers\DropdownOptionsController.cs"

# Copy Program.cs
@"
using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.ReferenceHandler = 
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Add dependency injection
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Container Tracking System API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Container Tracking System API v1"));
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
"@ | Set-Content "$destApiDir\Program.cs"

# Copy appsettings.json
@"
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ContainerTrackingSystem;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
"@ | Set-Content "$destApiDir\appsettings.json"

Write-Host "All model files have been copied to the appropriate locations."
Write-Host "You can now proceed with applying database migrations and running the application."