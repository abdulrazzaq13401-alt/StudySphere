namespace StudySphere.API.DTOs
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public int CourseCount { get; set; }
        public int ResourceCount { get; set; }
    }
}
