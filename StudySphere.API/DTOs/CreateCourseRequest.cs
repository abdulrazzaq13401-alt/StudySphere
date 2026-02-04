namespace StudySphere.API.DTOs
{
    public class CreateCourseRequest
    {
        public string Code { get; set; }
        public string Title { get; set; }
        public int SemesterId { get; set; }
        public int InstructorId { get; set; }
    }
}
