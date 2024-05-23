using car_rental.Server.Models;

namespace car_rental.Server.Dtos
{
    public class ReservationWithCar
    { 
        public Reservation? Reservation { get; set; }
        public Car? Car { get; set; }
    }
}
