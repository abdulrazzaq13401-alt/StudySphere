using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace StudySphere.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        string[] course =
        [
            "Programming fundamentafls",
            "Object oriented programming",
            "Data structures and algorithms",
            "Database management systems",
            "Web development",
            "Mobile app development",
            "Cloud computing",
            "Cybersecurity basics",
            "Software testing and quality assurance",
            "DevOps practices",
            "Machine learning introduction",
            "Artificial intelligence overview",
        ];

        // GET api/courses
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return course;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return course[id];
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
