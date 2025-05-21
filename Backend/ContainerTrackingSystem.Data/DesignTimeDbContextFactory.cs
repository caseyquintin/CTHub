using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace ContainerTrackingSystem.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Get the base directory for the application
            var basePath = Directory.GetCurrentDirectory();
            
            // Move up one level if we're in the Data project
            if (basePath.EndsWith("ContainerTrackingSystem.Data"))
            {
                basePath = Path.GetFullPath(Path.Combine(basePath, ".."));
            }

            // Path to the API project where appsettings.json should be
            var apiProjectPath = Path.Combine(basePath, "ContainerTrackingSystem.API");
            
            // Create configuration
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            // Create DbContext options
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("CTHubConnection");
            
            builder.UseSqlServer(connectionString);

            return new ApplicationDbContext(builder.Options);
        }
    }
}