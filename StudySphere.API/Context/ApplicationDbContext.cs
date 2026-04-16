using Microsoft.EntityFrameworkCore;
using StudySphere.API.Models;

namespace StudySphere.API.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Department> Departments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("Department");
                entity.Property(department => department.Name).IsRequired().HasMaxLength(200);
                entity.Property(department => department.Slug).IsRequired().HasMaxLength(200);
                entity.HasIndex(department => department.Slug).IsUnique();
            });
        }
    }
}
