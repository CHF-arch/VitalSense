using Microsoft.EntityFrameworkCore;
using DietManagement.Api.Data.Entities;

namespace DietManagement.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
    }
}