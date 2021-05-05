using System;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.DTOs.Restaurant
{
    public class GetRestaurantDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Bodeans";
        public CuisineClass Cuisine { get; set; } = CuisineClass.American;
        public string Location { get; set; } = "Soho";
        public bool Visited { get; set; } = false;
        public DateTime DateVisited { get; set; } = DateTime.Now;

    }
}