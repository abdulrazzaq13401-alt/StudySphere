using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<DepartmentDto>>> GetAll()
        {
            var departments = await _departmentService.GetAllAsync();
            return Ok(departments);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DepartmentDto>> GetById(int id)
        {
            var department = await _departmentService.GetByIdAsync(id);
            if (department == null)
            {
                return NotFound(new { message = "Department not found." });
            }

            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDto>> Create([FromBody] CreateDepartmentRequest request)
        {
            var result = await _departmentService.CreateAsync(request);
            return ToActionResult(result, createdRouteId: result.Data?.Id);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<DepartmentDto>> Update(int id, [FromBody] UpdateDepartmentRequest request)
        {
            var result = await _departmentService.UpdateAsync(id, request);
            return ToActionResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _departmentService.DeleteAsync(id);
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
