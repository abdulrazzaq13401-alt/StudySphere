using System;
using System.Collections.Generic;

namespace StudySphere.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "Student"; // Student, Admin
        public DateTime CreatedAt { get; set; }
    }
}
