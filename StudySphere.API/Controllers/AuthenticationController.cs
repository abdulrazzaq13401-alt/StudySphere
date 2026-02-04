using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using StudySphere.API.DTOs;
using StudySphere.API.Services.Interfaces;

namespace StudySphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _config;

        public AuthController(IAuthService authService, IConfiguration config)
        {
            _authService = authService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest req)
        {
            var result = await _authService.RegisterAsync(req.Email, req.Password, req.FullName);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = "Registration successful" });
        }

    // [HttpPost("login")]
    // public async Task<ActionResult> Login([FromBody] LoginRequest req)
    // {
    //     var user = await _authService.LoginAsync(req.Email, req.Password);
    //     if (user == null)
    //         return Unauthorized(new { message = "Invalid credentials" });

    //     var token = GenerateToken(user);
    //     return Ok(new { token, user = new { user.Id, user.Email, user.FullName } });
    // }

    // private string GenerateToken(User user)
    // {
    //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
    //     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    //     var claims = new[]
    //     {
    //         new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    //         new Claim(ClaimTypes.Email, user.Email),
    //         new Claim(ClaimTypes.Name, user.FullName)
    //     };

    //     var token = new JwtSecurityToken(
    //         issuer: _config["Jwt:Issuer"],
    //         audience: _config["Jwt:Audience"],
    //         claims: claims,
    //         expires: DateTime.UtcNow.AddDays(7),
    //         signingCredentials: creds
    //     );

    //     return new JwtSecurityTokenHandler().WriteToken(token);
    // }
    }
}
