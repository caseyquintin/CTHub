using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContainerTrackingSystem.Core.Models
{
    public class Terminal
    {
        [Key]
        public int TerminalID { get; set; }
        
        [Required]
        [StringLength(100)]
        [Column("Terminal")]
        public string TerminalName { get; set; }
        
        public int PortID { get; set; }
        [ForeignKey("PortID")]
        public virtual Port Port { get; set; }
        
        [StringLength(255)]
        public string Link { get; set; }
        
        public virtual ICollection<Container> Containers { get; set; }
    }
}
