using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization; // EKLENDİ: Dil ayarları için gerekli
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization; // EKLENDİ: CultureInfo için gerekli
using backend.Data;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // 1. Veritabanı ve Servisler
            services.AddScoped<Services.ILaboratuvarService, Services.LaboratuvarService>();
            services.AddScoped<Services.IKullaniciService, Services.KullaniciService>();
            services.AddScoped<Services.IRezervasyonService, Services.RezervasyonService>();
            services.AddScoped<Services.IEkipmanService, Services.EkipmanService>();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            // 2. CORS Ayarları (DÜZELTİLDİ: Parantez hatası giderildi)
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            // 3. Localization Servisleri (CORS bloğunun dışına çıkarıldı)
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.AddControllers()
                    .AddDataAnnotationsLocalization(options =>
                    {
                        options.DataAnnotationLocalizerProvider = (type, factory) =>
                            factory.Create(typeof(SharedResource));
                    });

            // Not: AddControllersWithViews() kullandığın için ayrıca AddControllers() demene gerek yok.
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "backend", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend v1"));
            }

            // app.UseHttpsRedirection();

            app.UseStaticFiles(); // CSS/JS dosyaları için gereklidir (Login sayfası vs. için)

            // --- 4. DİL AYARLARI MIDDLEWARE (EKLENDİ) ---
            // Bu kısım UseRouting'den ÖNCE olmalıdır!
            var supportedCultures = new[] { "tr-TR", "en-US", "de-DE" };
            
            var localizationOptions = new RequestLocalizationOptions()
                .SetDefaultCulture("tr-TR") // Varsayılan dil
                .AddSupportedCultures(supportedCultures)
                .AddSupportedUICultures(supportedCultures);

            app.UseRequestLocalization(localizationOptions);
            // ---------------------------------------------

            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}