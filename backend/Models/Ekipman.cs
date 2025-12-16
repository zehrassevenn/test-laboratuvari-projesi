using System.Collections.Generic; // Listeler (ICollection) için gerekli
using System.ComponentModel.DataAnnotations;// [Key], [Required] gibi kurallar için
using System.ComponentModel.DataAnnotations.Schema;// [ForeignKey] gibi veritabanı ilişkileri için

namespace backend.Models
{
    public class Ekipman
    {
        [Key] //primary key
        public int EkipmanID { get; set; }

        [ForeignKey("Laboratuvar")]//hangi laboratuvara ait olduğunu belirliyoruz
        public int LabID { get; set; }
        public Laboratuvar Laboratuvar { get; set; } // İlişkisel veri

        [Required]// sqldeki karşılığı not null
        [StringLength(150)]//max karakter sayısı
        public string EkipmanAdi { get; set; }
        public string? Aciklama { get; set; }//? alanın boş olabileceğini belirtir
        public string? Lokasyon { get; set; }

        // Enum'ları tanıyabilmesi için namespace içinde olmalı
        public EkipmanDurumu Durum { get; set; } = EkipmanDurumu.Müsait;

        public string? ResimUrl { get; set; } // Resmin internet adresini tutacak
        // ICollection'ı tanıyabilmesi için using System.Collections.Generic gerekli
        public ICollection<Rezervasyon> Rezervasyonlar { get; set; }
    }
}