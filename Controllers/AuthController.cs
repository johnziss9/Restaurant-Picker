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
            var user = _authRepo.Register(new User { Username = userDto.Username }, userDto.Password);

            if (user == null)
                return BadRequest();

            return Ok();
        }

        [HttpPost("Login")]
        public IActionResult Login(UserDto userDto)
        {
            var user = _authRepo.Login(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest();

            return Ok();
        }   
    }
}