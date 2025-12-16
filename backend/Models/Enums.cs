namespace backend.Models // namespace'inizin doğru olduğundan emin olun
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