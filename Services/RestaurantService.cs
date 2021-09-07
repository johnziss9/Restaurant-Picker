using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Restaurant_Picker.Models;

namespace Restaurant_Picker.Services
{
    public class RestaurantService
    {
        private readonly IConfiguration _config;
        private readonly IMongoCollection<Restaurant> _restaurants;

        public RestaurantService(IConfiguration config, IDatabaseSettings settings)
        {
            _config = config;

            var client = new MongoClient(_config["AppSettings:DatabaseSettings:ConnectionString"]);
            var database = client.GetDatabase(settings.DatabaseName);

            _restaurants = database.GetCollection<Restaurant>(settings.RestaurantsCollectionName);
        }

        public ServiceResponse<List<Restaurant>> Get() 
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();
            List<Restaurant> restaurants = _restaurants.Find(restaurant => true).ToList();
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

        public ServiceResponse<List<Restaurant>> Create(Restaurant restaurant)
        {
            ServiceResponse<List<Restaurant>> serviceResponse = new ServiceResponse<List<Restaurant>>();

            //         if (await RestaurantExists(newRestaurant.Name))
            //         {
            //             serviceResponse.Success = false;
            //             serviceResponse.Message = "Restaurant already exists.";

            //             return serviceResponse;
            //         }

            // List<Restaurant> restaurants = 
            _restaurants.InsertOne(restaurant);
            List<Restaurant> restaurants = _restaurants.Find(restaurant => true).ToList();

            //         restaurant.AddedBy = await _context.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());

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
            catch(Exception ex)
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
    }
}