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
