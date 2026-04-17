using System.Collections.Generic;

namespace StudySphere.API.DTOs
{
    public class CourseLookupDto
    {
        public IReadOnlyList<CourseDepartmentLookupDto> Departments { get; set; } = [];
        public IReadOnlyList<CourseInstructorLookupDto> Instructors { get; set; } = [];
        public IReadOnlyList<CourseSemesterLookupDto> Semesters { get; set; } = [];
    }

    public class CourseDepartmentLookupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CourseInstructorLookupDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class CourseSemesterLookupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
