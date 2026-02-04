using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudySphere.API.Context;
using StudySphere.API.DTOs;
using StudySphere.API.Models;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResult> RegisterAsync(string email, string password, string fullName)
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return new AuthResult { Success = false, Message = "Email already exists" };

            var user = new User
            {
                Email = email,
                FullName = fullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new AuthResult { Success = true };
        }

        public async Task<User> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;
            return user;
        }
    }
}
