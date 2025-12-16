using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabsController : ControllerBase
    {
        private readonly ILaboratuvarService _labService;

        public LabsController(ILaboratuvarService labService)
        {
            _labService = labService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Laboratuvar>>> GetLaboratuvarlar()
        {
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

        [HttpPost]
        public async Task<ActionResult<Laboratuvar>> PostLaboratuvar(Laboratuvar laboratuvar)
        {
            var newLab = await _labService.AddLaboratuvarAsync(laboratuvar);
            // DİKKAT: id = newLab.LabID olarak düzeltildi
            return CreatedAtAction(nameof(GetLaboratuvar), new { id = newLab.LabID }, newLab);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLaboratuvar(int id, Laboratuvar laboratuvar)
        {
            // DİKKAT: id != laboratuvar.LabID olarak düzeltildi
            if (id != laboratuvar.LabID)
            {
                return BadRequest();
            }

            var exists = await _labService.LaboratuvarExistsAsync(id);
            if (!exists) return NotFound();

            await _labService.UpdateLaboratuvarAsync(laboratuvar);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLaboratuvar(int id)
        {
            var exists = await _labService.LaboratuvarExistsAsync(id);
            if (!exists) return NotFound();

            await _labService.DeleteLaboratuvarAsync(id);
            return NoContent();
        }
    }
}