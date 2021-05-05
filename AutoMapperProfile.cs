using AutoMapper;
using Restaurant_Pick.DTOs.Restaurant;
using Restaurant_Pick.Models;

namespace Restaurant_Pick
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Restaurant, GetRestaurantDTO>();
            CreateMap<AddRestaurantDTO, Restaurant>();
        }
    }
}