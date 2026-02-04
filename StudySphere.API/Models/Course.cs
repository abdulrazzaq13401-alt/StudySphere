using System.Collections.Generic;

namespace StudySphere.API.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Code { get; set; } // "CS101"
        public string Title { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public int InstructorId { get; set; }
        public User Instructor { get; set; }
        public ICollection<Resource> Resources { get; set; }
    }
}
