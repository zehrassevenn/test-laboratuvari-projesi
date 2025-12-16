using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Rapor
    {
        [Key]
        public int RaporID { get; set; }

        [Required]
        public string Baslik { get; set; } // Raporun Görünen Adı

        public string DosyaYolu { get; set; } // Sunucudaki benzersiz isim (Guid_dosya.pdf)
        public string OrijinalDosyaAdi { get; set; } // İndirirken görünecek isim (Rapor.pdf)

        public DateTime YuklemeTarihi { get; set; } = DateTime.Now;

        // --- İLİŞKİLER (GÜNCELLENDİ) ---
        
        // Hangi Laba ait?
        [ForeignKey("Laboratuvar")]
        public int? LabID { get; set; }
        public Laboratuvar Laboratuvar { get; set; }

        // Hangi Cihaza ait? (Opsiyonel, sadece lab raporu da olabilir)
        [ForeignKey("Ekipman")]
        public int? EkipmanID { get; set; }
        public Ekipman Ekipman { get; set; }

        // Kim Yükledi?
        public int KullaniciID { get; set; }
        public Kullanici Kullanici { get; set; }
    }
}