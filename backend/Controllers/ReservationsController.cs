using Microsoft.AspNetCore.Mvc;
using backend.Models; // Modellerin olduğu yer
using backend.Services; // Servislerin olduğu yer
using backend.Data; // <-- DİKKAT: AppDbContext buradaysa bunu ekle, yoksa Models içindedir.
using System.Threading.Tasks;
using System.Linq;
using System; // Exception ve Enum dönüşümü için gerekli

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IRezervasyonService _rezervasyonService;
        private readonly ApplicationDbContext _context; // <-- 1. EKLENDİ: Veritabanı bağlantısı

        // Constructor (Yapıcı Metot) Güncellendi
        public ReservationsController(IRezervasyonService rezervasyonService, ApplicationDbContext context)
        {
            _rezervasyonService = rezervasyonService;
            _context = context; // <-- 2. EKLENDİ: Context'i içeri aldık
        }

        [HttpGet] // Veri çekme
        public async Task<IActionResult> GetRezervasyonlar()
        {
            var list = await _rezervasyonService.GetRezervasyonlarAsync();

            var sonuc = list.Select(r => new
            {
                r.RezervasyonID,
                r.KullaniciID,
                r.EkipmanID,
                r.BaslangicTarihi,
                r.BitisTarihi,
                r.Durum,
                // Ekipman bilgisi
                Ekipman = r.Ekipman == null ? null : new
                {
                    r.Ekipman.EkipmanAdi,
                    r.Ekipman.Lokasyon
                },
                // Kullanıcı bilgisi
                Kullanici = r.Kullanici == null ? null : new
                {
                    r.Kullanici.Ad,
                    r.Kullanici.Soyad
                }
            });

            return Ok(sonuc);
        }

        [HttpPost] // Yeni rezervasyon
        public async Task<IActionResult> CreateRezervasyon(Rezervasyon rezervasyon)
        {
            var musaitMi = await _rezervasyonService.IsMusaitAsync(
                rezervasyon.EkipmanID,
                rezervasyon.BaslangicTarihi,
                rezervasyon.BitisTarihi
            );
            if (!musaitMi)
            {
                return BadRequest("Seçilen saatlerde bu ekipman dolu.");
            }

            var yeniRez = await _rezervasyonService.CreateRezervasyonAsync(rezervasyon);
            
            return CreatedAtAction(nameof(GetRezervasyonlar), new { id = yeniRez.RezervasyonID }, yeniRez);
        }

        [HttpDelete("{id}")] // Silme
        public async Task<IActionResult> DeleteRezervasyon(int id)
        {
            await _rezervasyonService.DeleteRezervasyonAsync(id);
            return NoContent();
        }

        // --- 👇 YENİ EKLENEN KISIM: DURUM GÜNCELLEME ---
        
        [HttpPut("{id}/durum")]
        public async Task<IActionResult> UpdateDurum(int id, [FromBody] int durum)
        {
            // 1. Veritabanından rezervasyonu bul
            var rezervasyon = await _context.Rezervasyonlar.FindAsync(id);

            if (rezervasyon == null)
            {
                return NotFound("Rezervasyon bulunamadı.");
            }

            // 2. Durumu güncelle (0, 1 veya 2 olarak gelir)
            // Eğer modelinde Durum enum ise cast ediyoruz, int ise direkt atıyoruz.
            // Modelinde: public RezervasyonDurumu Durum { get; set; } ise:
            try
            {
                rezervasyon.Durum = (RezervasyonDurumu)durum;
            }
            catch
            {
                // Eğer Enum değilse düz int olarak ata:
                // rezervasyon.Durum = durum;
            }

            // 3. Değişikliği kaydet
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Durum başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }
    }
}