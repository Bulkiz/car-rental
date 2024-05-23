using System.ComponentModel.DataAnnotations.Schema;

namespace car_rental.Server.Models
{
    public class Car
    {
        public int Id { get; set; }

        [Column("make")]
        public string? Make { get; set; }

        [Column("model")]
        public string? Model { get; set; }

        [Column("engine_type")]
        public string? EngineType { get; set; }

        [Column("transmission_type")]
        public string? TransmissionType { get; set; }

        [Column("seats")]
        public int Seats { get; set; }

        [Column("doors")]
        public int Doors { get; set; }

        [Column("air_conditioner")]
        public bool AirConditioner { get; set; }

        [Column("user_owner_id")]
        public int UserOwnerId { get; set; }

        [Column("is_removed")]
        public bool IsRemoved { get; set; }

        [Column("price_per_day")]
        public decimal PricePerDay { get; set; }

        [Column("location")]
        public string? Location { get; set; }

        [Column("picture")]
        public byte[]? Picture { get; set; }

        [Column("insert_date")]
        public DateOnly InsertDate { get; set; }

        [Column("last_modification_date_20118084")]
        public DateTime LastModificationDate { get; set; }
    }
}
