using System.ComponentModel.DataAnnotations.Schema;

namespace car_rental.Server.Models
{
    public class Role
    {
        public int Id { get; set; }

        [Column("role_name")]
        public string? RoleName { get; set; }

        [Column("last_modification_date_20118084")]
        public DateTime? LastModificationDate { get; set; }
    }
}
