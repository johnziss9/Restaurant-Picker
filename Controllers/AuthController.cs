using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Restaurant_Pick.Data;
using Restaurant_Pick.DTOs.User;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAll")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;
        public AuthController(IAuthRepository authRepo)
        {
            _authRepo = authRepo;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegisterDTO request)
        {
            ServiceResponse<int> response = await _authRepo.Register(new User { Username = request.Username }, request.Password);
                
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDTO request)
        {
            ServiceResponse<string> response = await _authRepo.Login(request.Username, request.Password);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}