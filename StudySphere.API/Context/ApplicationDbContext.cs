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

            modelBuilder.Entity<Course>(entity =>
            {
                entity.Property(course => course.Code).IsRequired().HasMaxLength(50);
                entity.Property(course => course.Title).IsRequired().HasMaxLength(200);
                entity.HasOne(course => course.Department)
                    .WithMany(department => department.Courses)
                    .HasForeignKey(course => course.DepartmentId);
                entity.HasOne(course => course.Instructor)
                    .WithMany()
                    .HasForeignKey(course => course.InstructorId);
                entity.HasOne(course => course.Semester)
                    .WithMany(semester => semester.Courses)
                    .HasForeignKey(course => course.SemesterId)
                    .IsRequired(false);
            });

            modelBuilder.Entity<Resource>(entity =>
            {
                entity.Property(resource => resource.Title).IsRequired().HasMaxLength(250);
                entity.Property(resource => resource.Description).HasMaxLength(2000);
                entity.Property(resource => resource.OriginalFileName).IsRequired().HasMaxLength(260);
                entity.Property(resource => resource.StoredFileName).IsRequired().HasMaxLength(200);
                entity.Property(resource => resource.StoredFilePath).IsRequired().HasMaxLength(400);
                entity.Property(resource => resource.ContentType).IsRequired().HasMaxLength(150);
                entity.Property(resource => resource.ResourceType).HasConversion<int>();
                entity.HasOne(resource => resource.Course)
                    .WithMany(course => course.Resources)
                    .HasForeignKey(resource => resource.CourseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
