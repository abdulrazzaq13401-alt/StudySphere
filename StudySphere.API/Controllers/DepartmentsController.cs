using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        string[] departments =
        [
            "Computer Science",
            "Engineering",
            "Business Administration",
            "Liberal Arts",
            "Medicine",
            "Law",
            "Education",
            "Psychology",
            "Pharmacy",
            "Nursing",
            "Architecture",
            "Environmental Science",
            "Physical Therapy",
            "Economics",
            "Political Science",
            "Sociology",
            "History",
            "Mathematics",
            "English ",
            "Emergency Care",
            "Pakistan Studies",
            "Islamic Studies",
            "Microbiology",
            "Biochemistry",

        ];

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return departments;
        }
    }
}