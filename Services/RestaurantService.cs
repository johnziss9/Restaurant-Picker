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

        public List<Restaurant> Get() => _restaurants.Find(restaurant => true).ToList();

        public Restaurant Get(string id) => _restaurants.Find<Restaurant>(r => r.Id == id).FirstOrDefault();

        public Restaurant Create(Restaurant restaurant)
        {
            _restaurants.InsertOne(restaurant);
            return restaurant;
        }

        public void Update(string id, Restaurant restaurant) => _restaurants.ReplaceOne(r => r.Id == id, restaurant);

        public void Remove(Restaurant restaurant) => _restaurants.DeleteOne(r => r.Id == restaurant.Id);

        public void Remove(string id) => _restaurants.DeleteOne(r => r.Id == id);
    }
}