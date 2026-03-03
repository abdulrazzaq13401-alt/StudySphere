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

        public static async Task InitializeDatabaseAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await context.Database.MigrateAsync();

            var adminExists = await context.Users.AnyAsync(
                u => u.Email != null && u.Email.ToLower() == DefaultAdminEmail);
            if (adminExists)
            {
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
    }
}
