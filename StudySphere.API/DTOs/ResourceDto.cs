using System;
using StudySphere.API.Models;

namespace StudySphere.API.DTOs
{
    public class ResourceDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ResourceType ResourceType { get; set; }
        public string ResourceTypeLabel { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string DepartmentSlug { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public int Downloads { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
    }
}
