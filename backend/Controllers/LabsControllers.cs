using Microsoft.AspNetCore.Mvc; //api ve controller özellikleri için
using backend.Models;//veritabanı tablolarını tanımak için
using backend.Services; //servisi tanımak için
using System.Collections.Generic; //liste kullanmak için
using System.Threading.Tasks; //bekletmeyen işlemler için

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabsController : ControllerBase
    {
        //Controller veritabanına kendi başına gitmez
        //ILaboratuvarServiceüzerinden iş yaptırır
        private readonly ILaboratuvarService _labService;
        public LabsController(ILaboratuvarService labService)
        {
            _labService = labService;
        }

        [HttpGet]
        //IEnumerable: Basitçe "Liste" demektir.
        // Birden fazla laboratuvar döneceği için bu tip kullanılır.
        public async Task<ActionResult<IEnumerable<Laboratuvar>>> GetLaboratuvarlar()
        {
            //servise bütün labları ver diyoruz
            var labs = await _labService.GetLaboratuvarlarAsync();
            return Ok(labs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Laboratuvar>> GetLaboratuvar(int id)
        {
            var lab = await _labService.GetLaboratuvarByIdAsync(id);
            if (lab == null) return NotFound("Laboratuvar bulunamadı.");
            return Ok(lab);
        }

        [HttpPost] //veri kaydetme
        public async Task<ActionResult<Laboratuvar>> PostLaboratuvar(Laboratuvar laboratuvar)
        {
            // Frontend'den gelen laboratuvar bilgilerini  verip kaydet diyoruz
            var newLab = await _labService.AddLaboratuvarAsync(laboratuvar);
            //id = newLab.LabID olarak düzeltildi
            return CreatedAtAction(nameof(GetLaboratuvar), new { id = newLab.LabID }, newLab);
        }

        [HttpPut("{id}")] // put isteği veri güncelleme
        public async Task<IActionResult> PutLaboratuvar(int id, Laboratuvar laboratuvar)
        {
            // GÜVENLİK KONTROLÜ:
            // Adresteki ID ile kutunun içindeki ID (Body'deki ID) aynı mı?
            // Aynı değilse "Hatalı İstek" (400 Bad Request) diyoruz
            if (id != laboratuvar.LabID)
            {
                return BadRequest();
            }
            // Veritabanında bu lab var mı diye servise soruyoruz
            var exists = await _labService.LaboratuvarExistsAsync(id);
            if (!exists) return NotFound();// Yoksa güncelleme yapamayız
            // Varsa güncellemeyi yap
            await _labService.UpdateLaboratuvarAsync(laboratuvar);
            return NoContent();//İşlem başarılı ama geri dönecek veri yok
        }

        [HttpDelete("{id}")]//veri silme
        public async Task<IActionResult> DeleteLaboratuvar(int id)
        {
            // Önce var mı diye kontrol et
            var exists = await _labService.LaboratuvarExistsAsync(id);
            if (!exists) return NotFound();
            //varsa sil
            await _labService.DeleteLaboratuvarAsync(id);
            return NoContent();
        }
    }
}