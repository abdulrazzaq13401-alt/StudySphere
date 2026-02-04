using System.Collections.Generic;
using System.Threading.Tasks;
using StudySphere.API.DTOs;

namespace StudySphere.API.Services.Interfaces
{
    public interface IResourceService
    {
        Task<List<ResourceDto>> SearchResourcesAsync(
            int? semesterId,
            int? courseId,
            int? instructorId,
            string resourceType
        );
        Task<ResourceDto> GetResourceByIdAsync(int id);
        Task<int> CreateResourceAsync(CreateResourceRequest req, int userId);
        Task<bool> DeleteResourceAsync(int id, int userId);
    }
}
