using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class ResimEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResimUrl",
                table: "Ekipmanlar",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResimUrl",
                table: "Ekipmanlar");
        }
    }
}
