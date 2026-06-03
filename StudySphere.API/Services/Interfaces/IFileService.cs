using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StudySphere.API.DTOs;

namespace StudySphere.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<StoredFileResult> SaveFileAsync(IFormFile file);
        Task DeleteFileAsync(string relativePath);
        bool FileExists(string relativePath);
        Stream OpenRead(string relativePath);
    }
}
