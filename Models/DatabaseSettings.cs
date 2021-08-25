namespace Restaurant_Picker.Models
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string RestaurantsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IDatabaseSettings
    {
        public string RestaurantsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}