using System;
using System.Collections.Generic;
namespace backend.Models
{
    public class Rol
    {
    public int RolID { get; set; }
    public string RolAdi { get; set; }

    // İlişkisel veri
    public ICollection<KullaniciRol> KullaniciRolleri { get; set; }
    }
}
