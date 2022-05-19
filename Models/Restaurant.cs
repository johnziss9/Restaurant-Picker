using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Restaurant_Picker.Models

{
    public class Restaurant
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public Cuisine Cuisine { get; set; }
        public string Location { get; set; }
        public bool Visited { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public User AddedBy { get; set; }
        public DateTime AddedOn { get; set; } = DateTime.Now;
        public DateTime VisitedOn { get; set; } = DateTime.MinValue;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}