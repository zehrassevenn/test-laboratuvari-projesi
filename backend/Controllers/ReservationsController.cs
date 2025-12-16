using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Threading.Tasks;
using System.Linq; //select, where, tolist gibi komutlar için

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IRezervasyonService _rezervasyonService;

        public ReservationsController(IRezervasyonService rezervasyonService)
        {
            _rezervasyonService = rezervasyonService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRezervasyonlar()
        {
            var list = await _rezervasyonService.GetRezervasyonlarAsync();

            // === DÜZELTME: SONSUZ DÖNGÜYÜ ENGELLEME (MAPPING) ===
            var sonuc = list.Select(r => new
            {
                r.RezervasyonID,
                r.KullaniciID,
                r.EkipmanID,
                r.BaslangicTarihi,
                r.BitisTarihi,
                r.Durum,
                // Ekipman bilgisini sadeleştirerek alıyoruz
                Ekipman = r.Ekipman == null ? null : new
                {
                    r.Ekipman.EkipmanAdi,
                    r.Ekipman.Lokasyon
                },
                // Kullanıcı bilgisini de sadeleştiriyoruz
                Kullanici = r.Kullanici == null ? null : new
                {
                    r.Kullanici.Ad,
                    r.Kullanici.Soyad
                }
            });

            return Ok(sonuc);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRezervasyon(Rezervasyon rezervasyon)
        {
            // 1. Müsaitlik kontrolü (EkipmanID ve Tarihler kullanılarak)
            var musaitMi = await _rezervasyonService.IsMusaitAsync(
                rezervasyon.EkipmanID,
                rezervasyon.BaslangicTarihi,
                rezervasyon.BitisTarihi
            );

            if (!musaitMi)
            {
                return BadRequest("Seçilen saatlerde bu ekipman dolu.");
            }

            // 2. Kaydet
            var yeniRez = await _rezervasyonService.CreateRezervasyonAsync(rezervasyon);
            
            // DİKKAT: Dönüşte RezervasyonID kullanıldı
            return CreatedAtAction(nameof(GetRezervasyonlar), new { id = yeniRez.RezervasyonID }, yeniRez);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRezervasyon(int id)
        {
            await _rezervasyonService.DeleteRezervasyonAsync(id);
            return NoContent();
        }
    }
}