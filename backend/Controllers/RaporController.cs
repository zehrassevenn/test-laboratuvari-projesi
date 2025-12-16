using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaporController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RaporController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LİSTELEME (Filtreli)
        [HttpGet]
        public async Task<IActionResult> GetRaporlar([FromQuery] int? labId, [FromQuery] int? ekipmanId)
        {
            var query = _context.Raporlar
                .Include(r => r.Kullanici)
                .Include(r => r.Laboratuvar)
                .Include(r => r.Ekipman)
                .AsQueryable();

            // Filtreleme Mantığı
            if (labId.HasValue) query = query.Where(r => r.LabID == labId);
            if (ekipmanId.HasValue) query = query.Where(r => r.EkipmanID == ekipmanId);

            var raporlar = await query.OrderByDescending(r => r.YuklemeTarihi).Select(r => new
            {
                r.RaporID,
                r.Baslik,
                r.OrijinalDosyaAdi,
                r.YuklemeTarihi,
                r.KullaniciID,
                Yukleyen = r.Kullanici.Ad + " " + r.Kullanici.Soyad,
                LabAdi = r.Laboratuvar != null ? r.Laboratuvar.LabAdi : "Genel",
                EkipmanAdi = r.Ekipman != null ? r.Ekipman.EkipmanAdi : "-"
            }).ToListAsync();

            return Ok(raporlar);
        }

        // 2. DOSYA YÜKLEME (UPLOAD)
        [HttpPost("upload")]
        public async Task<IActionResult> UploadRapor([FromForm] IFormFile dosya, [FromForm] string baslik, [FromForm] int kullaniciId, [FromForm] int? labId, [FromForm] int? ekipmanId)
        {
            if (dosya == null || dosya.Length == 0) return BadRequest("Lütfen bir dosya seçin.");

            // 1. Klasör Ayarı (wwwroot/uploads)
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            // 2. Benzersiz İsim Oluşturma (Aynı isimli dosyalar çakışmasın diye)
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + dosya.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // 3. Dosyayı Kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dosya.CopyToAsync(stream);
            }

            // 4. Veritabanına Bilgisini Kaydet
            var rapor = new Rapor
            {
                Baslik = baslik,
                DosyaYolu = uniqueFileName,
                OrijinalDosyaAdi = dosya.FileName,
                KullaniciID = kullaniciId,
                LabID = labId,
                EkipmanID = ekipmanId,
                YuklemeTarihi = DateTime.Now
            };

            _context.Raporlar.Add(rapor);
            await _context.SaveChangesAsync();

            return Ok(new { mesaj = "Rapor başarıyla yüklendi." });
        }

        // 3. İNDİRME (DOWNLOAD)
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadRapor(int id)
        {
            var rapor = await _context.Raporlar.FindAsync(id);
            if (rapor == null) return NotFound("Rapor bulunamadı.");

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", rapor.DosyaYolu);
            
            if (!System.IO.File.Exists(filePath)) 
                return NotFound("Dosya sunucuda bulunamadı (silinmiş olabilir).");

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            // Dosyayı tarayıcıya gönder
            return File(memory, "application/octet-stream", rapor.OrijinalDosyaAdi);
        }

        // 4. SİLME
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRapor(int id)
        {
            var rapor = await _context.Raporlar.FindAsync(id);
            if (rapor == null) return NotFound();

            // Dosyayı klasörden de silelim ki yer kaplamasın
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", rapor.DosyaYolu);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.Raporlar.Remove(rapor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}