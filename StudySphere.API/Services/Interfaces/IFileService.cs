
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace StudySphere.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file);
        Task DeleteFileAsync(string filePath);
    }
}
