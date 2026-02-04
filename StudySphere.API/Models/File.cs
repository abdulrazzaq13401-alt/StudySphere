using System;

namespace StudySphere.API.Models
{
    public class File
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; } // e.g., ".pdf", ".docx"
        public long FileSize { get; set; }
        public string FilePath { get; set; }
        public string Url { get; set; }
        public int ResourceId { get; set; }
        public Resource Resource { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
