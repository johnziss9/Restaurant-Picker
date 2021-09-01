namespace Restaurant_Picker.Models
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string RestaurantsCollectionName { get; set; }
        public string UsersCollectionName { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IDatabaseSettings
    {
        string RestaurantsCollectionName { get; set; }
        string UsersCollectionName { get; set; }
        string DatabaseName { get; set; }
    }
}