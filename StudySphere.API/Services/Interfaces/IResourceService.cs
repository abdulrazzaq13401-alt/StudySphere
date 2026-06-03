using System.Collections.Generic;
using System.Threading.Tasks;
using StudySphere.API.DTOs;
using StudySphere.API.Models;

namespace StudySphere.API.Services.Interfaces
{
    public interface IResourceService
    {
        Task<IReadOnlyList<ResourceDto>> GetAllAsync(
            int? departmentId,
            int? courseId,
            string name,
            ResourceType? resourceType,
            string departmentSlug,
            string courseCode);
        Task<ResourceDto> GetResourceByIdAsync(int id);
        Task<ResourceLookupDto> GetLookupDataAsync();
        Task<DepartmentCommandResult<ResourceDto>> CreateAsync(CreateResourceRequest request);
        Task<DepartmentCommandResult<ResourceDto>> UpdateAsync(int id, UpdateResourceRequest request);
        Task<DepartmentCommandResult<bool>> DeleteAsync(int id);
        Task<ResourceFileDto> GetDownloadFileAsync(int id);
    }
}
