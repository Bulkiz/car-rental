using System.ComponentModel.DataAnnotations.Schema;

namespace car_rental.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("password")]
        public string? Password { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("date_of_birth")]
        public DateOnly DateOfBirth { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        [Column("insert_date")]
        public DateTime InsertDate { get; set; }

        [Column("last_modification_date_20118084")]
        public DateTime LastModificationDate { get; set; }
    }
}
