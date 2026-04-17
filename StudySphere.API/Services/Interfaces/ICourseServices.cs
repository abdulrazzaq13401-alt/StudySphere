using System.Collections.Generic;
using System.Threading.Tasks;
using StudySphere.API.DTOs;

namespace StudySphere.API.Services.Interfaces
{
    public interface ICourseService
    {
        Task<IReadOnlyList<CourseDto>> GetAllAsync(int? departmentId = null);
        Task<CourseDto> GetByIdAsync(int id);
        Task<CourseLookupDto> GetLookupDataAsync();
        Task<DepartmentCommandResult<CourseDto>> CreateAsync(CreateCourseRequest request);
        Task<DepartmentCommandResult<CourseDto>> UpdateAsync(int id, UpdateCourseRequest request);
        Task<DepartmentCommandResult<bool>> DeleteAsync(int id);
    }
}
