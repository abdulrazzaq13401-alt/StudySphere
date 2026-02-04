using System.Collections.Generic;
using System.Threading.Tasks;
using StudySphere.API.DTOs;

namespace StudySphere.API.Services.Interfaces
{
    public interface ICourseService
    {
        Task<List<CourseDto>> GetAllCoursesAsync();
        Task<List<CourseDto>> GetCoursesBySemesterAsync(int semesterId);
        Task<int> CreateCourseAsync(CreateCourseRequest req);
    }
}
