using Microsoft.EntityFrameworkCore;
using backend.Models;
// DbContext sınıfı, Microsoft.EntityFrameworkCore kütüphanesinden gelir
namespace backend.Data
{
    public class ApplicationDbContext : DbContext
{
    // 1. Yapılandırıcı (Constructor)
    // Bu veritabanı bağlantı ayarlarını alabilmesi için gereklidir.
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // 2. DbSet'ler (Tablolar)
    // Veritabanında oluşturulmasını istediğimiz her tablo için
    // bir DbSet özelliği ekleriz.

    public DbSet<Kullanici> Kullanicilar { get; set; }
    public DbSet<Rol> Roller { get; set; }
    public DbSet<KullaniciRol> KullaniciRolleri { get; set; }
    public DbSet<Laboratuvar> Laboratuvarlar { get; set; }
    public DbSet<Ekipman> Ekipmanlar { get; set; }
    public DbSet<Rezervasyon> Rezervasyonlar { get; set; }
    public DbSet<Rapor> Raporlar { get; set; }


    // 3. Model Yapılandırması
    // EF Core'un varsayılan olarak anlayamadığı karmaşık ilişkileri
    // (örneğin bizim çok-çok ilişkimiz) yapılandırmak için bu metodu ezeriz (override).
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // KullaniciRol tablosu için BİLEŞİK ANAHTAR (Composite Key) tanımlaması
        // Diyoruz ki: "KullaniciRolleri tablosunun anahtarı, hem
        // KullaniciID hem de RolID sütunlarının birleşiminden oluşur."
        modelBuilder.Entity<KullaniciRol>()
            .HasKey(kr => new { kr.KullaniciID, kr.RolID });

        // Kullanici <-> KullaniciRol ilişkisi
        modelBuilder.Entity<KullaniciRol>()
            .HasOne(kr => kr.Kullanici)
            .WithMany(k => k.KullaniciRolleri)
            .HasForeignKey(kr => kr.KullaniciID);

        // Rol <-> KullaniciRol ilişkisi
        modelBuilder.Entity<KullaniciRol>()
            .HasOne(kr => kr.Rol)
            .WithMany(r => r.KullaniciRolleri)
            .HasForeignKey(kr => kr.RolID);

        // Silme davranışlarını ayarlama
        // Bir Laboratuvar silinirse,içindeki ekipmanların ne olacağını belirler.
        // Restrict dersek önce ekipmanları silmeden laboratuvarı silemezsiniz.
        // Bu veri güvenliği sağlar.
        modelBuilder.Entity<Ekipman>()
            .HasOne(e => e.Laboratuvar)
            .WithMany(l => l.Ekipmanlar)
            .OnDelete(DeleteBehavior.Restrict); // veya .OnDelete(DeleteBehavior.SetNull)

        modelBuilder.Entity<Rezervasyon>()
            .HasOne(r => r.Ekipman)
            .WithMany(e => e.Rezervasyonlar)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
}
