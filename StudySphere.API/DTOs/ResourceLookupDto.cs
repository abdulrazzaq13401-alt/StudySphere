using System.Collections.Generic;

namespace StudySphere.API.DTOs
{
    public class ResourceLookupDto
    {
        public IReadOnlyList<ResourceDepartmentLookupDto> Departments { get; set; } = [];
        public IReadOnlyList<ResourceCourseLookupDto> Courses { get; set; } = [];
    }

    public class ResourceDepartmentLookupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class ResourceCourseLookupDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
    }
}
