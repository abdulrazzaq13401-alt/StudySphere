using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudySphere.API.Context;
using StudySphere.API.DTOs;
using StudySphere.API.Models;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Services
{
    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<CourseDto>> GetAllAsync(int? departmentId = null)
        {
            var query = BuildCourseQuery();

            if (departmentId.HasValue)
            {
                query = query.Where(course => course.DepartmentId == departmentId.Value);
            }

            return await query
                .OrderBy(course => course.DepartmentName)
                .ThenBy(course => course.Code)
                .ToListAsync();
        }

        public async Task<CourseDto> GetByIdAsync(int id)
        {
            return await BuildCourseQuery()
                .FirstOrDefaultAsync(course => course.Id == id);
        }

        public async Task<CourseLookupDto> GetLookupDataAsync()
        {
            var departments = await _context.Departments
                .AsNoTracking()
                .OrderBy(department => department.Name)
                .Select(department => new CourseDepartmentLookupDto
                {
                    Id = department.Id,
                    Name = department.Name,
                })
                .ToListAsync();

            var instructors = await _context.Users
                .AsNoTracking()
                .Where(user => user.Role == "Instructor" || user.Role == "Admin")
                .OrderBy(user => user.FullName)
                .Select(user => new CourseInstructorLookupDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                })
                .ToListAsync();

            var semesters = await _context.Semesters
                .AsNoTracking()
                .OrderByDescending(semester => semester.StartDate)
                .Select(semester => new CourseSemesterLookupDto
                {
                    Id = semester.Id,
                    Name = semester.Name,
                })
                .ToListAsync();

            return new CourseLookupDto
            {
                Departments = departments,
                Instructors = instructors,
                Semesters = semesters,
            };
        }

        public async Task<DepartmentCommandResult<CourseDto>> CreateAsync(CreateCourseRequest request)
        {
            var code = NormalizeCode(request.Code);
            var title = request.Title.Trim();
            var validationError = await ValidateAsync(code, title, request.DepartmentId, request.InstructorId, request.SemesterId);
            if (validationError != null)
            {
                return DepartmentCommandResult<CourseDto>.ValidationFailed(validationError);
            }

            var duplicateExists = await _context.Courses.AnyAsync(course =>
                course.DepartmentId == request.DepartmentId && course.Code == code);
            if (duplicateExists)
            {
                return DepartmentCommandResult<CourseDto>.Conflict("Course code must be unique within the department.");
            }

            var course = new Course
            {
                Code = code,
                Title = title,
                DepartmentId = request.DepartmentId,
                InstructorId = request.InstructorId,
                SemesterId = request.SemesterId,
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var created = await GetByIdAsync(course.Id);
            return DepartmentCommandResult<CourseDto>.Success(created);
        }

        public async Task<DepartmentCommandResult<CourseDto>> UpdateAsync(int id, UpdateCourseRequest request)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(item => item.Id == id);
            if (course == null)
            {
                return DepartmentCommandResult<CourseDto>.NotFound("Course not found.");
            }

            var code = NormalizeCode(request.Code);
            var title = request.Title.Trim();
            var validationError = await ValidateAsync(code, title, request.DepartmentId, request.InstructorId, request.SemesterId);
            if (validationError != null)
            {
                return DepartmentCommandResult<CourseDto>.ValidationFailed(validationError);
            }

            var duplicateExists = await _context.Courses.AnyAsync(item =>
                item.Id != id &&
                item.DepartmentId == request.DepartmentId &&
                item.Code == code);
            if (duplicateExists)
            {
                return DepartmentCommandResult<CourseDto>.Conflict("Course code must be unique within the department.");
            }

            course.Code = code;
            course.Title = title;
            course.DepartmentId = request.DepartmentId;
            course.InstructorId = request.InstructorId;
            course.SemesterId = request.SemesterId;
            await _context.SaveChangesAsync();

            var updated = await GetByIdAsync(course.Id);
            return DepartmentCommandResult<CourseDto>.Success(updated);
        }

        public async Task<DepartmentCommandResult<bool>> DeleteAsync(int id)
        {
            var course = await _context.Courses
                .Include(item => item.Resources)
                .FirstOrDefaultAsync(item => item.Id == id);

            if (course == null)
            {
                return DepartmentCommandResult<bool>.NotFound("Course not found.");
            }

            if (course.Resources.Count > 0)
            {
                return DepartmentCommandResult<bool>.Conflict(
                    "Course cannot be deleted because resources are assigned to it.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return DepartmentCommandResult<bool>.Success(true);
        }

        private IQueryable<CourseDto> BuildCourseQuery()
        {
            return _context.Courses
                .AsNoTracking()
                .Select(course => new CourseDto
                {
                    Id = course.Id,
                    Code = course.Code,
                    Title = course.Title,
                    DepartmentId = course.DepartmentId,
                    DepartmentName = course.Department.Name,
                    InstructorId = course.InstructorId,
                    InstructorName = course.Instructor.FullName,
                    SemesterId = course.SemesterId,
                    SemesterName = course.Semester != null ? course.Semester.Name : string.Empty,
                    ResourceCount = course.Resources.Count,
                });
        }

        private async Task<string> ValidateAsync(
            string code,
            string title,
            int departmentId,
            int instructorId,
            int? semesterId)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return "Course code is required.";
            }

            if (string.IsNullOrWhiteSpace(title))
            {
                return "Course title is required.";
            }

            var departmentExists = await _context.Departments.AnyAsync(department => department.Id == departmentId);
            if (!departmentExists)
            {
                return "Selected department does not exist.";
            }

            var instructorExists = await _context.Users.AnyAsync(user =>
                user.Id == instructorId && (user.Role == "Instructor" || user.Role == "Admin"));
            if (!instructorExists)
            {
                return "Selected instructor does not exist.";
            }

            if (semesterId.HasValue)
            {
                var semesterExists = await _context.Semesters.AnyAsync(semester => semester.Id == semesterId.Value);
                if (!semesterExists)
                {
                    return "Selected semester does not exist.";
                }
            }

            return null;
        }

        private static string NormalizeCode(string value)
        {
            return (value ?? string.Empty).Trim().ToUpperInvariant();
        }
    }
}
