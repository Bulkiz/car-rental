using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using car_rental.Server.Data;
using car_rental.Server.Models;
using car_rental.Server.Dtos;

namespace car_rental.Server.Controllers
{
    [Route("reservations")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation(Reservation reservation)
        {
            reservation.LastModificationDate = DateTime.Now;

            _context.Reservation.Add(reservation);
            await _context.SaveChangesAsync();

            return Ok(reservation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservation.FindAsync(id);

            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }

            if (reservation.StartDate <= DateOnly.FromDateTime(DateTime.Now) && reservation.EndDate >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest("Cannot delete a reservation that is currently in process.");
            }

            _context.Reservation.Remove(reservation);
            await _context.SaveChangesAsync();

            return Ok("Reservation deleted.");
        }

        [HttpGet("{userId}/current")]
        public async Task<IActionResult> GetCurrentReservations(int userId)
        {
            var user = await _context.User.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var role = await _context.Role.FindAsync(user.RoleId);
            if (role == null)
            {
                return NotFound("Role not found.");
            }

            var currentDate = DateOnly.FromDateTime(DateTime.Now);

            List<ReservationWithCar> reservationsWithCars = [];

            if (role.RoleName == "Lessor")
            {
                var reservations = await (from reservation in _context.Reservation
                                          join car in _context.Car on reservation.CarId equals car.Id
                                          where car.UserOwnerId == userId && reservation.EndDate >= currentDate
                                          select new ReservationWithCar
                                          {
                                              Reservation = reservation,
                                              Car = car
                                          }).ToListAsync();

                reservationsWithCars.AddRange(reservations);
            }
            else if (role.RoleName == "Renter" || role.RoleName == "Admin")
            {
                var reservations = await (from reservation in _context.Reservation
                                          join car in _context.Car on reservation.CarId equals car.Id
                                          where reservation.UserReservingId == userId && reservation.EndDate >= currentDate
                                          select new ReservationWithCar
                                          {
                                              Reservation = reservation,
                                              Car = car
                                          }).ToListAsync();

                reservationsWithCars.AddRange(reservations);
            }
            else
            {
                return BadRequest("Invalid user role.");
            }

            return Ok(reservationsWithCars);
        }

        [HttpGet("{userId}/past")]
        public async Task<IActionResult> GetPastReservations(int userId)
        {
            var user = await _context.User.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var role = await _context.Role.FindAsync(user.RoleId);
            if (role == null)
            {
                return NotFound("Role not found.");
            }

            var currentDate = DateOnly.FromDateTime(DateTime.Now);

            List<ReservationWithCar> reservationsWithCars = [];

            if (role.RoleName == "Lessor")
            {
                var reservations = await (from reservation in _context.Reservation
                                          join car in _context.Car on reservation.CarId equals car.Id
                                          where car.UserOwnerId == userId && reservation.EndDate < currentDate
                                          select new ReservationWithCar
                                          {
                                              Reservation = reservation,
                                              Car = car
                                          }).ToListAsync();

                reservationsWithCars.AddRange(reservations);
            }
            else if (role.RoleName == "Renter" || role.RoleName == "Admin")
            {
                var reservations = await (from reservation in _context.Reservation
                                          join car in _context.Car on reservation.CarId equals car.Id
                                          where reservation.UserReservingId == userId && reservation.EndDate < currentDate
                                          select new ReservationWithCar
                                          {
                                              Reservation = reservation,
                                              Car = car
                                          }).ToListAsync();

                reservationsWithCars.AddRange(reservations);
            }
            else
            {
                return BadRequest("Invalid user role.");
            }

            return Ok(reservationsWithCars);
        }
    }
}
