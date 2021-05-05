using System.Collections.Generic;

namespace Restaurant_Pick.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        List<Restaurant> Restaurants { get; set; }
    }
}