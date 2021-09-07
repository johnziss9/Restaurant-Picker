using Restaurant_Picker.Models;

namespace Restaurant_Picker.Auth
{
    public interface IAuthRepository
    {
        ServiceResponse<string> Register(User user, string password);
        ServiceResponse<string> Login(string username, string password);
        bool UserExist(string username);
    }
}