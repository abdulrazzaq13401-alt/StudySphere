using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StudySphere.API.Context;
using StudySphere.API.Models;

namespace StudySphere.API.Startup
{
    public static class DatabaseInitializationExtensions
    {
        private const string DefaultAdminEmail = "admin@studysphere.com";
        private const string DefaultAdminPassword = "test@123";
        private const string DefaultInstructorEmail = "instructor@studysphere.com";
        private static readonly string[] SeedDepartmentNames =
        [
            "Computer Science",
            "Engineering",
            "Business Administration",
            "Liberal Arts",
            "Medicine",
            "Law",
            "Education",
            "Psychology",
            "Pharmacy",
            "Nursing",
            "Architecture",
            "Environmental Science",
            "Physical Therapy",
            "Economics",
            "Political Science",
            "Sociology",
            "History",
            "Mathematics",
            "English",
            "Emergency Care",
            "Pakistan Studies",
            "Islamic Studies",
            "Microbiology",
            "Biochemistry",
        ];
        private static readonly (string Name, DateTime StartDate, DateTime EndDate)[] SeedSemesters =
        [
            ("Spring 2026", new DateTime(2026, 1, 12), new DateTime(2026, 5, 31)),
            ("Summer 2026", new DateTime(2026, 6, 8), new DateTime(2026, 8, 20)),
            ("Fall 2026", new DateTime(2026, 9, 1), new DateTime(2026, 12, 20)),
        ];

        public static async Task InitializeDatabaseAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await context.Database.MigrateAsync();
            await SeedDepartmentsAsync(context);
            await SeedSemestersAsync(context);
            await SeedInstructorAsync(context);

            var adminExists = await context.Users.AnyAsync(
                u => u.Email != null && u.Email.ToLower() == DefaultAdminEmail);
            if (adminExists)
            {
                if (context.ChangeTracker.HasChanges())
                {
                    await context.SaveChangesAsync();
                }

                return;
            }

            var adminUser = new User
            {
                Email = DefaultAdminEmail,
                FullName = "StudySphere Admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultAdminPassword),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        private static async Task SeedInstructorAsync(ApplicationDbContext context)
        {
            var instructorExists = await context.Users.AnyAsync(
                user => user.Email != null && user.Email.ToLower() == DefaultInstructorEmail);

            if (instructorExists)
            {
                return;
            }

            context.Users.Add(new User
            {
                Email = DefaultInstructorEmail,
                FullName = "StudySphere Instructor",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultAdminPassword),
                Role = "Instructor",
                CreatedAt = DateTime.UtcNow,
            });
        }

        private static async Task SeedDepartmentsAsync(ApplicationDbContext context)
        {
            var departmentExists = await context.Departments.AnyAsync();
            if (departmentExists)
            {
                return;
            }

            foreach (var departmentName in SeedDepartmentNames)
            {
                context.Departments.Add(new Department
                {
                    Name = departmentName,
                    Slug = ToSlug(departmentName),
                });
            }
        }

        private static async Task SeedSemestersAsync(ApplicationDbContext context)
        {
            var semestersExist = await context.Semesters.AnyAsync();
            if (semestersExist)
            {
                return;
            }

            foreach (var semester in SeedSemesters)
            {
                context.Semesters.Add(new Semester
                {
                    Name = semester.Name,
                    StartDate = semester.StartDate,
                    EndDate = semester.EndDate,
                });
            }
        }

        private static string ToSlug(string value)
        {
            var normalized = value.Trim().ToLowerInvariant();
            var buffer = new System.Text.StringBuilder(normalized.Length);
            var previousWasDash = false;

            foreach (var character in normalized)
            {
                if (char.IsLetterOrDigit(character))
                {
                    buffer.Append(character);
                    previousWasDash = false;
                    continue;
                }

                if (previousWasDash)
                {
                    continue;
                }

                buffer.Append('-');
                previousWasDash = true;
            }

            return buffer.ToString().Trim('-');
        }
    }
}
