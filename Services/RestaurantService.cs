using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Restaurant_Picker.Models;

namespace Restaurant_Picker.Services
{
    public class RestaurantService
    {
        private readonly IConfiguration _config;
        private readonly IMongoCollection<Restaurant> _restaurants;
        private readonly IMongoCollection<User> _users;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RestaurantService(IConfiguration config, IDatabaseSettings settings, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _config = config;

            var client = new MongoClient(Environment.GetEnvironmentVariable("ConnectionString"));
            var database = client.GetDatabase(settings.DatabaseName);

            _restaurants = database.GetCollection<Restaurant>(settings.RestaurantsCollectionName);
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public ServiceResponse<List<Restaurant>> Get()
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();
            List<Restaurant> restaurants = _restaurants.Find(restaurant => true).ToList();
            serviceResponse.Data = restaurants;
            return serviceResponse;
        }

        public ServiceResponse<List<Restaurant>> GetVisited()
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();
            List<Restaurant> restaurants = _restaurants.Find<Restaurant>(r => r.Visited == true).ToList();
            serviceResponse.Data = restaurants;
            return serviceResponse;
        }

        public ServiceResponse<List<Restaurant>> GetNotVisited()
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();
            List<Restaurant> restaurants = _restaurants.Find<Restaurant>(r => r.Visited == false).ToList();
            serviceResponse.Data = restaurants;
            return serviceResponse;
        }

        public ServiceResponse<List<Restaurant>> GetUserRestaurants()
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();
            List<Restaurant> restaurants = _restaurants.Find<Restaurant>(r => r.AddedBy.Id == GetUserId()).ToList();
            serviceResponse.Data = restaurants;
            return serviceResponse;
        }

        public ServiceResponse<Restaurant> Get(string id)
        {
            ServiceResponse<Restaurant> serviceResponse = new ServiceResponse<Restaurant>();
            Restaurant restaurant = _restaurants.Find<Restaurant>(r => r.Id == id).FirstOrDefault();
            serviceResponse.Data = restaurant;
            return serviceResponse;
        }

        public ServiceResponse<Restaurant> GetRestaurantByDate()
        {
            ServiceResponse<Restaurant> serviceResponse = new ServiceResponse<Restaurant>();
            Restaurant restaurant = _restaurants.Find<Restaurant>(r => r.VisitedOn.AddHours(23).AddMinutes(59).AddSeconds(59) >= DateTime.Now).FirstOrDefault();
            serviceResponse.Data = restaurant;
            return serviceResponse;
        }

        public ServiceResponse<List<Restaurant>> Create(Restaurant restaurant)
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();

            //         if (await RestaurantExists(newRestaurant.Name))
            //         {
            //             serviceResponse.Success = false;
            //             serviceResponse.Message = "Restaurant already exists.";

            //             return serviceResponse;
            //         }
            restaurant.AddedBy = _users.Find<User>(u => u.Id == GetUserId()).FirstOrDefault();
            _restaurants.InsertOne(restaurant);
            List<Restaurant> restaurants = _restaurants.Find(restaurant => true).ToList();
            serviceResponse.Data = restaurants;

            return serviceResponse;
        }

        public ServiceResponse<Restaurant> Update(string id, Restaurant updatedRestaurant)
        {
            ServiceResponse<Restaurant> serviceResponse = new ServiceResponse<Restaurant>();

            try
            {
                _restaurants.ReplaceOne(r => r.Id == id, updatedRestaurant);
                Restaurant restaurant = _restaurants.Find<Restaurant>(r => r.Id == id).FirstOrDefault();
                serviceResponse.Data = restaurant;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public ServiceResponse<List<Restaurant>> Remove(string id)
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();

            try
            {
                _restaurants.DeleteOne(r => r.Id == id);
                List<Restaurant> restaurants = _restaurants.Find(restaurant => true).ToList();
                serviceResponse.Data = restaurants;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public ServiceResponse<List<Cuisine>> GetCuisines()
        {
            ServiceResponse<List<Cuisine>> serviceResponse = new ServiceResponse<List<Cuisine>>();
            List<string> cuisines = Enum.GetNames(typeof(Cuisine)).ToList();
            serviceResponse.Data = (cuisines.Select(c => _mapper.Map<Cuisine>(c))).ToList();
            return serviceResponse;
        }

        private string GetUserId() => _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}