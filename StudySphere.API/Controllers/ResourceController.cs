using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StudySphere.API.DTOs;
using StudySphere.API.Models;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly IResourceService _resourceService;
        private readonly IFileService _fileService;

        public ResourcesController(IResourceService resourceService, IFileService fileService)
        {
            _resourceService = resourceService;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ResourceDto>>> GetAll(
            [FromQuery] int? departmentId,
            [FromQuery] int? courseId,
            [FromQuery] string name,
            [FromQuery] ResourceType? resourceType,
            [FromQuery] string departmentSlug,
            [FromQuery] string courseCode)
        {
            var resources = await _resourceService.GetAllAsync(
                departmentId,
                courseId,
                name,
                resourceType,
                departmentSlug,
                courseCode);

            return Ok(resources);
        }

        [HttpGet("lookup-data")]
        public async Task<ActionResult<ResourceLookupDto>> GetLookupData()
        {
            var lookupData = await _resourceService.GetLookupDataAsync();
            return Ok(lookupData);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ResourceDto>> GetById(int id)
        {
            var resource = await _resourceService.GetResourceByIdAsync(id);
            if (resource == null)
            {
                return NotFound(new { message = "Resource not found." });
            }

            return Ok(resource);
        }

        [HttpGet("{id:int}/download")]
        public async Task<ActionResult> Download(int id)
        {
            var fileData = await _resourceService.GetDownloadFileAsync(id);
            if (fileData == null)
            {
                return NotFound(new { message = "Resource file not found." });
            }

            var stream = _fileService.OpenRead(fileData.RelativePath);
            return File(stream, fileData.ContentType, fileData.FileName);
        }

        [HttpGet("{id:int}/view")]
        public async Task<ActionResult> View(int id)
        {
            var fileData = await _resourceService.GetDownloadFileAsync(id);
            if (fileData == null)
            {
                return NotFound(new { message = "Resource file not found." });
            }

            var stream = _fileService.OpenRead(fileData.RelativePath);
            return File(stream, fileData.ContentType);
        }

        [HttpPost]
        public async Task<ActionResult<ResourceDto>> Create([FromForm] CreateResourceRequest request)
        {
            var result = await _resourceService.CreateAsync(request);
            return ToActionResult(result, result.Data?.Id);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ResourceDto>> Update(int id, [FromForm] UpdateResourceRequest request)
        {
            var result = await _resourceService.UpdateAsync(id, request);
            return ToActionResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _resourceService.DeleteAsync(id);
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
