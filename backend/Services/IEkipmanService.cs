using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IEkipmanService
    {
        // Tüm ekipmanları getirir
        Task<IEnumerable<Ekipman>> GetAllEkipmanlarAsync();
        
        // Sadece belirli bir Laboratuvara ait ekipmanları getirir (Örn: Biyolojik Analiz Lab'ındakiler)
        Task<IEnumerable<Ekipman>> GetEkipmanlarByLabIdAsync(int labId);
        
        Task<Ekipman> GetEkipmanByIdAsync(int id);
        Task<Ekipman> AddEkipmanAsync(Ekipman ekipman);
        Task UpdateEkipmanAsync(Ekipman ekipman);
        Task DeleteEkipmanAsync(int id);
        Task UpdateEkipmanDurumAsync(int id, int durumId); //ekipman durumunu güncellemek için
    }
}