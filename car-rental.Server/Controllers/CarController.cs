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
using DocumentFormat.OpenXml.Drawing;

namespace car_rental.Server.Controllers
{
    [Route("cars")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetAvailableCars(DateTime? startDate, DateTime? endDate, string? location)
        {
            if (!startDate.HasValue || !endDate.HasValue)
            {
                return BadRequest("Both start date and end date must be provided.");
            }

            DateOnly start = DateOnly.FromDateTime(startDate.Value);
            DateOnly end = DateOnly.FromDateTime(endDate.Value);

            var overlappingReservations = await _context.Reservation
                .Where(r =>
                    (start >= r.StartDate && start <= r.EndDate) ||
                    (end >= r.StartDate && end <= r.EndDate) ||
                    (start <= r.StartDate && end >= r.EndDate)
                )
                .Select(r => r.CarId)
                .ToListAsync();

            return await _context.Car
                            .Where(c => !overlappingReservations.Contains(c.Id) && c.Location == location && !c.IsRemoved)
                            .ToListAsync();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars(int id)
        {
            var cars = await _context.Car
                                 .Where(c => !c.IsRemoved && c.UserOwnerId == id)
                                 .Select(c => new CarDto
                                 {
                                     Id = c.Id,
                                     Make = c.Make,
                                     Model = c.Model,
                                     EngineType = c.EngineType,
                                     TransmissionType = c.TransmissionType,
                                     Seats = c.Seats,
                                     Doors = c.Doors,
                                     AirConditioner = c.AirConditioner,
                                     UserOwnerId = c.UserOwnerId,
                                     PricePerDay = c.PricePerDay,
                                     Location = c.Location,
                                     InsertDate = c.InsertDate,
                                     PictureBase64 = c.Picture != null ? Convert.ToBase64String(c.Picture) : null
                                 })
                                 .ToListAsync();

            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CarDto>> GetCar(int id)
        {
            var car = await _context.Car
                           .Where(c => !c.IsRemoved)
                           .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
            {
                return NotFound();
            }

            var carDto = new CarDto
            {
                Id = car.Id,
                Make = car.Make,
                Model = car.Model,
                EngineType = car.EngineType,
                TransmissionType = car.TransmissionType,
                Seats = car.Seats,
                Doors = car.Doors,
                AirConditioner = car.AirConditioner,
                UserOwnerId = car.UserOwnerId,
                PricePerDay = car.PricePerDay,
                Location = car.Location,
                InsertDate = car.InsertDate,
                PictureBase64 = car.Picture != null ? Convert.ToBase64String(car.Picture) : null
            };

            return carDto;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarInfo(int id, [FromForm] CarDto carDto)
        {

            var car = await _context.Car.FindAsync(carDto.Id);

            if (car == null)
            {
                return NotFound("Car not found.");
            }

            car.Make = carDto.Make;
            car.Model = carDto.Model;
            car.EngineType = carDto.EngineType;
            car.TransmissionType = carDto.TransmissionType;
            car.Seats = carDto.Seats;
            car.Doors = carDto.Doors;
            car.AirConditioner = carDto.AirConditioner;
            car.UserOwnerId = carDto.UserOwnerId;
            car.PricePerDay = carDto.PricePerDay;
            car.Location = carDto.Location;
            car.LastModificationDate = DateTime.Now;

            _context.Entry(car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(car);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(car.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult<Car>> AddCar([FromForm] CarDto carDto)
        {
            if (carDto.PictureFile == null)
            {
                return BadRequest("Picture file is required.");
            }

            using var memoryStream = new MemoryStream();
            await carDto.PictureFile.CopyToAsync(memoryStream);
            var car = new Car
            {
                Make = carDto.Make,
                Model = carDto.Model,
                EngineType = carDto.EngineType,
                TransmissionType = carDto.TransmissionType,
                Seats = carDto.Seats,
                Doors = carDto.Doors,
                AirConditioner = carDto.AirConditioner,
                UserOwnerId = carDto.UserOwnerId,
                IsRemoved = false,
                PricePerDay = carDto.PricePerDay,
                Location = carDto.Location,
                Picture = memoryStream.ToArray(),
                InsertDate = DateOnly.FromDateTime(DateTime.Now),
                LastModificationDate = DateTime.Now
            };

            _context.Car.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCar", new { id = car.Id }, car);
        }

        [HttpPut("{id}/remove")]
        public async Task<IActionResult> RemoveCar(int id)
        {
            var car = await _context.Car.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            car.LastModificationDate = DateTime.Now;
            car.IsRemoved = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool CarExists(int id)
        {
            return _context.Car.Any(e => e.Id == id);
        }
    }
}
