using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Restaurant_Picker.Models;

namespace Restaurant_Picker.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IConfiguration _config;
        private readonly IMongoCollection<User> _users;

        public AuthRepository(IConfiguration config, IDatabaseSettings settings)
        {
            _config = config;

            var client = new MongoClient(Environment.GetEnvironmentVariable("ConnectionString"));
            var database = client.GetDatabase(settings.DatabaseName);
            
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public ServiceResponse<string> Login(string username, string password)
        {
            ServiceResponse<string> response = new ServiceResponse<string>();

            User user = _users.Find<User>(u => u.Username.ToLower() == username.ToLower()).FirstOrDefault();

            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found.";
            }
            else if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Wrong passwrod.";
            }
            else
                response.Data = CreateToken(user);
            
            return response;
        }

        public ServiceResponse<string> Register(User user, string password)
        {
            ServiceResponse<string> response = new ServiceResponse<string>();

            if (UserExist(user.Username))
            {
                response.Success = false;
                response.Message = "User already exists";

                return response;
            }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _users.InsertOne(user);

            return response;
        }

        public bool UserExist(string username)
        {
            if (_users.Find<User>(u => u.Username.ToLower() == username.ToLower()).Any())
                return true;

            return false;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }

                return true;
            }
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("Token")));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            
            return tokenHandler.WriteToken(token);
        }
    }
}