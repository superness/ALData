using Microsoft.EntityFrameworkCore;

namespace ALView
{
    public class ServerStatusContext : DbContext
    {
        public ServerStatusContext() : base()
        {
            Database.EnsureCreated();
        }

        public ServerStatusContext(DbContextOptions<ServerStatusContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<ServerStatus> Statuses { get; set; }
    }
}
