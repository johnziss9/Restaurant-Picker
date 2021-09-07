using Microsoft.AspNetCore.Mvc;
using Restaurant_Picker.Auth;
using Restaurant_Picker.Dtos;
using Restaurant_Picker.Models;

namespace Restaurant_Picker.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;

        public AuthController(IAuthRepository authRepo)
        {
            _authRepo = authRepo;
        }

        [HttpPost("Register")]
        public IActionResult Register(UserDto userDto)
        {
            ServiceResponse<string> response = _authRepo.Register(new User { Username = userDto.Username }, userDto.Password);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("Login")]
        public IActionResult Login(UserDto userDto)
        {
            ServiceResponse<string> response = _authRepo.Login(userDto.Username, userDto.Password);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}