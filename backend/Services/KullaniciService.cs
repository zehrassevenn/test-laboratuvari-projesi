using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq; // FirstOrDefault için gerekli
using BCrypt.Net;
using System.Collections.Generic;

namespace backend.Services
{
    public class KullaniciService : IKullaniciService
    {
        private readonly ApplicationDbContext _context;
        public KullaniciService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Kullanici> KayitOlAsync(Kullanici kullanici)
        {
            // Şifreyi şifreliyoruz
            kullanici.SifreHash = BCrypt.Net.BCrypt.HashPassword(kullanici.SifreHash);
            kullanici.Onaylandi=false; //Kayıt olan kişi varsayılan olarak onaysız olacak
            // 2. Önce Kullanıcıyı kaydet (Henüz Rol yok)
            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync(); // Bu satırdan sonra kullanici.KullaniciID oluşur.

            // 3. Şimdi KullaniciRol tablosuna ilişki ekle (Varsayılan Rol ID: 1)
            var yeniRolIliskisi = new KullaniciRol
            {
                KullaniciID = kullanici.KullaniciID,
                RolID = 1 // Varsayılan Rol Test mühendisi
            };

            _context.KullaniciRolleri.Add(yeniRolIliskisi);
            await _context.SaveChangesAsync();

            return kullanici;
        }
        public async Task<Kullanici> GirisYapAsync(string email, string sifre)
        {
            // Kullanıcıyı bulurken Rollerini de yanına ekle (Include)
            var kullanici = await _context.Kullanicilar
                .Include(k => k.KullaniciRolleri) // Kullanıcının rol bilgisini de getir
                .FirstOrDefaultAsync(x => x.Email == email);

            if (kullanici == null) return null;

            //kullanıcının giriş yaparken girdiği şifrenin doğru olup olmadığını kontrol eder
            bool sifreDogruMu = BCrypt.Net.BCrypt.Verify(sifre, kullanici.SifreHash);

            if (!sifreDogruMu) return null;

            return kullanici;
        }

        public async Task<bool> KullaniciVarMi(string email)
        {
            return await _context.Kullanicilar.AnyAsync(x => x.Email == email);
        }
        public async Task<IEnumerable<Kullanici>> GetOnayBekleyenlerAsync()
        {
            return await _context.Kullanicilar
                .Include(k => k.KullaniciRolleri)
                .ThenInclude(kr => kr.Rol)
                .Where(k => k.Onaylandi == false) // Sadece onaysızları getir
                .ToListAsync();
        }
        public async Task<bool> KullaniciOnaylaAsync(int id)
        {
            var kullanici = await _context.Kullanicilar.FindAsync(id);
            if (kullanici == null) return false;

            kullanici.Onaylandi = true;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> KullaniciReddetAsync(int id)
        {
            // 1. Kullanıcıyı bul
            var kullanici = await _context.Kullanicilar.FindAsync(id);
            if (kullanici == null) return false;

            // 2. Varsa ilişkili rollerini temizle (Cascade ayarına göre değişir ama manuel silmek garantidir)
            var roller = _context.KullaniciRolleri.Where(x => x.KullaniciID == id);
            _context.KullaniciRolleri.RemoveRange(roller);

            // 3. Kullanıcıyı tamamen sil
            _context.Kullanicilar.Remove(kullanici);
    
            await _context.SaveChangesAsync();
            return true;
        }
        
    }
}