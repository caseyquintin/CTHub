using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class VesselLine
    {
        [Key]
        public int VesselLineID { get; set; }
        
        [Required]
        [StringLength(100)]
        [Column("VesselLine")]
        public string VesselLineName { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public bool IsDynamicLink { get; set; }
        
        public virtual ICollection<Vessel> Vessels { get; set; }
        public virtual ICollection<Container> Containers { get; set; }
    }
}
