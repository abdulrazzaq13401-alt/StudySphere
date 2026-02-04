using Microsoft.AspNetCore.Http;

namespace StudySphere.API.DTOs
{
    public class CreateResourceRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int CourseId { get; set; }
        public IFormFile File { get; set; }
    }
}
