using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class Shipline
    {
        [Key]
        public int ShiplineID { get; set; }
        
        [Required]
        [StringLength(100)]
        [Column("Shipline")]
        public string ShiplineName { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public bool IsDynamicLink { get; set; }
        
        public virtual ICollection<Container> Containers { get; set; }
    }
}
