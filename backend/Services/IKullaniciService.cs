using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IKullaniciService
    {
        // Parametre olarak artık doğrudan Model alıyoruz
        Task<Kullanici> KayitOlAsync(Kullanici kullanici);
        
        // Giriş için de Kullanici modeli alalım (içinde email ve sifre olacak)
        Task<Kullanici> GirisYapAsync(string email, string sifre);
        Task<bool> KullaniciVarMi(string email);

        Task<IEnumerable<Kullanici>> GetOnayBekleyenlerAsync();//onay bekleyenleri getir
        Task<bool> KullaniciOnaylaAsync(int id);
        Task<bool> KullaniciReddetAsync(int id);
    }
}