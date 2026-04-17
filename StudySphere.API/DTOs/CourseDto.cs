namespace StudySphere.API.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int InstructorId { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public int? SemesterId { get; set; }
        public string SemesterName { get; set; } = string.Empty;
        public int ResourceCount { get; set; }
    }
}
