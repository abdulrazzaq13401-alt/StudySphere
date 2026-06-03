namespace StudySphere.API.DTOs
{
    public class StoredFileResult
    {
        public string RelativePath { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = "application/octet-stream";
        public long FileSize { get; set; }
    }
}
