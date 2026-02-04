using System.Collections.Generic;

namespace StudySphere.API.Models
{
    public class Resource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<File> Files { get; set; }
    }
}
