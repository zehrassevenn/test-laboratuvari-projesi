using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface ILaboratuvarService
    {
        Task<IEnumerable<Laboratuvar>> GetLaboratuvarlarAsync();
        Task<Laboratuvar> GetLaboratuvarByIdAsync(int id);
        Task<Laboratuvar> AddLaboratuvarAsync(Laboratuvar laboratuvar);
        Task UpdateLaboratuvarAsync(Laboratuvar laboratuvar);
        Task DeleteLaboratuvarAsync(int id);
        Task<bool> LaboratuvarExistsAsync(int id);
    }
}