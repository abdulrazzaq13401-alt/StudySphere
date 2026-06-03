using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Services
{
    public class LocalFileService : IFileService
    {
        private readonly string _storageRoot;

        public LocalFileService(IWebHostEnvironment environment)
        {
            _storageRoot = Path.Combine(environment.ContentRootPath, "Storage", "resources");
            Directory.CreateDirectory(_storageRoot);
        }

        public async Task<StoredFileResult> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new InvalidOperationException("File is required.");
            }

            var extension = Path.GetExtension(file.FileName);
            var storedFileName = $"{Guid.NewGuid():N}{extension}";
            var relativeFolder = Path.Combine(DateTime.UtcNow.ToString("yyyy"), DateTime.UtcNow.ToString("MM"));
            var relativePath = Path.Combine(relativeFolder, storedFileName).Replace("\\", "/");
            var absoluteFolder = Path.Combine(_storageRoot, relativeFolder);
            var absolutePath = Path.Combine(absoluteFolder, storedFileName);

            Directory.CreateDirectory(absoluteFolder);

            await using var stream = new FileStream(absolutePath, FileMode.CreateNew, FileAccess.Write);
            await file.CopyToAsync(stream);

            return new StoredFileResult
            {
                RelativePath = relativePath,
                StoredFileName = storedFileName,
                OriginalFileName = file.FileName ?? storedFileName,
                ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                    ? "application/octet-stream"
                    : file.ContentType,
                FileSize = file.Length,
            };
        }

        public Task DeleteFileAsync(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
            {
                return Task.CompletedTask;
            }

            var absolutePath = GetAbsolutePath(relativePath);
            if (File.Exists(absolutePath))
            {
                File.Delete(absolutePath);
            }

            return Task.CompletedTask;
        }

        public bool FileExists(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
            {
                return false;
            }

            return File.Exists(GetAbsolutePath(relativePath));
        }

        public Stream OpenRead(string relativePath)
        {
            var absolutePath = GetAbsolutePath(relativePath);
            return new FileStream(absolutePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        }

        private string GetAbsolutePath(string relativePath)
        {
            var safePath = (relativePath ?? string.Empty).Replace('/', Path.DirectorySeparatorChar);
            return Path.Combine(_storageRoot, safePath);
        }
    }
}
