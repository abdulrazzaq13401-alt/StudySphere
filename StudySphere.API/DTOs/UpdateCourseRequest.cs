namespace StudySphere.API.DTOs
{
    public class UpdateCourseRequest
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public int InstructorId { get; set; }
        public int? SemesterId { get; set; }
    }
}
