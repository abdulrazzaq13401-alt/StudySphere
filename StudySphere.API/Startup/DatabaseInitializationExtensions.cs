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

        public static async Task InitializeDatabaseAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await context.Database.MigrateAsync();
            await SeedDepartmentsAsync(context);

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
