using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class OnaylandiSutunuEkle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Onaylandi",
                table: "Kullanicilar",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Onaylandi",
                table: "Kullanicilar");
        }
    }
}
