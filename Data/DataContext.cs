using Microsoft.EntityFrameworkCore;
using Restaurant_Pick.Models;

namespace Restaurant_Pick.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<User> Users { get; set; }
    }
}