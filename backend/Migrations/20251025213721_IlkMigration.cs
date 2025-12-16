using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace backend.Migrations
{
    public partial class IlkMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    KullaniciID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ad = table.Column<string>(type: "text", nullable: true),
                    Soyad = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    SifreHash = table.Column<string>(type: "text", nullable: true),
                    KayitTarihi = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.KullaniciID);
                });

            migrationBuilder.CreateTable(
                name: "Roller",
                columns: table => new
                {
                    RolID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RolAdi = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.RolID);
                });

            migrationBuilder.CreateTable(
                name: "Laboratuvarlar",
                columns: table => new
                {
                    LabID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LabAdi = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Aciklama = table.Column<string>(type: "text", nullable: true),
                    SorumluID = table.Column<int>(type: "integer", nullable: false),
                    Aktif = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Laboratuvarlar", x => x.LabID);
                    table.ForeignKey(
                        name: "FK_Laboratuvarlar_Kullanicilar_SorumluID",
                        column: x => x.SorumluID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KullaniciRolleri",
                columns: table => new
                {
                    KullaniciID = table.Column<int>(type: "integer", nullable: false),
                    RolID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KullaniciRolleri", x => new { x.KullaniciID, x.RolID });
                    table.ForeignKey(
                        name: "FK_KullaniciRolleri_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KullaniciRolleri_Roller_RolID",
                        column: x => x.RolID,
                        principalTable: "Roller",
                        principalColumn: "RolID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ekipmanlar",
                columns: table => new
                {
                    EkipmanID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LabID = table.Column<int>(type: "integer", nullable: false),
                    EkipmanAdi = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Aciklama = table.Column<string>(type: "text", nullable: true),
                    Lokasyon = table.Column<string>(type: "text", nullable: true),
                    Durum = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ekipmanlar", x => x.EkipmanID);
                    table.ForeignKey(
                        name: "FK_Ekipmanlar_Laboratuvarlar_LabID",
                        column: x => x.LabID,
                        principalTable: "Laboratuvarlar",
                        principalColumn: "LabID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Rezervasyonlar",
                columns: table => new
                {
                    RezervasyonID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    KullaniciID = table.Column<int>(type: "integer", nullable: false),
                    EkipmanID = table.Column<int>(type: "integer", nullable: false),
                    BaslangicTarihi = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    BitisTarihi = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Durum = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rezervasyonlar", x => x.RezervasyonID);
                    table.ForeignKey(
                        name: "FK_Rezervasyonlar_Ekipmanlar_EkipmanID",
                        column: x => x.EkipmanID,
                        principalTable: "Ekipmanlar",
                        principalColumn: "EkipmanID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rezervasyonlar_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Raporlar",
                columns: table => new
                {
                    RaporID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RezervasyonID = table.Column<int>(type: "integer", nullable: false),
                    YukleyenID = table.Column<int>(type: "integer", nullable: false),
                    RaporBasligi = table.Column<string>(type: "text", nullable: false),
                    DosyaYolu = table.Column<string>(type: "text", nullable: false),
                    DosyaAdi = table.Column<string>(type: "text", nullable: true),
                    YuklenmeTarihi = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Raporlar", x => x.RaporID);
                    table.ForeignKey(
                        name: "FK_Raporlar_Kullanicilar_YukleyenID",
                        column: x => x.YukleyenID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Raporlar_Rezervasyonlar_RezervasyonID",
                        column: x => x.RezervasyonID,
                        principalTable: "Rezervasyonlar",
                        principalColumn: "RezervasyonID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ekipmanlar_LabID",
                table: "Ekipmanlar",
                column: "LabID");

            migrationBuilder.CreateIndex(
                name: "IX_KullaniciRolleri_RolID",
                table: "KullaniciRolleri",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "IX_Laboratuvarlar_SorumluID",
                table: "Laboratuvarlar",
                column: "SorumluID");

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_RezervasyonID",
                table: "Raporlar",
                column: "RezervasyonID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_YukleyenID",
                table: "Raporlar",
                column: "YukleyenID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_EkipmanID",
                table: "Rezervasyonlar",
                column: "EkipmanID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_KullaniciID",
                table: "Rezervasyonlar",
                column: "KullaniciID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KullaniciRolleri");

            migrationBuilder.DropTable(
                name: "Raporlar");

            migrationBuilder.DropTable(
                name: "Roller");

            migrationBuilder.DropTable(
                name: "Rezervasyonlar");

            migrationBuilder.DropTable(
                name: "Ekipmanlar");

            migrationBuilder.DropTable(
                name: "Laboratuvarlar");

            migrationBuilder.DropTable(
                name: "Kullanicilar");
        }
    }
}
