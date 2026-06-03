using Microsoft.AspNetCore.Http;
using StudySphere.API.Models;

namespace StudySphere.API.DTOs
{
    public class UpdateResourceRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ResourceType ResourceType { get; set; } = ResourceType.Document;
        public int CourseId { get; set; }
        public IFormFile File { get; set; }
    }
}
