using ContainerTrackingSystem.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ContainerTrackingSystem.API
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Use the working connection string directly
            var connectionString = "Server=LT-QUINTIN2\\CTHUB;Database=CTHub;User Id=api_user;Password=Containers1234!;TrustServerCertificate=True;";
            Console.WriteLine($"Using connection string: {connectionString}");

            // Create DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}