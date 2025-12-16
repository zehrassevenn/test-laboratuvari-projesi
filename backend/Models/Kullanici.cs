using System;
using System.Collections.Generic;
namespace backend.Models
{
    public class Kullanici
    {
    public int KullaniciID { get; set; }
    public string Ad { get; set; }
    public string Soyad { get; set; }
    public string Email { get; set; }
    public string SifreHash { get; set; }
    public DateTime KayitTarihi { get; set; } = DateTime.UtcNow;
    public bool Onaylandi {get; set; } = false;
    //üye olan kullanıcıyı yönetici onaylayacak
    
    
    // Bir kullanıcının birden fazla rolü olabilir
    public ICollection<KullaniciRol> KullaniciRolleri { get; set; }

    // Bir kullanıcı birden fazla laboratuvardan sorumlu olabilir
    public ICollection<Laboratuvar> SorumluOlduguLablar { get; set; }

    // Bir kullanıcının birden fazla rezervasyonu olabilir
    public ICollection<Rezervasyon> Rezervasyonlar { get; set; }
    }
    
}
