using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest req)
        {
            var result = await _authService.RegisterAsync(req.Email, req.Password, req.FullName);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("admin/login")]
        public async Task<ActionResult> AdminLogin([FromBody] LoginRequest req)
        {
            var user = await _authService.LoginAsync(req.Email, req.Password);
            if (user == null || user.Role != "Admin")
                return Unauthorized(new { message = "Invalid admin credentials" });

            return Ok(
                new
                {
                    message = "Admin login successful",
                    user = new { user.Id, user.Email, user.FullName, user.Role }
                });
        }
    }
}
