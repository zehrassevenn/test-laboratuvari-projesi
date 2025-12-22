using Microsoft.AspNetCore.Mvc; //Api ve controller özellikleri için
using backend.Services; //servislere ulaşmak için
using backend.Models; // veritabanı tablolarını tanımak için
using System.Threading.Tasks; //asenkron(bekletmeyen) işlem için
using System.Linq; // Listeden ilk elemanı seçmek için

namespace backend.Controllers
{
    [Route("api/[controller]")] //frontendin bu sayfaya nasıl ulaşacağını belirler.
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IKullaniciService _userService;
        public AuthController(IKullaniciService userService)
        {
            _userService = userService;
        }

        [HttpPost("kayit")] //post isteği ile veri gönderiliyor
        public async Task<IActionResult> KayitOl([FromBody] Kullanici kullanici)
        {
            if (await _userService.KullaniciVarMi(kullanici.Email))//e posta kontrolü
            {
                return BadRequest("Bu e-posta adresi zaten kullanılıyor.");
            }
            //servise bunu kaydet diyoruz
            var yeniKullanici = await _userService.KayitOlAsync(kullanici);

            // kullanıcının hemen giriş yapamayacağını belirttik
            return Ok(new { mesaj = "Kayıt başarılı. Yöneticinin onaylaması bekleniyor.", kullaniciId = yeniKullanici.KullaniciID });
        }

        [HttpPost("giris")]
        public async Task<IActionResult> GirisYap([FromBody] Kullanici kullanici)
        {   //servise soruyo mail ve şifre doğru mu
            var girisYapan = await _userService.GirisYapAsync(kullanici.Email, kullanici.SifreHash);
            // yanlışsa
            if (girisYapan == null)
            {
                return Unauthorized("E-posta veya şifre hatalı.");
            }
            // eğer yönetici onaylamadıysa giriş yapamaz
            if (girisYapan.Onaylandi == false)
            {
                return Unauthorized("Giriş başarısız. Üyeliğiniz henüz yönetici tarafından onaylanmadı.");
            }

            // KULLANICININ ROLÜNÜ BULMA:
            var rolId = girisYapan.KullaniciRolleri.FirstOrDefault()?.RolID ?? 0;
            // kullanıcının bilgilerini frontende gönder
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

        // onay bekleyen kullanıcıları listele
        [HttpGet("bekleyenler")] // get ile veriler isteniyor
        public async Task<IActionResult> GetBekleyenler()
        {
            var bekleyenler = await _userService.GetOnayBekleyenlerAsync();

            //SONSUZ DÖNGÜYÜ ENGELLEME
            // Veritabanı nesnesini doğrudan göndermek yerine,
            // sadece ihtiyacımız olan bilgileri seçip yeni bir paket yapıyoruz.
            
            var sadeListe = bekleyenler.Select(k => new
            {
                k.KullaniciID,
                k.Ad,
                k.Soyad,
                k.Email,
                k.Onaylandi,
                // Rolleri alırken de sadece Rol Adını alıyoruz gerisini almıyoruz
                KullaniciRolleri = k.KullaniciRolleri.Select(kr => new
                {
                    Rol = new { kr.Rol.RolAdi }
                }).ToList()
            });
            // temiz listeyi gönderiyoruz
            return Ok(sadeListe);
        }

        // Kullanıcıyı Onayla
        [HttpPost("onayla/{id}")] // Adreste ID gelecek (örn: api/auth/onayla/5)
        public async Task<IActionResult> Onayla(int id)
        {   // servise onayla diyoruz
            var sonuc = await _userService.KullaniciOnaylaAsync(id);
            if (sonuc)//işlem başarılıysa
            {
                return Ok(new { mesaj = "Kullanıcı başarıyla onaylandı, artık giriş yapabilir." });
            }
            return BadRequest("Kullanıcı bulunamadı veya işlem başarısız.");
        }

        // Kullanıcıyı Reddet
        [HttpDelete("reddet/{id}")] //silme işlemi
        public async Task<IActionResult> Reddet(int id)
        {   //servise silmesini söylüyoruz
            var sonuc = await _userService.KullaniciReddetAsync(id);
            if (sonuc)
            {
                return Ok(new { mesaj = "Kullanıcı reddedildi ve kaydı silindi." });
            }
            return BadRequest("Kullanıcı bulunamadı.");
        }
    }
}