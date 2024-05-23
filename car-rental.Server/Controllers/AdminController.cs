using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using car_rental.Server.Data;
using car_rental.Server.Models;

[ApiController]
[Route("inquiry")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("cars")]
    public async Task<IActionResult> GetCarsReport(DateOnly startDate, DateOnly endDate)
    {
        var cars = await _context.Car
            .Where(c => c.InsertDate >= startDate && c.InsertDate <= endDate)
            .Select(c => new { c.Make, c.Model, c.PricePerDay, c.InsertDate })
            .ToListAsync();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Cars");
            worksheet.Cell(1, 1).Value = "Make";
            worksheet.Cell(1, 2).Value = "Model";
            worksheet.Cell(1, 3).Value = "Price Per Day";
            worksheet.Cell(1, 4).Value = "Insert Date";

            for (int i = 0; i < cars.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = cars[i].Make;
                worksheet.Cell(i + 2, 2).Value = cars[i].Model;
                worksheet.Cell(i + 2, 3).Value = cars[i].PricePerDay;
                worksheet.Cell(i + 2, 4).Value = cars[i].InsertDate.ToString("yyyy-MM-dd");
            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                var fileName = $"cars_registered_{startDate:yyyy-MM-dd}_{endDate:yyyy-MM-dd}.xlsx";
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetLessorsReport(DateTime startDate, DateTime endDate)
    {
        var adminRoleId = await _context.Role
            .Where(r => r.RoleName.ToLower().Equals("admin"))
            .Select(r => r.Id)
            .FirstOrDefaultAsync();

        var users = await _context.User
            .Where(u => u.InsertDate >= startDate && u.InsertDate <= endDate && u.RoleId != adminRoleId)
            .Select(u => new
            {
                u.FirstName,
                u.LastName,
                u.Email,
                u.InsertDate,
                RoleName = _context.Role.Where(r => r.Id == u.RoleId).Select(r => r.RoleName).FirstOrDefault()
            })
            .ToListAsync();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Users");

            worksheet.Cell(1, 1).Value = "First Name";
            worksheet.Cell(1, 2).Value = "Last Name";
            worksheet.Cell(1, 3).Value = "Email";
            worksheet.Cell(1, 4).Value = "Registration Date";
            worksheet.Cell(1, 5).Value = "Role";

            for (int i = 0; i < users.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = users[i].FirstName;
                worksheet.Cell(i + 2, 2).Value = users[i].LastName;
                worksheet.Cell(i + 2, 3).Value = users[i].Email;
                worksheet.Cell(i + 2, 4).Value = users[i].InsertDate.ToString("yyyy-MM-dd");
                worksheet.Cell(i + 2, 5).Value = users[i].RoleName;
            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                var fileName = $"lessors_registered_{startDate:yyyy-MM-dd}_{endDate:yyyy-MM-dd}.xlsx";
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
        }
    }
}