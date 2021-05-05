using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Restaurant_Pick.DTOs.Restaurant;
using Restaurant_Pick.Models;
using Restaurant_Pick.Services.RestaurantService;

namespace Restaurant_Pick.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAll")]
    public class RestaurantController : Controller
    {
        private readonly IRestaurantService _restaurantService;
        public RestaurantController(IRestaurantService restaurantService)
        {
            this._restaurantService = restaurantService;
        }

        [HttpGet("GetNotVisited")]
        public async Task<IActionResult> GetUnvisited()
        {
            return Ok(await _restaurantService.GetAllNotVisitedRestaurants());
        }

        [HttpGet("GetVisited")]
        public async Task<IActionResult> GetVisited()
        {
            return Ok(await _restaurantService.GetAllVisitedRestaurants());
        }

        [HttpGet("GetUserRestaurants")]
        public async Task<IActionResult> GetUserRestaurants()
        {
            return Ok(await _restaurantService.GetUserRestaurants());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSingle(int id)
        {
            return Ok(await _restaurantService.GetRestaurantById(id));
        }

        [HttpGet("GetVisitedSingle")]
        public async Task<IActionResult> GetVisitedSingle()
        {
            return Ok(await _restaurantService.GetRestaurantByVisitedDate());
        }

        [HttpPost]
        public async Task<IActionResult> AddRestaurant(AddRestaurantDTO newRestaurant)
        {
            return Ok(await _restaurantService.AddRestaurant(newRestaurant));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRestaurant(UpdateRestaurantDTO updateRestaurant)
        {
            ServiceResponse<GetRestaurantDTO> response = await _restaurantService.UpdateRestaurant(updateRestaurant);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            ServiceResponse<List<GetRestaurantDTO>> response = await _restaurantService.DeleteRestaurant(id);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpGet("GetAllCuisines")]
        public async Task<IActionResult> GetCuisines()
        {
            return Ok(await _restaurantService.GetAllCuisines());
        }
    }
}