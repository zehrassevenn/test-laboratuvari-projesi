using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models
{
    public class Rezervasyon
    {
    [Key]
    public int RezervasyonID { get; set; }

    [ForeignKey("Kullanici")]
    public int KullaniciID { get; set; }
    public Kullanici Kullanici { get; set; } // Rezervasyonu yapan kullanıcı

    [ForeignKey("Ekipman")]
    public int EkipmanID { get; set; }
    public Ekipman Ekipman { get; set; } // Rezerve edilen ekipman

    [Required]
    public DateTime BaslangicTarihi { get; set; }

    [Required]
    public DateTime BitisTarihi { get; set; }

    // Enum kullanımı
    public RezervasyonDurumu Durum { get; set; } = RezervasyonDurumu.OnayBekliyor;

    // İlişkisel veri: Bir rezervasyonun bir raporu olabilir (veya olmayabilir)
    public Rapor? Rapor { get; set; }
    }
}
