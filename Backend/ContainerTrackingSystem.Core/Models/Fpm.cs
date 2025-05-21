using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class Fpm
    {
        [Key]
        public int FpmID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FpmName { get; set; }
        
        public bool Active { get; set; }
    }
}
