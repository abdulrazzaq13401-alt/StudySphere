using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudySphere.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentSlugAndIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Department",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Department",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE Department
                SET Slug = LOWER(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(LTRIM(RTRIM(ISNULL(Name, ''))), '&', 'and'),
                            '''', ''),
                        ' ', '-'),
                    '--', '-'))
                WHERE Slug IS NULL OR LTRIM(RTRIM(Slug)) = '';
                """);

            migrationBuilder.Sql(
                """
                UPDATE Department
                SET Slug = CONCAT('department-', Id)
                WHERE Slug IS NULL OR LTRIM(RTRIM(Slug)) = '';
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Department",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Department_Slug",
                table: "Department",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Department_Slug",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Department");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Department",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);
        }
    }
}
