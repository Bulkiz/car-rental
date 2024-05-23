using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using car_rental.Server.Data;
using car_rental.Server.Models;

namespace car_rental.Server.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            if (await _context.User.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("Email already exists.");
            }

            user.InsertDate = DateTime.Now;
            user.LastModificationDate = DateTime.Now;

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User loginUser)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == loginUser.Email);

            if (user == null || user.Password != loginUser.Password)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserInformation(User updatedUser)
        {
            var user = await _context.User.FindAsync(updatedUser.Id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Email != updatedUser.Email && await _context.User.AnyAsync(u => u.Email == updatedUser.Email))
            {
                return BadRequest("Email already exists.");
            }

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Password = updatedUser.Password;
            user.Email = updatedUser.Email;
            user.DateOfBirth = updatedUser.DateOfBirth;
            user.LastModificationDate = DateTime.Now;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(updatedUser);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(user.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }
    }
}
