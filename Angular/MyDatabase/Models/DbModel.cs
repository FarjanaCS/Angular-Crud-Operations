using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MyDatabase.Models
{
    public enum Gender { Male = 1, Female }
    public class Employee
    {
        public int EmployeeId { get; set; }
        [Required, StringLength(40)]
        public string EmployeeName { get; set; } = default!;
        [Required, EnumDataType(typeof(Gender))]
        public Gender Gender { get; set; }
        [Required, Column(TypeName = "date")]
        public DateTime? JoiningDate { get; set; }
        [Required, Column(TypeName = "money")]
        public decimal Salary { get; set; }
        [Required, StringLength(40)]
        public string Picture { get; set; } = default!;
        public bool? IsaCurrentEmployee { get; set; }
        public virtual ICollection<Qualification> Qualifications { get; set; } = new List<Qualification>();
    }
    public class Qualification
    {
        public int QualificationId { get; set; }
        [Required, StringLength(40)]
        public string Degree { get; set; } = default!;
        [Required]
        public int PassingYear { get; set; }
        [Required, ForeignKey("Employee")]
        public int EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; } = default!;
    }

    public class EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : DbContext(options)
    {
       
        public DbSet<Employee> Employees { get; set; } = default!;
        public DbSet<Qualification> Qualifications { get; set; } = default!;

    }
}
