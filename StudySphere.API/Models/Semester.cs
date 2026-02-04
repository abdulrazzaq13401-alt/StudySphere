using System;
using System.Collections.Generic;

namespace StudySphere.API.Models
{
    public class Semester
    {
        public int Id { get; set; }
        public string Name { get; set; } // e.g., "Fall 2026"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ICollection<Course> Courses { get; set; }
    }
}
