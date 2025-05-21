using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class DropdownOption
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Value { get; set; }
        
        public bool IsActive { get; set; }
        
        public int SortOrder { get; set; }
    }
}
