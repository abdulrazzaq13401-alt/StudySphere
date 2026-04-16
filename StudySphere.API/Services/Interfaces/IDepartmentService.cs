using System.Collections.Generic;
using System.Threading.Tasks;
using StudySphere.API.DTOs;

namespace StudySphere.API.Services.Interfaces
{
    public interface IDepartmentService
    {
        Task<IReadOnlyList<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto> GetByIdAsync(int id);
        Task<DepartmentCommandResult<DepartmentDto>> CreateAsync(CreateDepartmentRequest request);
        Task<DepartmentCommandResult<DepartmentDto>> UpdateAsync(int id, UpdateDepartmentRequest request);
        Task<DepartmentCommandResult<bool>> DeleteAsync(int id);
    }
}
