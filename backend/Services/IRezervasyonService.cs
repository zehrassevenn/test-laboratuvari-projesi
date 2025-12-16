using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IRezervasyonService
    {
        Task<IEnumerable<Rezervasyon>> GetRezervasyonlarAsync();
        Task<Rezervasyon> GetRezervasyonByIdAsync(int id);
        Task<Rezervasyon> CreateRezervasyonAsync(Rezervasyon rezervasyon);
        Task DeleteRezervasyonAsync(int id);
        
        // DİKKAT: Parametre laboratuvarId yerine ekipmanId oldu, çünkü modele göre ekipman rezerve ediliyor.
        Task<bool> IsMusaitAsync(int ekipmanId, System.DateTime baslangic, System.DateTime bitis);
    }
}