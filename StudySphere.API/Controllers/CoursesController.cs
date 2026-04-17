using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CourseDto>>> GetAll([FromQuery] int? departmentId)
        {
            var courses = await _courseService.GetAllAsync(departmentId);
            return Ok(courses);
        }

        [HttpGet("lookup-data")]
        public async Task<ActionResult<CourseLookupDto>> GetLookupData()
        {
            var lookupData = await _courseService.GetLookupDataAsync();
            return Ok(lookupData);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CourseDto>> GetById(int id)
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course == null)
            {
                return NotFound(new { message = "Course not found." });
            }

            return Ok(course);
        }

        [HttpPost]
        public async Task<ActionResult<CourseDto>> Create([FromBody] CreateCourseRequest request)
        {
            var result = await _courseService.CreateAsync(request);
            return ToActionResult(result, result.Data?.Id);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CourseDto>> Update(int id, [FromBody] UpdateCourseRequest request)
        {
            var result = await _courseService.UpdateAsync(id, request);
            return ToActionResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _courseService.DeleteAsync(id);
            if (result.Status == DepartmentCommandStatus.Success)
            {
                return NoContent();
            }

            return ToActionResult(result);
        }

        private ActionResult ToActionResult<T>(DepartmentCommandResult<T> result, int? createdRouteId = null)
        {
            return result.Status switch
            {
                DepartmentCommandStatus.Success when createdRouteId.HasValue =>
                    CreatedAtAction(nameof(GetById), new { id = createdRouteId.Value }, result.Data),
                DepartmentCommandStatus.Success => Ok(result.Data),
                DepartmentCommandStatus.NotFound => NotFound(new { message = result.ErrorMessage }),
                DepartmentCommandStatus.Conflict => Conflict(new { message = result.ErrorMessage }),
                _ => BadRequest(new { message = result.ErrorMessage }),
            };
        }
    }
}
