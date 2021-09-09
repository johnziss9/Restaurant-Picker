using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Restaurant_Picker.Models;
using Restaurant_Picker.Services;

namespace Restaurant_Picker.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    [EnableCors("AllowAll")]
    public class RestaurantController : ControllerBase
    {
        private readonly RestaurantService _restaurantService;

        public RestaurantController(RestaurantService restaurantService)
        {
            _restaurantService = restaurantService;
        }

        [HttpGet("GetAll")]
        public ActionResult Get()
        {
            return Ok(_restaurantService.Get());
        }

        [HttpGet("GetVisited")]
        public ActionResult GetVisited()
        {
            return Ok(_restaurantService.GetVisited());
        }

        [HttpGet("GetNotVisited")]
        public ActionResult GetNotVisited()
        {
            return Ok(_restaurantService.GetNotVisited());
        }

        [HttpGet("GetUserRestaurants")]
        public ActionResult GetUserRestaurants()
        {
            return Ok(_restaurantService.GetUserRestaurants());
        }

        [HttpGet("{id}")]
        public ActionResult Get(string id)
        {
            return Ok(_restaurantService.Get(id));
        }

        [HttpGet("GetRestaurantByDate")]
        public IActionResult GetRestaurantByDate()
        {
            return Ok(_restaurantService.GetRestaurantByDate());
        }

        [HttpPost]
        public ActionResult Create(Restaurant restaurant)
        {
            var response = _restaurantService.Create(restaurant);

            CreatedAtRoute(new { id = restaurant.Id.ToString() }, response.Data.LastOrDefault());

            return Ok(response);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, Restaurant restaurant)
        {
            var restaurantId = _restaurantService.Get(id);

            ServiceResponse<Restaurant> response = _restaurantService.Update(id, restaurant);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var restaurant = _restaurantService.Get(id);

            ServiceResponse<List<Restaurant>> response = _restaurantService.Remove(id);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpGet("GetCuisines")]
        public IActionResult GetCuisines()
        {
            return Ok(_restaurantService.GetCuisines());
        }
    }
}