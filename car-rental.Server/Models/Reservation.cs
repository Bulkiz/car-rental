using System.ComponentModel.DataAnnotations.Schema;

namespace car_rental.Server.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        [Column("user_reserving_id")]
        public int UserReservingId { get; set; }

        [Column("start_date")]
        public DateOnly StartDate { get; set; }

        [Column("end_date")]
        public DateOnly EndDate { get; set; }

        [Column("car_id")]
        public int CarId { get; set; }

        [Column("price")]
        public decimal Price { get; set; }

        [Column("last_modification_date_20118084")]
        public DateTime LastModificationDate { get; set; }
    }
}
