using System.Collections.Generic;
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
        public ActionResult<List<Restaurant>> Get() => _restaurantService.Get();

        [HttpGet]
        public ActionResult<Restaurant> Get(string id)
        {
            var restaurant = _restaurantService.Get(id);

            if (restaurant == null)
                return NotFound();

            return restaurant;
        }

        [HttpPost]
        public ActionResult<Restaurant> Create(Restaurant restaurant)
        {
            _restaurantService.Create(restaurant);

            return CreatedAtRoute(new { id = restaurant.Id.ToString() }, restaurant);
        }

        [HttpPut]
        public IActionResult Update(string id, Restaurant restaurant)
        {
            var restaurantId = _restaurantService.Get(id);

            if (restaurantId == null)
                return NotFound();

            _restaurantService.Update(id, restaurant);

            return NoContent();
        }

        [HttpDelete]
        public IActionResult Delete(string id)
        {
            var restaurant = _restaurantService.Get(id);

            if (restaurant == null)
                return NotFound();

            _restaurantService.Remove(restaurant.Id);

            return NoContent();
        }

    }
}