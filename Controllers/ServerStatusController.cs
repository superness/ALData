using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace ALView
{
    [EnableCors("_myAllowSpecificOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class ServerStatusController : ControllerBase
    {
        private readonly ServerStatusContext _context;

        public ServerStatusController(ServerStatusContext context)
        {
            _context = context;
        }

        // GET: api/BespokeServerStatus
        [ActionName("GetAsync")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServerStatus>>> GetStatuses()
        {
            DateTime tooOld = DateTime.UtcNow.AddHours(-4);
            return await _context.Statuses.Where(s => s.lastupdate > tooOld).ToListAsync();
        }

        // POST: api/BespokeServerStatus
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ServerStatus>> PostServerStatus(ServerStatus serverStatus)
        {

            // Find any existing server status to update
            ServerStatus existingStatus = _context.Statuses.FirstOrDefault(s => 
                                                                            s.server_region == serverStatus.server_region && 
                                                                            s.server_identifier == serverStatus.server_identifier &&
                                                                            s.eventname == serverStatus.eventname);

            if (null != existingStatus)
            {
                existingStatus.live = serverStatus.live;
                existingStatus.map = serverStatus.map;
                existingStatus.x = serverStatus.x;
                existingStatus.y = serverStatus.y;
                existingStatus.spawn = serverStatus.spawn;
                existingStatus.hp = serverStatus.hp;
                existingStatus.max_hp = serverStatus.max_hp;
                existingStatus.lastupdate = DateTime.UtcNow;
                existingStatus.target = serverStatus.target;
            }
            else
            {
                // Otherwise create a new one
                serverStatus.lastupdate = DateTime.UtcNow;
                _context.Statuses.Add(serverStatus);
            }

            // If there are any duplicate entries then remove the oldest ones
            while (AreAnyStatusDuplicates())
            {
                var dupes = GetAnyStatusDuplicates();
                if(null != dupes)
                {
                    var status = dupes.Item1;
                    var statusCompare = dupes.Item2;

                    // Remove the one that is oldest
                    if (statusCompare.lastupdate < status.lastupdate)
                    {
                        _context.Statuses.Remove(statusCompare);
                    }
                    else
                    {
                        _context.Statuses.Remove(status);
                    }

                    await _context.SaveChangesAsync();
                }

            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        public Tuple<ServerStatus, ServerStatus> GetAnyStatusDuplicates()
        {
            foreach (var status in _context.Statuses)
            {
                foreach (var statusCompare in _context.Statuses)
                {
                    if (statusCompare.server_region == status.server_region &&
                       statusCompare.server_identifier == status.server_identifier &&
                       statusCompare.eventname == status.eventname &&
                       statusCompare.ID != status.ID)
                    {
                        return Tuple.Create(status, statusCompare);
                    }
                }
            }

            return null;
        }

        public bool AreAnyStatusDuplicates()
        {
            foreach (var status in _context.Statuses)
            {
                foreach (var statusCompare in _context.Statuses)
                {
                    if (statusCompare.server_region == status.server_region &&
                       statusCompare.server_identifier == status.server_identifier &&
                       statusCompare.eventname == status.eventname &&
                       statusCompare.ID != status.ID)
                    {
                        return true;
                    }
                }
            }

            return false;
        }
    }
}
