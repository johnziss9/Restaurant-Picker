using System;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.DTOs.Restaurant
{
    public class UpdateRestaurantDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Bodeans";
        public CuisineClass Cuisine { get; set; } = CuisineClass.American;
        public string Location { get; set; } = "Soho";
        public bool Visited { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public DateTime DateVisited { get; set; } = DateTime.Now;
    }
}