using System;

namespace StudySphere.API.DTOs
{
    public class ResourceDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
        public int Downloads { get; set; }
        public string CourseName { get; set; }
        public string InstructorName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
