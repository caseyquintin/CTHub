using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ContainerTrackingSystem.Core.Interfaces;
using System.Linq;

namespace ContainerTrackingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public TestController(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("connection")]
        public IActionResult TestConnection()
        {
            // Temporarily hardcode the connection string to test
            var connectionString = "Server=LT-QUINTIN2\\CTHUB;Database=CTHub;User Id=api_user;Password=Containers1234!;TrustServerCertificate=True;";
            var configConnectionString = _configuration.GetConnectionString("CTHubConnection");
            
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();
                
                using var command = new SqlCommand("SELECT @@VERSION, DB_NAME()", connection);
                using var reader = command.ExecuteReader();
                
                if (reader.Read())
                {
                    return Ok(new
                    {
                        Status = "Success",
                        Version = reader.GetString(0),
                        Database = reader.GetString(1),
                        ConnectionString = connectionString.Replace("Containers1234!", "***"),
                        ConfigConnectionString = configConnectionString?.Replace("Containers1234!", "***")
                    });
                }
                
                return Ok(new { Status = "Connected but no data" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Status = "Failed",
                    Error = ex.Message,
                    HardcodedConnectionString = connectionString.Replace("Containers1234!", "***"),
                    ConfigConnectionString = configConnectionString?.Replace("Containers1234!", "***")
                });
            }
        }

        [HttpGet("sample-container")]
        public async Task<IActionResult> GetSampleContainer()
        {
            try
            {
                var container = await _unitOfWork.Containers.Query()
                    .Include(c => c.Shipline)
                    .Include(c => c.VesselLine)
                    .Include(c => c.Vessel)
                    .Include(c => c.Port)
                    .Include(c => c.Terminal)
                    .FirstOrDefaultAsync();

                if (container == null)
                {
                    return NotFound("No containers found in the database");
                }

                return Ok(new
                {
                    Container = container,
                    ShiplineInfo = container.Shipline != null ? new
                    {
                        ShiplineID = container.Shipline.ShiplineID,
                        ShiplineName = container.Shipline.ShiplineName,
                        Link = container.Shipline.Link,
                        IsDynamicLink = container.Shipline.IsDynamicLink
                    } : null,
                    Metadata = new
                    {
                        ContainerShiplineID = container.ShiplineID,
                        ShiplineExists = container.Shipline != null,
                        ShiplineType = container.Shipline?.GetType().Name
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("schema")]
        public IActionResult GetTableSchema()
        {
            var connectionString = "Server=LT-QUINTIN2\\CTHUB;Database=CTHub;User Id=api_user;Password=Containers1234!;TrustServerCertificate=True;";
            
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();
                
                var command = new SqlCommand(@"
                    SELECT 
                        t.TABLE_NAME,
                        c.COLUMN_NAME,
                        c.DATA_TYPE,
                        c.IS_NULLABLE
                    FROM INFORMATION_SCHEMA.TABLES t
                    INNER JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
                    WHERE t.TABLE_TYPE = 'BASE TABLE'
                    ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION", connection);
                
                using var reader = command.ExecuteReader();
                var schemas = new List<object>();
                
                while (reader.Read())
                {
                    schemas.Add(new
                    {
                        TableName = reader["TABLE_NAME"].ToString(),
                        ColumnName = reader["COLUMN_NAME"].ToString(),
                        DataType = reader["DATA_TYPE"].ToString(),
                        IsNullable = reader["IS_NULLABLE"].ToString()
                    });
                }
                
                return Ok(schemas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("tables")]
        public IActionResult GetTables()
        {
            var connectionString = "Server=LT-QUINTIN2\\CTHUB;Database=CTHub;User Id=api_user;Password=Containers1234!;TrustServerCertificate=True;";
            
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();
                
                var command = new SqlCommand("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME", connection);
                using var reader = command.ExecuteReader();
                var tables = new List<string>();
                
                while (reader.Read())
                {
                    tables.Add(reader["TABLE_NAME"].ToString() ?? "");
                }
                
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}