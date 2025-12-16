using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using System.Threading.Tasks;
using System.Linq; // Listeden ilk elemanı seçmek için

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IKullaniciService _userService;

        public AuthController(IKullaniciService userService)
        {
            _userService = userService;
        }

        [HttpPost("kayit")]
        public async Task<IActionResult> KayitOl([FromBody] Kullanici kullanici)
        {
            if (await _userService.KullaniciVarMi(kullanici.Email))
            {
                return BadRequest("Bu e-posta adresi zaten kullanılıyor.");
            }

            // Servis içinde hem kullanıcıyı hem de rol ilişkisini kaydediyor
            var yeniKullanici = await _userService.KayitOlAsync(kullanici);

            // GÜNCELLEME 1: Mesajı değiştirdik, kullanıcının hemen giriş yapamayacağını belirttik.
            return Ok(new { mesaj = "Kayıt başarılı. Yöneticinin onaylaması bekleniyor.", kullaniciId = yeniKullanici.KullaniciID });
        }

        [HttpPost("giris")]
        public async Task<IActionResult> GirisYap([FromBody] Kullanici kullanici)
        {
            var girisYapan = await _userService.GirisYapAsync(kullanici.Email, kullanici.SifreHash);

            if (girisYapan == null)
            {
                return Unauthorized("E-posta veya şifre hatalı.");
            }

            // GÜNCELLEME 2: Onay Kontrolü Ekledik (BURASI ÇOK ÖNEMLİ)
            // Eğer yönetici onaylamadıysa giriş yapamaz.
            if (girisYapan.Onaylandi == false)
            {
                return Unauthorized("Giriş başarısız. Üyeliğiniz henüz yönetici tarafından onaylanmadı.");
            }

            // KULLANICININ ROLÜNÜ BULMA:
            var rolId = girisYapan.KullaniciRolleri.FirstOrDefault()?.RolID ?? 0;

            return Ok(new
            {
                mesaj = "Giriş başarılı",
                id = girisYapan.KullaniciID,
                ad = girisYapan.Ad,
                soyad = girisYapan.Soyad,
                email = girisYapan.Email,
                rolId = rolId
            });
        }

        // ==========================================
        // GÜNCELLEME 3: YENİ EKLENEN ENDPOINT'LER
        // ==========================================

        // 1. Onay Bekleyen Kullanıcıları Listele
        // 1. Onay Bekleyen Kullanıcıları Listele (DÜZELTİLMİŞ HALİ)
        [HttpGet("bekleyenler")]
        public async Task<IActionResult> GetBekleyenler()
        {
            var bekleyenler = await _userService.GetOnayBekleyenlerAsync();

            // === DÜZELTME: SONSUZ DÖNGÜYÜ ENGELLEME ===
            // Veritabanı nesnesini (Entity) doğrudan göndermek yerine,
            // sadece ihtiyacımız olan bilgileri seçip yeni bir paket (Anonim Nesne) yapıyoruz.
            
            var sadeListe = bekleyenler.Select(k => new 
            {
                k.KullaniciID,
                k.Ad,
                k.Soyad,
                k.Email,
                k.Onaylandi,
                // Rolleri alırken de sadece Rol Adını alıyoruz, gerisini almıyoruz.
                KullaniciRolleri = k.KullaniciRolleri.Select(kr => new 
                {
                    Rol = new { kr.Rol.RolAdi }
                }).ToList()
            });

            return Ok(sadeListe);
        }

        // 2. Kullanıcıyı Onayla (Kabul Et)
        [HttpPost("onayla/{id}")]
        public async Task<IActionResult> Onayla(int id)
        {
            var sonuc = await _userService.KullaniciOnaylaAsync(id);
            if (sonuc)
            {
                return Ok(new { mesaj = "Kullanıcı başarıyla onaylandı, artık giriş yapabilir." });
            }
            return BadRequest("Kullanıcı bulunamadı veya işlem başarısız.");
        }

        // 3. Kullanıcıyı Reddet (Sil)
        [HttpDelete("reddet/{id}")]
        public async Task<IActionResult> Reddet(int id)
        {
            var sonuc = await _userService.KullaniciReddetAsync(id);
            if (sonuc)
            {
                return Ok(new { mesaj = "Kullanıcı reddedildi ve kaydı silindi." });
            }
            return BadRequest("Kullanıcı bulunamadı.");
        }
    }
}