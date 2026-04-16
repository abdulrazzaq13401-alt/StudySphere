using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudySphere.API.Context;
using StudySphere.API.DTOs;
using StudySphere.API.Models;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _context;

        public DepartmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync()
        {
            return await BuildDepartmentQuery()
                .OrderBy(department => department.Name)
                .ToListAsync();
        }

        public async Task<DepartmentDto> GetByIdAsync(int id)
        {
            return await BuildDepartmentQuery()
                .FirstOrDefaultAsync(department => department.Id == id);
        }

        public async Task<DepartmentCommandResult<DepartmentDto>> CreateAsync(CreateDepartmentRequest request)
        {
            var normalizedName = request.Name.Trim();
            var normalizedSlug = NormalizeSlug(request.Slug);

            var validationError = Validate(normalizedName, normalizedSlug);
            if (validationError != null)
            {
                return DepartmentCommandResult<DepartmentDto>.ValidationFailed(validationError);
            }

            var slugExists = await _context.Departments.AnyAsync(department => department.Slug == normalizedSlug);
            if (slugExists)
            {
                return DepartmentCommandResult<DepartmentDto>.Conflict("Department slug must be unique.");
            }

            var department = new Department
            {
                Name = normalizedName,
                Slug = normalizedSlug,
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            var createdDepartment = await GetByIdAsync(department.Id);
            return DepartmentCommandResult<DepartmentDto>.Success(createdDepartment!);
        }

        public async Task<DepartmentCommandResult<DepartmentDto>> UpdateAsync(int id, UpdateDepartmentRequest request)
        {
            var department = await _context.Departments.FirstOrDefaultAsync(item => item.Id == id);
            if (department == null)
            {
                return DepartmentCommandResult<DepartmentDto>.NotFound("Department not found.");
            }

            var normalizedName = request.Name.Trim();
            var normalizedSlug = NormalizeSlug(request.Slug);
            var validationError = Validate(normalizedName, normalizedSlug);
            if (validationError != null)
            {
                return DepartmentCommandResult<DepartmentDto>.ValidationFailed(validationError);
            }

            var slugExists = await _context.Departments.AnyAsync(item => item.Id != id && item.Slug == normalizedSlug);
            if (slugExists)
            {
                return DepartmentCommandResult<DepartmentDto>.Conflict("Department slug must be unique.");
            }

            department.Name = normalizedName;
            department.Slug = normalizedSlug;
            await _context.SaveChangesAsync();

            var updatedDepartment = await GetByIdAsync(department.Id);
            return DepartmentCommandResult<DepartmentDto>.Success(updatedDepartment!);
        }

        public async Task<DepartmentCommandResult<bool>> DeleteAsync(int id)
        {
            var department = await _context.Departments
                .Include(item => item.Courses)
                .FirstOrDefaultAsync(item => item.Id == id);

            if (department == null)
            {
                return DepartmentCommandResult<bool>.NotFound("Department not found.");
            }

            if (department.Courses.Count > 0)
            {
                return DepartmentCommandResult<bool>.Conflict(
                    "Department cannot be deleted because courses are assigned to it.");
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return DepartmentCommandResult<bool>.Success(true);
        }

        private IQueryable<DepartmentDto> BuildDepartmentQuery()
        {
            return _context.Departments
                .AsNoTracking()
                .Select(department => new DepartmentDto
                {
                    Id = department.Id,
                    Name = department.Name,
                    Slug = department.Slug,
                    CourseCount = department.Courses.Count,
                    ResourceCount = department.Courses.SelectMany(course => course.Resources).Count(),
                });
        }

        private static string Validate(string name, string slug)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return "Department name is required.";
            }

            if (string.IsNullOrWhiteSpace(slug))
            {
                return "Department slug is required.";
            }

            return null;
        }

        private static string NormalizeSlug(string value)
        {
            var normalized = (value ?? string.Empty).Trim().ToLowerInvariant();
            var builder = new StringBuilder(normalized.Length);
            var previousWasDash = false;

            foreach (var character in normalized)
            {
                if (char.IsLetterOrDigit(character))
                {
                    builder.Append(character);
                    previousWasDash = false;
                    continue;
                }

                if (previousWasDash)
                {
                    continue;
                }

                builder.Append('-');
                previousWasDash = true;
            }

            return builder.ToString().Trim('-');
        }
    }
}
