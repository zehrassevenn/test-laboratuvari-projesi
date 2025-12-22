using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // [Key], [Required] gibi özellikler için
using System.ComponentModel.DataAnnotations.Schema; // [ForeignKey] için

namespace backend.Models
{
    public class Laboratuvar
    {
    [Key] // Primary Key olduğunu belirtir
    public int LabID { get; set; }

    [Required] // boş geçilemez (NOT NULL) olduğunu belirtir
    [StringLength(100)]
    public string LabAdi { get; set; }

    public string? Aciklama { get; set; } // '?' string'in nullable (boş olabilir) olduğunu belirtir

    [ForeignKey("Sorumlu")] // Aşağıdaki Sorumlu özelliğinin FK'sidir
    public int SorumluID { get; set; }
    public Kullanici Sorumlu { get; set; } // İlişkisel veri

    public bool Aktif { get; set; } = true; // Varsayılan değer olarak 'true'

    //Bir laboratuvarda birden çok ekipman bulunur
    public ICollection<Ekipman> Ekipmanlar { get; set; }
    }
}
