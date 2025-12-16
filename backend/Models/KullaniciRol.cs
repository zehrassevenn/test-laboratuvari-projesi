namespace backend.Models
{
    public class KullaniciRol
    {
    // Bileşik Anahtar (Composite Key) - EF Core'da ayrıca konfigüre edilmeli
    public int KullaniciID { get; set; }
    public Kullanici Kullanici { get; set; }

    public int RolID { get; set; }
    public Rol Rol { get; set; }
    }
}
