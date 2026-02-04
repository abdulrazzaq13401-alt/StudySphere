using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResourcesController : ControllerBase
    {
        private readonly IResourceService _resourceService;

        public ResourcesController(IResourceService resourceService)
        {
            _resourceService = resourceService;
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ResourceDto>>> SearchResources(
            [FromQuery] int? semesterId,
            [FromQuery] int? courseId,
            [FromQuery] int? instructorId,
            [FromQuery] string resourceType)
        {
            var resources = await _resourceService.SearchResourcesAsync(
                semesterId, courseId, instructorId, resourceType);
            return Ok(resources);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ResourceDto>> GetResource(int id)
        {
            var resource = await _resourceService.GetResourceByIdAsync(id);
            if (resource == null)
                return NotFound();
            return Ok(resource);
        }

        [HttpPost]
        public async Task<ActionResult> UploadResource([FromForm] CreateResourceRequest req)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var resourceId = await _resourceService.CreateResourceAsync(req, userId);
            return CreatedAtAction(nameof(GetResource), new { id = resourceId });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteResource(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var success = await _resourceService.DeleteResourceAsync(id, userId);
            if (!success)
                return Forbid();
            return NoContent();
        }
    }
}
