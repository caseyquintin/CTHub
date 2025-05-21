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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
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
