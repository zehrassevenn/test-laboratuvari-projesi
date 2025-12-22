namespace backend.Models
{
    public enum EkipmanDurumu
    {
        Müsait,
        Kullanımda,
        Bakımda,
        Arızalı
    }

    public enum RezervasyonDurumu
    {
        OnayBekliyor,
        Onaylandı,
        Reddedildi,
        IptalEdildi,
        Tamamlandı
    }
}