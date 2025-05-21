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
        [Column("Container")]
        public string ContainerNumber { get; set; }
        
        [StringLength(50)]
        public string? ProjectNumber { get; set; }
        
        [StringLength(50)]
        public string? CurrentStatus { get; set; }
        
        public int? ShiplineID { get; set; }
        [ForeignKey("ShiplineID")]
        public virtual Shipline? Shipline { get; set; }
        
        [StringLength(50)]
        public string? ContainerSize { get; set; }
        
        [StringLength(100)]
        public string? MainSource { get; set; }
        
        public string? Transload { get; set; }
        
        [StringLength(100)]
        public string? BOLBookingNumber { get; set; }
        
        [StringLength(100)]
        public string? VendorIDNumber { get; set; }
        
        [StringLength(100)]
        public string? Vendor { get; set; }
        
        [StringLength(100)]
        public string? PONumber { get; set; }
        
        // Vessel info
        public int? VesselLineID { get; set; }
        [ForeignKey("VesselLineID")]
        public virtual VesselLine? VesselLine { get; set; }
        
        public int? VesselID { get; set; }
        [ForeignKey("VesselID")]
        public virtual Vessel? Vessel { get; set; }
        
        [StringLength(50)]
        public string? Voyage { get; set; }
        
        // Port info
        [StringLength(100)]
        public string? PortOfDeparture { get; set; }
        
        public int? PortID { get; set; }
        [ForeignKey("PortID")]
        public virtual Port? Port { get; set; }
        
        [StringLength(100)]
        public string? PortOfEntry { get; set; }
        
        public int? TerminalID { get; set; }
        [ForeignKey("TerminalID")]
        public virtual Terminal? Terminal { get; set; }
        
        // Rail info
        public string? Rail { get; set; }
        
        [StringLength(100)]
        public string? RailDestination { get; set; }
        
        [StringLength(100)]
        public string? RailwayLine { get; set; }
        
        [StringLength(100)]
        public string? RailPickupNumber { get; set; }
        
        // Carrier info
        public int? CarrierID { get; set; }
        [StringLength(100)]
        public string? Carrier { get; set; }
        
        // Date tracking
        public DateTime? Sail { get; set; }
        
        [StringLength(20)]
        public string? SailActual { get; set; }
        
        public DateTime? Berth { get; set; }
        
        [StringLength(20)]
        public string? BerthActual { get; set; }
        
        public DateTime? Arrival { get; set; }
        
        [StringLength(20)]
        public string? ArrivalActual { get; set; }
        
        public DateTime? Offload { get; set; }
        
        [StringLength(20)]
        public string? OffloadActual { get; set; }
        
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
        public string? Notes { get; set; }
    }
}
