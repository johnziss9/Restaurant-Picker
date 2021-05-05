using System.Collections.Generic;
using System.Threading.Tasks;
using Restaurant_Pick.DTOs.Restaurant;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.Services.RestaurantService
{
    public interface IRestaurantService
    {
         Task<ServiceResponse<List<GetRestaurantDTO>>> GetAllNotVisitedRestaurants();
         Task<ServiceResponse<List<GetRestaurantDTO>>> GetAllVisitedRestaurants();
         Task<ServiceResponse<List<GetRestaurantDTO>>> GetUserRestaurants();
         Task<ServiceResponse<GetRestaurantDTO>> GetRestaurantById(int id);
         Task<ServiceResponse<GetRestaurantDTO>> GetRestaurantByVisitedDate();
         Task<ServiceResponse<List<GetRestaurantDTO>>> AddRestaurant(AddRestaurantDTO newRestaurant);
         Task<ServiceResponse<GetRestaurantDTO>> UpdateRestaurant(UpdateRestaurantDTO updateRestaurant);
         Task<ServiceResponse<List<GetRestaurantDTO>>> DeleteRestaurant(int id);
         Task<ServiceResponse<List<CuisineClass>>> GetAllCuisines();
         Task<bool> RestaurantExists(string restaurant);
    }
}