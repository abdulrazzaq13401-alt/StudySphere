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

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return departments[id];
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value) { }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value) { }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id) { }
    }
}