using System;
using Microsoft.AspNetCore.Mvc; //api ve controller özellikleri için
using backend.Models; //veritabanı tablolarını tanımak için
using backend.Services; //servisi tanımak için
using System.Threading.Tasks; //asenkron işlemler sistemi kilitlemeden çalışmak için
using System.Linq; // veriyi filtrelemek şekillendirmek (select işlemi) için gerekli

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EkipmanController : ControllerBase
    {
        private readonly IEkipmanService _ekipmanService;
        public EkipmanController(IEkipmanService ekipmanService)
        {
            _ekipmanService = ekipmanService;
        }

        // tüm ekipmanları getir
        [HttpGet] //get isteği gelirse burası çalışır
        public async Task<IActionResult> GetEkipmanlar()
        {
            //veritabanından ham veriler gelir
            var ekipmanlar = await _ekipmanService.GetAllEkipmanlarAsync();

            // SADELEŞTİRME (Mapping) - Sonsuz döngüyü engeller
            var sonuc = ekipmanlar.Select(e => new
            {
                e.EkipmanID,
                e.EkipmanAdi,
                e.Aciklama,
                e.Lokasyon,
                e.Durum,
                e.LabID,
                // Laboratuvarı komple nesne olarak değil, sadece adını alarak gönderiyoruz
                e.ResimUrl,
                Laboratuvar = e.Laboratuvar == null ? null : new
                {
                    e.Laboratuvar.LabAdi
                }
            });

            return Ok(sonuc); //temiz listeyi gönderiyoruz
        }

        // LAB ID'YE GÖRE GETİR
        [HttpGet("by-lab/{labId}")]
        public async Task<IActionResult> GetEkipmanlarByLab(int labId)
        {   //belirli idye ait laboratuvarın cihazlarını getir diyor
            var ekipmanlar = await _ekipmanService.GetEkipmanlarByLabIdAsync(labId);

            // AYNI SADELEŞTİRME BURADA DA YAPILMALI
            var sonuc = ekipmanlar.Select(e => new
            {
                e.EkipmanID,
                e.EkipmanAdi,
                e.Aciklama,
                e.Lokasyon,
                e.Durum,
                e.LabID,
                // Eğer Lab null ise (silinmişse) hata verme, null geç.
                e.ResimUrl,
                Laboratuvar = e.Laboratuvar == null ? null : new
                {
                    e.Laboratuvar.LabAdi
                }
            });

            return Ok(sonuc);
        }

        [HttpPost] //veri kaydetme isteği
        public async Task<IActionResult> AddEkipman([FromBody] Ekipman ekipman)
        {   //frontenden geleni al servise ver kaydetsin
            var yeniEkipman = await _ekipmanService.AddEkipmanAsync(ekipman);
            return Ok(yeniEkipman);
        }

        [HttpDelete("{id}")]//silme isteği
        public async Task<IActionResult> DeleteEkipman(int id)
        {   //belirli id'deki cihazı siliyoruz
            await _ekipmanService.DeleteEkipmanAsync(id);
            return NoContent();// 204 Döndür (İşlem başarılı ama geri dönecek veri yok)
        }

        // Ekipman durumunu güncellemek için özel endpoint
        [HttpPatch("{id}/durum")]
        public async Task<IActionResult> UpdateDurum(int id, [FromBody] int yeniDurum)
        {
            await _ekipmanService.UpdateEkipmanDurumAsync(id, yeniDurum);
            return Ok(new { mesaj = "Durum güncellendi" });
        }
        // Cihaz Bilgilerini Güncelle (Tam Güncelleme)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEkipman(int id, [FromBody] Ekipman ekipman)
        {
            if (id != ekipman.EkipmanID)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            try
            {
                await _ekipmanService.UpdateEkipmanAsync(ekipman);
            }
            catch (Exception)
            {
                return NotFound("Cihaz bulunamadı veya hata oluştu.");
            }

            return NoContent(); // 204 Başarılı
        }
    }
}