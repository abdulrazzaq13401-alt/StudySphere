using System;
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
    public class ResourceService : IResourceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileService _fileService;

        public ResourceService(ApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IReadOnlyList<ResourceDto>> GetAllAsync(
            int? departmentId,
            int? courseId,
            string name,
            ResourceType? resourceType,
            string departmentSlug,
            string courseCode)
        {
            var query = _context.Resources
                .AsNoTracking()
                .Include(resource => resource.Course)
                    .ThenInclude(course => course.Department)
                .AsQueryable();

            if (departmentId.HasValue)
            {
                query = query.Where(resource =>
                    resource.Course != null && resource.Course.DepartmentId == departmentId.Value);
            }

            if (courseId.HasValue)
            {
                query = query.Where(resource => resource.CourseId == courseId.Value);
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                var normalizedName = name.Trim().ToLowerInvariant();
                query = query.Where(resource => resource.Title.ToLower().Contains(normalizedName));
            }

            if (resourceType.HasValue)
            {
                query = query.Where(resource => resource.ResourceType == resourceType.Value);
            }

            if (!string.IsNullOrWhiteSpace(departmentSlug))
            {
                var normalizedSlug = departmentSlug.Trim().ToLowerInvariant();
                query = query.Where(resource =>
                    resource.Course != null &&
                    resource.Course.Department != null &&
                    resource.Course.Department.Slug.ToLower() == normalizedSlug);
            }

            if (!string.IsNullOrWhiteSpace(courseCode))
            {
                var normalizedCourseCode = NormalizeCourseCode(courseCode);
                query = query.Where(resource =>
                    resource.Course != null &&
                    resource.Course.Code.ToLower().Replace(" ", string.Empty).Replace("-", string.Empty) == normalizedCourseCode);
            }

            var entities = await query
                .OrderByDescending(resource => resource.CreatedAt)
                .ToListAsync();

            return entities.Select(MapToResourceDto).ToList();
        }

        public async Task<ResourceDto> GetResourceByIdAsync(int id)
        {
            var entity = await _context.Resources
                .AsNoTracking()
                .Include(resource => resource.Course)
                    .ThenInclude(course => course.Department)
                .Where(resource => resource.Id == id)
                .FirstOrDefaultAsync();

            return entity == null ? null : MapToResourceDto(entity);
        }

        public async Task<ResourceLookupDto> GetLookupDataAsync()
        {
            var departments = await _context.Departments
                .AsNoTracking()
                .OrderBy(department => department.Name)
                .Select(department => new ResourceDepartmentLookupDto
                {
                    Id = department.Id,
                    Name = department.Name,
                })
                .ToListAsync();

            var courses = await _context.Courses
                .AsNoTracking()
                .OrderBy(course => course.Department.Name)
                .ThenBy(course => course.Code)
                .Select(course => new ResourceCourseLookupDto
                {
                    Id = course.Id,
                    Code = course.Code,
                    Title = course.Title,
                    DepartmentId = course.DepartmentId,
                    DepartmentName = course.Department.Name,
                })
                .ToListAsync();

            return new ResourceLookupDto
            {
                Departments = departments,
                Courses = courses,
            };
        }

        public async Task<DepartmentCommandResult<ResourceDto>> CreateAsync(CreateResourceRequest request)
        {
            var title = request.Title.Trim();
            var description = (request.Description ?? string.Empty).Trim();
            var validationError = await ValidateAsync(title, request.CourseId, request.File);
            if (validationError != null)
            {
                return DepartmentCommandResult<ResourceDto>.ValidationFailed(validationError);
            }

            var savedFile = await _fileService.SaveFileAsync(request.File);

            try
            {
                var resource = new Resource
                {
                    Title = title,
                    Description = description,
                    ResourceType = request.ResourceType,
                    CourseId = request.CourseId,
                    OriginalFileName = savedFile.OriginalFileName,
                    StoredFileName = savedFile.StoredFileName,
                    StoredFilePath = savedFile.RelativePath,
                    ContentType = savedFile.ContentType,
                    FileSize = savedFile.FileSize,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                _context.Resources.Add(resource);
                await _context.SaveChangesAsync();

                var createdResource = await GetResourceByIdAsync(resource.Id);
                return DepartmentCommandResult<ResourceDto>.Success(createdResource!);
            }
            catch
            {
                await _fileService.DeleteFileAsync(savedFile.RelativePath);
                throw;
            }
        }

        public async Task<DepartmentCommandResult<ResourceDto>> UpdateAsync(int id, UpdateResourceRequest request)
        {
            var resource = await _context.Resources.FirstOrDefaultAsync(item => item.Id == id);
            if (resource == null)
            {
                return DepartmentCommandResult<ResourceDto>.NotFound("Resource not found.");
            }

            var title = request.Title.Trim();
            var description = (request.Description ?? string.Empty).Trim();
            var validationError = await ValidateAsync(title, request.CourseId, request.File, requireFile: false);
            if (validationError != null)
            {
                return DepartmentCommandResult<ResourceDto>.ValidationFailed(validationError);
            }

            string previousStoredFilePath = null;
            StoredFileResult replacementFile = null;

            if (request.File != null)
            {
                replacementFile = await _fileService.SaveFileAsync(request.File);
                previousStoredFilePath = resource.StoredFilePath;
            }

            try
            {
                resource.Title = title;
                resource.Description = description;
                resource.ResourceType = request.ResourceType;
                resource.CourseId = request.CourseId;
                resource.UpdatedAt = DateTime.UtcNow;

                if (replacementFile != null)
                {
                    resource.OriginalFileName = replacementFile.OriginalFileName;
                    resource.StoredFileName = replacementFile.StoredFileName;
                    resource.StoredFilePath = replacementFile.RelativePath;
                    resource.ContentType = replacementFile.ContentType;
                    resource.FileSize = replacementFile.FileSize;
                }

                await _context.SaveChangesAsync();

                if (!string.IsNullOrWhiteSpace(previousStoredFilePath))
                {
                    await _fileService.DeleteFileAsync(previousStoredFilePath);
                }

                var updatedResource = await GetResourceByIdAsync(resource.Id);
                return DepartmentCommandResult<ResourceDto>.Success(updatedResource!);
            }
            catch
            {
                if (replacementFile != null)
                {
                    await _fileService.DeleteFileAsync(replacementFile.RelativePath);
                }

                throw;
            }
        }

        public async Task<DepartmentCommandResult<bool>> DeleteAsync(int id)
        {
            var resource = await _context.Resources.FirstOrDefaultAsync(item => item.Id == id);
            if (resource == null)
            {
                return DepartmentCommandResult<bool>.NotFound("Resource not found.");
            }

            var storedFilePath = resource.StoredFilePath;

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            await _fileService.DeleteFileAsync(storedFilePath);
            return DepartmentCommandResult<bool>.Success(true);
        }

        public async Task<ResourceFileDto> GetDownloadFileAsync(int id)
        {
            var resource = await _context.Resources.FirstOrDefaultAsync(item => item.Id == id);
            if (resource == null)
            {
                return null;
            }

            if (!_fileService.FileExists(resource.StoredFilePath))
            {
                return null;
            }

            resource.Downloads += 1;
            await _context.SaveChangesAsync();

            return new ResourceFileDto
            {
                RelativePath = resource.StoredFilePath,
                FileName = resource.OriginalFileName,
                ContentType = resource.ContentType,
            };
        }

        private static ResourceDto MapToResourceDto(Resource resource)
        {
            return new ResourceDto
            {
                Id = resource.Id,
                Title = resource.Title,
                Description = resource.Description,
                ResourceType = resource.ResourceType,
                ResourceTypeLabel = resource.ResourceType == ResourceType.PastPaper ? "Past Paper" : "Document",
                CourseId = resource.CourseId ?? 0,
                CourseCode = resource.Course != null ? resource.Course.Code : string.Empty,
                CourseTitle = resource.Course != null ? resource.Course.Title : string.Empty,
                DepartmentId = resource.Course != null ? resource.Course.DepartmentId : 0,
                DepartmentName = resource.Course != null ? resource.Course.Department.Name : string.Empty,
                DepartmentSlug = resource.Course != null ? resource.Course.Department.Slug : string.Empty,
                FileName = resource.OriginalFileName,
                ContentType = resource.ContentType,
                FileSize = resource.FileSize,
                Downloads = resource.Downloads,
                CreatedAt = resource.CreatedAt,
                DownloadUrl = $"/api/resources/{resource.Id}/download",
            };
        }

        private async Task<string> ValidateAsync(
            string title,
            int courseId,
            Microsoft.AspNetCore.Http.IFormFile file,
            bool requireFile = true)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return "Resource title is required.";
            }

            if (requireFile && file == null)
            {
                return "File is required.";
            }

            var courseExists = await _context.Courses.AnyAsync(course => course.Id == courseId);
            if (!courseExists)
            {
                return "Selected course does not exist.";
            }

            return null;
        }

        private static string NormalizeCourseCode(string value)
        {
            return (value ?? string.Empty)
                .Trim()
                .ToLowerInvariant()
                .Replace(" ", string.Empty)
                .Replace("-", string.Empty);
        }
    }
}
