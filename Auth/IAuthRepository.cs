using Restaurant_Picker.Models;

namespace Restaurant_Picker.Auth
{
    public interface IAuthRepository
    {
        string Register(User user, string password);
        string Login(string username, string password);
        bool UserExist(string username);
    }
}