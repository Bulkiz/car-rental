using car_rental.Server;
using car_rental.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace car_rental.Server.Data
{
    public class AppDbContext : DbContext    
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().ToTable("role", schema: "20118084");
            modelBuilder.Entity<User>().ToTable("user", schema: "20118084");
            modelBuilder.Entity<Car>().ToTable("car", schema: "20118084");
            modelBuilder.Entity<Reservation>().ToTable("reservation", schema: "20118084");

            modelBuilder.Entity<User>()
                .ToTable(tb => tb.UseSqlOutputClause(false));
            modelBuilder.Entity<Car>()
                .ToTable(tb => tb.UseSqlOutputClause(false));
            modelBuilder.Entity<Reservation>()
                .ToTable(tb => tb.UseSqlOutputClause(false));
        }

        public DbSet<Role> Role { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Car> Car { get; set; }
        public DbSet<Reservation> Reservation { get; set; }

    }
}
