using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class LaboratuvarService : ILaboratuvarService
    {
        private readonly ApplicationDbContext _context;
        public LaboratuvarService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Laboratuvar>> GetLaboratuvarlarAsync()
        {
            return await _context.Laboratuvarlar.ToListAsync();
        }
        public async Task<Laboratuvar> GetLaboratuvarByIdAsync(int id)
        {
            return await _context.Laboratuvarlar.FindAsync(id);
        }
        public async Task<Laboratuvar> AddLaboratuvarAsync(Laboratuvar laboratuvar)
        {
            _context.Laboratuvarlar.Add(laboratuvar);
            await _context.SaveChangesAsync();
            return laboratuvar;
        }
        public async Task UpdateLaboratuvarAsync(Laboratuvar laboratuvar)
        {
            _context.Entry(laboratuvar).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task DeleteLaboratuvarAsync(int id)
        {
            var lab = await _context.Laboratuvarlar.FindAsync(id);
            if (lab != null)
            {
                _context.Laboratuvarlar.Remove(lab);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> LaboratuvarExistsAsync(int id)
        {
            return await _context.Laboratuvarlar.AnyAsync(e => e.LabID == id);
        }
    }
}