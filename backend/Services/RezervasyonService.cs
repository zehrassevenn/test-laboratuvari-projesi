using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class RezervasyonService : IRezervasyonService
    {
        private readonly ApplicationDbContext _context;

        public RezervasyonService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Rezervasyon>> GetRezervasyonlarAsync()
        {
            // Tablo adı: Rezervasyonlar
            return await _context.Rezervasyonlar.ToListAsync();
        }

        public async Task<Rezervasyon> GetRezervasyonByIdAsync(int id)
        {
            return await _context.Rezervasyonlar.FindAsync(id);
        }

        public async Task<Rezervasyon> CreateRezervasyonAsync(Rezervasyon rezervasyon)
        {
            _context.Rezervasyonlar.Add(rezervasyon);
            await _context.SaveChangesAsync();
            return rezervasyon;
        }

        public async Task DeleteRezervasyonAsync(int id)
        {
            var rez = await _context.Rezervasyonlar.FindAsync(id);
            if (rez != null)
            {
                _context.Rezervasyonlar.Remove(rez);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsMusaitAsync(int ekipmanId, System.DateTime baslangic, System.DateTime bitis)
        {
            // DİKKAT: EkipmanID, BaslangicTarihi, BitisTarihi kullanıldı
            var cakismaVarMi = await _context.Rezervasyonlar
                .AnyAsync(r => r.EkipmanID == ekipmanId &&
                               (
                                   (baslangic >= r.BaslangicTarihi && baslangic < r.BitisTarihi) || 
                                   (bitis > r.BaslangicTarihi && bitis <= r.BitisTarihi) ||
                                   (baslangic <= r.BaslangicTarihi && bitis >= r.BitisTarihi)
                               ));

            return !cakismaVarMi;
        }
    }
}