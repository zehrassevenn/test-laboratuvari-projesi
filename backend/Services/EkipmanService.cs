using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class EkipmanService : IEkipmanService
    {
        private readonly ApplicationDbContext _context;//veritabanına erişmeye çalışıyoruz
        public EkipmanService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Ekipman>> GetAllEkipmanlarAsync()
        {
            // Ekipmanı getirirken hangi laboratuvara ait olduğunu da getirelim (Include)
            return await _context.Ekipmanlar.Include(e => e.Laboratuvar).ToListAsync();
        }

        public async Task<IEnumerable<Ekipman>> GetEkipmanlarByLabIdAsync(int labId)
        {
            return await _context.Ekipmanlar
                .Where(e => e.LabID == labId)
                .Include(e => e.Laboratuvar)
                .ToListAsync();
        }

        public async Task<Ekipman> GetEkipmanByIdAsync(int id)
        {
            return await _context.Ekipmanlar.FindAsync(id);
        }

        public async Task<Ekipman> AddEkipmanAsync(Ekipman ekipman)
        {
            _context.Ekipmanlar.Add(ekipman);
            await _context.SaveChangesAsync();
            return ekipman;
        }

        public async Task UpdateEkipmanAsync(Ekipman ekipman)
        {
            _context.Entry(ekipman).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEkipmanAsync(int id)
        {
            var ekipman = await _context.Ekipmanlar.FindAsync(id);
            if (ekipman != null)
            {
                _context.Ekipmanlar.Remove(ekipman);
                await _context.SaveChangesAsync();
            }
        }
        
        public async Task UpdateEkipmanDurumAsync(int id, int durumId)
        {
            var ekipman = await _context.Ekipmanlar.FindAsync(id);
            if (ekipman != null)
            {
              // Gelen sayıyı (0,1,2,3) Enum'a çevirip kaydediyoruz
                ekipman.Durum = (EkipmanDurumu)durumId;
                await _context.SaveChangesAsync();
            }
        }
    }
}