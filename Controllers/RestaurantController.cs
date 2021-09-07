using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_Picker.Models;
using Restaurant_Picker.Services;

namespace Restaurant_Picker.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
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

        [HttpGet("{id}")]
        public ActionResult Get(string id)
        {
            return Ok(_restaurantService.Get(id));
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

    }
}