using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDatabase.Models;
using MyDatabase.ViewModels;

namespace MyDatabase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EmployeesController(EmployeeDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env; 
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.Include(x=> x.Qualifications).FirstOrDefaultAsync(x=> x.EmployeeId==id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }
        // ////////////////////////////////////////////////////////////
        [HttpGet("Qualification/Of/{id}")]
        public async Task<ActionResult<IEnumerable<Qualification>>> GetSpectOfDevice(int id)
        {
            return await _context.Qualifications.Where(x => x.EmployeeId == id).ToListAsync();
        }

        // PUT: api/Employees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.EmployeeId)
            {
                return BadRequest();
            }

            var existing = await _context.Employees.FirstOrDefaultAsync(x => x.EmployeeId == id);
            if (existing == null) { return NotFound(); }
            existing.EmployeeName = employee.EmployeeName;
            existing.EmployeeId = employee.EmployeeId;
            existing.Gender = employee.Gender;
            existing.JoiningDate = employee.JoiningDate;
            existing.Salary = employee.Salary;
            existing.IsaCurrentEmployee = employee.IsaCurrentEmployee;
            existing.Picture = employee.Picture;
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM Qualifications WHERE EmployeeId={id}");
            foreach (var q in employee.Qualifications)
            {
                _context.Qualifications.Add(new Qualification { PassingYear = q.PassingYear, EmployeeId = id, Degree = q.Degree });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
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

        // POST: api/Employees
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployee", new { id = employee.EmployeeId }, employee);
        }
        // ///////////////////////////////////////////////////////////////////
        [HttpPost("Image/Upload")]
        public async Task<ActionResult<ImageUploadResponse>> Upload(IFormFile pic)
        {
            string ext = Path.GetExtension(pic.FileName);
            string f = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ext;
            string savePath = Path.Combine(_env.WebRootPath, "Pictures", f);
            FileStream fs = new FileStream(savePath, FileMode.Create);
            await pic.CopyToAsync(fs);
            fs.Close();
            return new ImageUploadResponse { NewFileName = f };
        }
        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }
}
