using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class RaporYapisiGuncellendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Kullanicilar_YukleyenID",
                table: "Raporlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Rezervasyonlar_RezervasyonID",
                table: "Raporlar");

            migrationBuilder.DropIndex(
                name: "IX_Raporlar_RezervasyonID",
                table: "Raporlar");

            migrationBuilder.DropColumn(
                name: "RezervasyonID",
                table: "Raporlar");

            migrationBuilder.RenameColumn(
                name: "YukleyenID",
                table: "Raporlar",
                newName: "KullaniciID");

            migrationBuilder.RenameColumn(
                name: "YuklenmeTarihi",
                table: "Raporlar",
                newName: "YuklemeTarihi");

            migrationBuilder.RenameColumn(
                name: "RaporBasligi",
                table: "Raporlar",
                newName: "Baslik");

            migrationBuilder.RenameColumn(
                name: "DosyaAdi",
                table: "Raporlar",
                newName: "OrijinalDosyaAdi");

            migrationBuilder.RenameIndex(
                name: "IX_Raporlar_YukleyenID",
                table: "Raporlar",
                newName: "IX_Raporlar_KullaniciID");

            migrationBuilder.AddColumn<int>(
                name: "RaporID",
                table: "Rezervasyonlar",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DosyaYolu",
                table: "Raporlar",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "EkipmanID",
                table: "Raporlar",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LabID",
                table: "Raporlar",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LaboratuvarLabID",
                table: "Raporlar",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_RaporID",
                table: "Rezervasyonlar",
                column: "RaporID");

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_EkipmanID",
                table: "Raporlar",
                column: "EkipmanID");

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_LaboratuvarLabID",
                table: "Raporlar",
                column: "LaboratuvarLabID");

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Ekipmanlar_EkipmanID",
                table: "Raporlar",
                column: "EkipmanID",
                principalTable: "Ekipmanlar",
                principalColumn: "EkipmanID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Kullanicilar_KullaniciID",
                table: "Raporlar",
                column: "KullaniciID",
                principalTable: "Kullanicilar",
                principalColumn: "KullaniciID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LaboratuvarLabID",
                table: "Raporlar",
                column: "LaboratuvarLabID",
                principalTable: "Laboratuvarlar",
                principalColumn: "LabID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Rezervasyonlar_Raporlar_RaporID",
                table: "Rezervasyonlar",
                column: "RaporID",
                principalTable: "Raporlar",
                principalColumn: "RaporID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Ekipmanlar_EkipmanID",
                table: "Raporlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Kullanicilar_KullaniciID",
                table: "Raporlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Rezervasyonlar_Raporlar_RaporID",
                table: "Rezervasyonlar");

            migrationBuilder.DropIndex(
                name: "IX_Rezervasyonlar_RaporID",
                table: "Rezervasyonlar");

            migrationBuilder.DropIndex(
                name: "IX_Raporlar_EkipmanID",
                table: "Raporlar");

            migrationBuilder.DropIndex(
                name: "IX_Raporlar_LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.DropColumn(
                name: "RaporID",
                table: "Rezervasyonlar");

            migrationBuilder.DropColumn(
                name: "EkipmanID",
                table: "Raporlar");

            migrationBuilder.DropColumn(
                name: "LabID",
                table: "Raporlar");

            migrationBuilder.DropColumn(
                name: "LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.RenameColumn(
                name: "YuklemeTarihi",
                table: "Raporlar",
                newName: "YuklenmeTarihi");

            migrationBuilder.RenameColumn(
                name: "OrijinalDosyaAdi",
                table: "Raporlar",
                newName: "DosyaAdi");

            migrationBuilder.RenameColumn(
                name: "KullaniciID",
                table: "Raporlar",
                newName: "YukleyenID");

            migrationBuilder.RenameColumn(
                name: "Baslik",
                table: "Raporlar",
                newName: "RaporBasligi");

            migrationBuilder.RenameIndex(
                name: "IX_Raporlar_KullaniciID",
                table: "Raporlar",
                newName: "IX_Raporlar_YukleyenID");

            migrationBuilder.AlterColumn<string>(
                name: "DosyaYolu",
                table: "Raporlar",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RezervasyonID",
                table: "Raporlar",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_RezervasyonID",
                table: "Raporlar",
                column: "RezervasyonID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Kullanicilar_YukleyenID",
                table: "Raporlar",
                column: "YukleyenID",
                principalTable: "Kullanicilar",
                principalColumn: "KullaniciID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Rezervasyonlar_RezervasyonID",
                table: "Raporlar",
                column: "RezervasyonID",
                principalTable: "Rezervasyonlar",
                principalColumn: "RezervasyonID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
