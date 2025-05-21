using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ContainerTrackingSystem.Core.Models
{
    public class ContainerFilterRequest
    {
        public string? SearchTerm { get; set; }
        public List<string> SearchFields { get; set; } = new List<string>();
        public List<string> Status { get; set; } = new List<string>();
        public string? DateField { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> ContainerSize { get; set; } = new List<string>();
        public List<string> Shipline { get; set; } = new List<string>();
        public List<string> PortOfEntry { get; set; } = new List<string>();
        public string? Vendor { get; set; }
        public bool? Rail { get; set; }
        
        // Pagination parameters
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 100;
        
        // Sorting parameters
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
    }

    public class ContainerFilterResponse<T>
    {
        public List<T> Data { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}