using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class RaporIliskiDuzeltme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.DropIndex(
                name: "IX_Raporlar_LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.DropColumn(
                name: "LaboratuvarLabID",
                table: "Raporlar");

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_LabID",
                table: "Raporlar",
                column: "LabID");

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LabID",
                table: "Raporlar",
                column: "LabID",
                principalTable: "Laboratuvarlar",
                principalColumn: "LabID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LabID",
                table: "Raporlar");

            migrationBuilder.DropIndex(
                name: "IX_Raporlar_LabID",
                table: "Raporlar");

            migrationBuilder.AddColumn<int>(
                name: "LaboratuvarLabID",
                table: "Raporlar",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Raporlar_LaboratuvarLabID",
                table: "Raporlar",
                column: "LaboratuvarLabID");

            migrationBuilder.AddForeignKey(
                name: "FK_Raporlar_Laboratuvarlar_LaboratuvarLabID",
                table: "Raporlar",
                column: "LaboratuvarLabID",
                principalTable: "Laboratuvarlar",
                principalColumn: "LabID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
