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

            var client = new MongoClient(_config["AppSettings:DatabaseSettings:ConnectionString"]);
            var database = client.GetDatabase(settings.DatabaseName);
            
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public string Login(string username, string password)
        {
            var user = _users.Find<User>(u => u.Username.ToLower() == username.ToLower()).FirstOrDefault();

            if (user == null)
                return null;
            else if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;
            else
                return CreateToken(user);
        }

        public string Register(User user, string password)
        {
            if (UserExist(user.Username))
                return "User already exists";

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _users.InsertOne(user);

            return user.Id;
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

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:AppSettings:Token"]));
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