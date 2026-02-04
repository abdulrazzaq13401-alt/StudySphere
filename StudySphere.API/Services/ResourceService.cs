// using System.Collections.Generic;
// using System.Threading.Tasks;
// using StudySphere.API.Services.Interfaces;
// using StudySphere.API.Context;
// public class ResourceService : IResourceService
// {
//     private readonly ApplicationDbContext _context;
//     private readonly IFileService _fileService;

//     public ResourceService(ApplicationDbContext context, IFileService fileService)
//     {
//         _context = context;
//         _fileService = fileService;
//     }

//     public async Task<List<ResourceDto>> SearchResourcesAsync(
//         int? semesterId,
//         int? courseId,
//         int? instructorId,
//         string resourceType
//     )
//     {
//         var query = _context
//             .Resources.Include(r => r.Course)
//                 .ThenInclude(c => c.Instructor)
//             .AsQueryable();

//         if (semesterId.HasValue)
//             query = query.Where(r => r.Course.SemesterId == semesterId);

//         if (courseId.HasValue)
//             query = query.Where(r => r.CourseId == courseId);

//         if (instructorId.HasValue)
//             query = query.Where(r => r.Course.InstructorId == instructorId);

//         if (!string.IsNullOrEmpty(resourceType))
//             query = query.Where(r => r.Type == resourceType);

//         return await query
//             .Select(r => new ResourceDto
//             {
//                 Id = r.Id,
//                 Title = r.Title,
//                 Description = r.Description,
//                 Type = r.Type,
//                 FileName = r.FileName,
//                 FileSize = r.FileSize,
//                 Downloads = r.Downloads,
//                 CourseName = r.Course.Title,
//                 InstructorName = r.Course.Instructor.FullName,
//                 CreatedAt = r.CreatedAt,
//             })
//             .ToListAsync();
//     }

//     public async Task<ResourceDto> GetResourceByIdAsync(int id)
//     {
//         var resource = await _context
//             .Resources.Include(r => r.Course)
//                 .ThenInclude(c => c.Instructor)
//             .FirstOrDefaultAsync(r => r.Id == id);

//         if (resource == null)
//             return null;

//         return new ResourceDto
//         {
//             Id = resource.Id,
//             Title = resource.Title,
//             Description = resource.Description,
//             Type = resource.Type,
//             FileName = resource.FileName,
//             FileSize = resource.FileSize,
//             Downloads = resource.Downloads,
//             CourseName = resource.Course.Title,
//             InstructorName = resource.Course.Instructor.FullName,
//             CreatedAt = resource.CreatedAt,
//         };
//     }

//     public async Task<int> CreateResourceAsync(CreateResourceRequest req, int userId)
//     {
//         var filePath = await _fileService.SaveFileAsync(req.File);

//         var resource = new Resource { Title = req.Title, Description = req.Description };

//         _context.Resources.Add(resource);
//         await _context.SaveChangesAsync();
//         return resource.Id;
//     }

//     public async Task<bool> DeleteResourceAsync(int id, int userId)
//     {
//         var resource = await _context.Resources.FindAsync(id);
//         if (resource == null || resource.UploadedBy != userId)
//             return false;

//         _context.Resources.Remove(resource);
//         await _fileService.DeleteFileAsync(resource.FilePath);
//         await _context.SaveChangesAsync();
//         return true;
//     }
// }