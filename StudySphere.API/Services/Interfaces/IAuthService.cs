using System.Threading.Tasks;
using StudySphere.API.DTOs;
using StudySphere.API.Models;

namespace StudySphere.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(string email, string password, string fullName);
        Task<User> LoginAsync(string email, string password);
    }
}
