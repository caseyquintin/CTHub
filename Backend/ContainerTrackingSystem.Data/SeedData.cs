using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ContainerTrackingSystem.Core.Models;

namespace ContainerTrackingSystem.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Look for existing data
            if (context.Containers.Any())
            {
                return;   // DB has been seeded
            }

            // Seed Shiplines
            var shiplines = new List<Shipline>
            {
                new Shipline { ShiplineName = "Maersk", Link = "https://www.maersk.com/tracking/{containerNumber}", IsDynamicLink = true },
                new Shipline { ShiplineName = "CMA CGM", Link = "https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={containerNumber}", IsDynamicLink = true },
                new Shipline { ShiplineName = "Hapag-Lloyd", Link = "https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html?container={containerNumber}", IsDynamicLink = true },
                new Shipline { ShiplineName = "MSC", Link = "https://www.msc.com/track-a-shipment?link={containerNumber}", IsDynamicLink = true },
                new Shipline { ShiplineName = "COSCO", Link = "https://elines.coscoshipping.com/ebusiness/cargoTracking?TrackingType=0&SearchCode={containerNumber}", IsDynamicLink = true }
            };
            context.Shiplines.AddRange(shiplines);
            context.SaveChanges();

            // Seed Vessel Lines
            var vesselLines = new List<VesselLine>
            {
                new VesselLine { VesselLineName = "Ocean Network Express", Link = "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=&container_no={containerNumber}", IsDynamicLink = true },
                new VesselLine { VesselLineName = "Evergreen Line", Link = "https://www.evergreen-line.com/eservice/public/cargoTracking.jsp?txtbSearch=BL&txtbNo={bolNumber}", IsDynamicLink = true },
                new VesselLine { VesselLineName = "Yang Ming", Link = "https://www.yangming.com/e-service/track_trace/track_trace_cargo_tracking.aspx?str={containerNumber}", IsDynamicLink = true },
                new VesselLine { VesselLineName = "HMM", Link = "https://www.hmm21.com/cms/business/usa/index.jsp?", IsDynamicLink = false },
                new VesselLine { VesselLineName = "PIL", Link = "https://www.pilship.com/en-track-trace-container/109.html?container_no={containerNumber}", IsDynamicLink = true }
            };
            context.VesselLines.AddRange(vesselLines);
            context.SaveChanges();

            // Seed Vessels
            var vessels = new List<Vessel>
            {
                new Vessel { VesselName = "Emma Maersk", VesselLineID = vesselLines[0].VesselLineID, IMO = "9321483", MMSI = "220417000" },
                new Vessel { VesselName = "Ever Given", VesselLineID = vesselLines[1].VesselLineID, IMO = "9811000", MMSI = "353136000" },
                new Vessel { VesselName = "CMA CGM Antoine de Saint Exupery", VesselLineID = vesselLines[0].VesselLineID, IMO = "9776171", MMSI = "228339600" },
                new Vessel { VesselName = "Madrid Maersk", VesselLineID = vesselLines[0].VesselLineID, IMO = "9778791", MMSI = "219622000" },
                new Vessel { VesselName = "MSC Gülsün", VesselLineID = vesselLines[2].VesselLineID, IMO = "9839430", MMSI = "255805000" }
            };
            context.Vessels.AddRange(vessels);
            context.SaveChanges();

            // Seed Ports
            var ports = new List<Port>
            {
                new Port { PortOfEntry = "Los Angeles" },
                new Port { PortOfEntry = "Long Beach" },
                new Port { PortOfEntry = "New York/New Jersey" },
                new Port { PortOfEntry = "Savannah" },
                new Port { PortOfEntry = "Seattle" }
            };
            context.Ports.AddRange(ports);
            context.SaveChanges();

            // Seed Terminals
            var terminals = new List<Terminal>
            {
                new Terminal { TerminalName = "APM Terminals Pier 400", PortID = ports[0].PortID, Link = "https://www.apmterminals.com/en/los-angeles/practical-information/container-tracking?container={containerNumber}" },
                new Terminal { TerminalName = "Yusen Terminals", PortID = ports[0].PortID, Link = "https://www.yti.com/cgi-bin/webtrack" },
                new Terminal { TerminalName = "Long Beach Container Terminal", PortID = ports[1].PortID, Link = "https://lbct.com/track-and-trace" },
                new Terminal { TerminalName = "Maher Terminals", PortID = ports[2].PortID, Link = "https://www.maherterminals.com/trackandtrace" },
                new Terminal { TerminalName = "Garden City Terminal", PortID = ports[3].PortID, Link = "https://gaports.com/facilities/garden-city-terminal/" }
            };
            context.Terminals.AddRange(terminals);
            context.SaveChanges();

            // Seed Dropdown Options
            var dropdownOptions = new List<DropdownOption>
            {
                // Container Status options
                new DropdownOption { Category = "ContainerStatus", Value = "Not Sailed", IsActive = true, SortOrder = 1 },
                new DropdownOption { Category = "ContainerStatus", Value = "On Vessel", IsActive = true, SortOrder = 2 },
                new DropdownOption { Category = "ContainerStatus", Value = "At Port", IsActive = true, SortOrder = 3 },
                new DropdownOption { Category = "ContainerStatus", Value = "On Rail", IsActive = true, SortOrder = 4 },
                new DropdownOption { Category = "ContainerStatus", Value = "Delivered", IsActive = true, SortOrder = 5 },
                new DropdownOption { Category = "ContainerStatus", Value = "Returned", IsActive = true, SortOrder = 6 },
                
                // Container Size options
                new DropdownOption { Category = "ContainerSize", Value = "20'", IsActive = true, SortOrder = 1 },
                new DropdownOption { Category = "ContainerSize", Value = "40'", IsActive = true, SortOrder = 2 },
                new DropdownOption { Category = "ContainerSize", Value = "40' High Cube", IsActive = true, SortOrder = 3 },
                new DropdownOption { Category = "ContainerSize", Value = "45'", IsActive = true, SortOrder = 4 },
                new DropdownOption { Category = "ContainerSize", Value = "53'", IsActive = true, SortOrder = 5 },
                
                // Actual/Estimate options
                new DropdownOption { Category = "ActualEstimate", Value = "Actual", IsActive = true, SortOrder = 1 },
                new DropdownOption { Category = "ActualEstimate", Value = "Estimated", IsActive = true, SortOrder = 2 }
            };
            context.DropdownOptions.AddRange(dropdownOptions);
            context.SaveChanges();

            // Generate some realistic container numbers
            string[] prefixes = { "MAEU", "CMAU", "HLXU", "MSCU", "COSU", "OOLU", "EGLV", "YMLU", "HMMU", "PCIU" };
            var random = new Random();
            
            // Create containers
            var containers = new List<Container>();
            var statuses = dropdownOptions.Where(d => d.Category == "ContainerStatus").Select(d => d.Value).ToList();
            var sizes = dropdownOptions.Where(d => d.Category == "ContainerSize").Select(d => d.Value).ToList();
            
            for (int i = 0; i < 50; i++)
            {
                // Create random container number
                string prefix = prefixes[random.Next(prefixes.Length)];
                string number = random.Next(1000000, 9999999).ToString();
                string containerNumber = prefix + number;
                
                // Assign random status and create dates accordingly
                string status = statuses[random.Next(statuses.Count)];
                DateTime now = DateTime.Now;
                DateTime? sail = null;
                DateTime? arrival = null;
                DateTime? available = null;
                DateTime? delivered = null;
                DateTime? returned = null;
                
                // Assign dates based on status
                switch (status)
                {
                    case "Not Sailed":
                        sail = now.AddDays(random.Next(1, 30));
                        break;
                    case "On Vessel":
                        sail = now.AddDays(-random.Next(1, 20));
                        arrival = now.AddDays(random.Next(1, 30));
                        break;
                    case "At Port":
                        sail = now.AddDays(-random.Next(21, 40));
                        arrival = now.AddDays(-random.Next(1, 10));
                        available = now.AddDays(random.Next(1, 5));
                        break;
                    case "On Rail":
                        sail = now.AddDays(-random.Next(41, 60));
                        arrival = now.AddDays(-random.Next(11, 20));
                        available = now.AddDays(-random.Next(1, 10));
                        break;
                    case "Delivered":
                        sail = now.AddDays(-random.Next(61, 90));
                        arrival = now.AddDays(-random.Next(21, 40));
                        available = now.AddDays(-random.Next(11, 30));
                        delivered = now.AddDays(-random.Next(1, 10));
                        break;
                    case "Returned":
                        sail = now.AddDays(-random.Next(91, 120));
                        arrival = now.AddDays(-random.Next(41, 70));
                        available = now.AddDays(-random.Next(31, 60));
                        delivered = now.AddDays(-random.Next(11, 40));
                        returned = now.AddDays(-random.Next(1, 10));
                        break;
                }
                
                // Create container
                var container = new Container
                {
                    ContainerNumber = containerNumber,
                    ProjectNumber = "P" + random.Next(10000, 99999).ToString(),
                    CurrentStatus = status,
                    ShiplineID = shiplines[random.Next(shiplines.Count)].ShiplineID,
                    ContainerSize = sizes[random.Next(sizes.Count)],
                    MainSource = "Factory " + (char)(65 + random.Next(0, 26)),
                    Transload = random.Next(2) == 1 ? "Yes" : "No",
                    BOLBookingNumber = "BOL" + random.Next(100000, 999999).ToString(),
                    Vendor = $"Vendor {(char)(65 + random.Next(0, 26))}{(char)(65 + random.Next(0, 26))}",
                    PONumber = "PO" + random.Next(10000, 99999).ToString(),
                    VesselLineID = vesselLines[random.Next(vesselLines.Count)].VesselLineID,
                    VesselID = vessels[random.Next(vessels.Count)].VesselID,
                    Voyage = "V" + random.Next(100, 999).ToString(),
                    PortOfDeparture = new[] { "Shanghai", "Singapore", "Busan", "Ningbo-Zhoushan", "Guangzhou" }[random.Next(5)],
                    PortID = ports[random.Next(ports.Count)].PortID,
                    PortOfEntry = ports[random.Next(ports.Count)].PortOfEntry,
                    TerminalID = terminals[random.Next(terminals.Count)].TerminalID,
                    Rail = random.Next(2) == 1 ? "Yes" : "No",
                    RailDestination = random.Next(2) == 1 ? new[] { "Chicago", "Dallas", "Memphis", "Atlanta", "Columbus" }[random.Next(5)] : null,
                    RailwayLine = random.Next(2) == 1 ? new[] { "BNSF", "UP", "CSX", "Norfolk Southern", "CN" }[random.Next(5)] : null,
                    RailPickupNumber = random.Next(2) == 1 ? "RP" + random.Next(10000, 99999).ToString() : null,
                    Carrier = random.Next(2) == 1 ? new[] { "XPO Logistics", "J.B. Hunt", "Schneider", "C.H. Robinson", "Hub Group" }[random.Next(5)] : null,
                    Sail = sail,
                    SailActual = sail.HasValue ? (random.Next(2) == 1 ? "Actual" : "Estimated") : null,
                    Arrival = arrival,
                    ArrivalActual = arrival.HasValue ? (random.Next(2) == 1 ? "Actual" : "Estimated") : null,
                    Available = available,
                    PickupLFD = available.HasValue ? available.Value.AddDays(random.Next(3, 10)) : null,
                    ReturnLFD = available.HasValue ? available.Value.AddDays(random.Next(10, 30)) : null,
                    Delivered = delivered,
                    Returned = returned,
                    LastUpdated = now.AddDays(-random.Next(0, 5)),
                    Notes = random.Next(3) == 0 ? $"Test container with {status} status" : null
                };
                
                containers.Add(container);
            }
            
            context.Containers.AddRange(containers);
            context.SaveChanges();
        }
    }
}