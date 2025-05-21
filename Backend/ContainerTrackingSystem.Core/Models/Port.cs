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
