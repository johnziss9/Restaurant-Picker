using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Restaurant_Pick.Data;
using Restaurant_Pick.DTOs.Restaurant;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.Services.RestaurantService
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RestaurantService(IMapper mapper, DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _mapper = mapper;
        }

        private int GetUserId() => int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

        public async Task<ServiceResponse<List<GetRestaurantDTO>>> AddRestaurant(AddRestaurantDTO newRestaurant)
        {
            ServiceResponse<List<GetRestaurantDTO>> serviceResponse = new ServiceResponse<List<GetRestaurantDTO>>();

            if (await RestaurantExists(newRestaurant.Name))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Restaurant already exists.";

                return serviceResponse;
            }

            Restaurant restaurant = _mapper.Map<Restaurant>(newRestaurant);
            restaurant.AddedBy = await _context.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());
            await _context.Restaurants.AddAsync(restaurant);
            await _context.SaveChangesAsync();
            serviceResponse.Data = (_context.Restaurants.Select(c => _mapper.Map<GetRestaurantDTO>(c))).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetRestaurantDTO>>> GetAllNotVisitedRestaurants()
        {
            ServiceResponse<List<GetRestaurantDTO>> serviceResponse = new ServiceResponse<List<GetRestaurantDTO>>();
            List<Restaurant> dbRestaurants = await _context.Restaurants.Where(r => r.Visited == false).ToListAsync();
            serviceResponse.Data = (dbRestaurants.Select(c => _mapper.Map<GetRestaurantDTO>(c))).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetRestaurantDTO>>> GetAllVisitedRestaurants()
        {
            ServiceResponse<List<GetRestaurantDTO>> serviceResponse = new ServiceResponse<List<GetRestaurantDTO>>();
            List<Restaurant> dbRestaurants = await _context.Restaurants.Where(r => r.Visited == true).ToListAsync();
            serviceResponse.Data = (dbRestaurants.Select(c => _mapper.Map<GetRestaurantDTO>(c))).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetRestaurantDTO>>> GetUserRestaurants()
        {
            ServiceResponse<List<GetRestaurantDTO>> serviceResponse = new ServiceResponse<List<GetRestaurantDTO>>();
            List<Restaurant> dbRestaurants = await _context.Restaurants.Where(r => r.AddedBy.Id == GetUserId()).ToListAsync();
            serviceResponse.Data = (dbRestaurants.Select(c => _mapper.Map<GetRestaurantDTO>(c))).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetRestaurantDTO>> GetRestaurantById(int id)
        {
            ServiceResponse<GetRestaurantDTO> serviceResponse = new ServiceResponse<GetRestaurantDTO>();
            Restaurant dbRestaurant = await _context.Restaurants.FirstOrDefaultAsync(c => c.Id == id);
            serviceResponse.Data = _mapper.Map<GetRestaurantDTO>(dbRestaurant);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetRestaurantDTO>> GetRestaurantByVisitedDate()
        {
            ServiceResponse<GetRestaurantDTO> serviceResponse = new ServiceResponse<GetRestaurantDTO>();
            Restaurant dbRestaurant = await _context.Restaurants.FirstOrDefaultAsync(c => c.DateVisited >= DateTime.Now);
            serviceResponse.Data = _mapper.Map<GetRestaurantDTO>(dbRestaurant);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetRestaurantDTO>> UpdateRestaurant(UpdateRestaurantDTO updateRestaurant)
        {
            ServiceResponse<GetRestaurantDTO> serviceResponse = new ServiceResponse<GetRestaurantDTO>();

            try
            {
                Restaurant restaurant = await _context.Restaurants.FirstOrDefaultAsync(c => c.Id == updateRestaurant.Id);
                restaurant.Name = updateRestaurant.Name;
                restaurant.Cuisine = updateRestaurant.Cuisine;
                restaurant.Location = updateRestaurant.Location;
                restaurant.Visited = updateRestaurant.Visited;
                restaurant.Deleted = updateRestaurant.Deleted;
                restaurant.DateVisited = updateRestaurant.DateVisited;

                _context.Restaurants.Update(restaurant);
                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetRestaurantDTO>(restaurant);
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetRestaurantDTO>>> DeleteRestaurant(int id)
        {
            ServiceResponse<List<GetRestaurantDTO>> serviceResponse = new ServiceResponse<List<GetRestaurantDTO>>();

            try
            {
                Restaurant restaurant = await _context.Restaurants.FirstAsync(c => c.Id == id);
                _context.Restaurants.Remove(restaurant);

                await _context.SaveChangesAsync();

                serviceResponse.Data = (_context.Restaurants.Select(c => _mapper.Map<GetRestaurantDTO>(c))).ToList();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<CuisineClass>>> GetAllCuisines()
        {
            ServiceResponse<List<CuisineClass>> serviceResponse = new ServiceResponse<List<CuisineClass>>();
            List<string> cuisines = Enum.GetNames(typeof(CuisineClass)).ToList();
            serviceResponse.Data = (cuisines.Select(c => _mapper.Map<CuisineClass>(c))).ToList();
            return serviceResponse;
        }

        public async Task<bool> RestaurantExists(string restaurant)
        {
            if (await _context.Restaurants.AnyAsync(r => r.Name.ToLower() == restaurant.ToLower()))
                return true;

            return false;
        }
    }
}