using System.Collections.Generic;

namespace StudySphere.API.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // "CS101"
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public int InstructorId { get; set; }
        public User Instructor { get; set; }
        public int? SemesterId { get; set; }
        public Semester Semester { get; set; }
        public ICollection<Resource> Resources { get; set; } = [];
    }
}
