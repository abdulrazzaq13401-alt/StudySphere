using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using StudySphere.API.Context;

#nullable disable

namespace StudySphere.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260424153000_RepairResourceSchema")]
    public class RepairResourceSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'ContentType') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [ContentType] nvarchar(150) NOT NULL CONSTRAINT [DF_Resources_ContentType] DEFAULT N'application/octet-stream';
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'CreatedAt') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [CreatedAt] datetime2 NOT NULL CONSTRAINT [DF_Resources_CreatedAt] DEFAULT GETUTCDATE();
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'Downloads') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [Downloads] int NOT NULL CONSTRAINT [DF_Resources_Downloads] DEFAULT(0);
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'FileSize') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [FileSize] bigint NOT NULL CONSTRAINT [DF_Resources_FileSize] DEFAULT(0);
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'OriginalFileName') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [OriginalFileName] nvarchar(260) NOT NULL CONSTRAINT [DF_Resources_OriginalFileName] DEFAULT N'';
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'ResourceType') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [ResourceType] int NOT NULL CONSTRAINT [DF_Resources_ResourceType] DEFAULT(1);
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'StoredFileName') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [StoredFileName] nvarchar(200) NOT NULL CONSTRAINT [DF_Resources_StoredFileName] DEFAULT N'';
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'StoredFilePath') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [StoredFilePath] nvarchar(400) NOT NULL CONSTRAINT [DF_Resources_StoredFilePath] DEFAULT N'';
                END
                """);

            migrationBuilder.Sql(
                """
                IF COL_LENGTH('Resources', 'UpdatedAt') IS NULL
                BEGIN
                    ALTER TABLE [Resources] ADD [UpdatedAt] datetime2 NOT NULL CONSTRAINT [DF_Resources_UpdatedAt] DEFAULT GETUTCDATE();
                END
                """);

            migrationBuilder.Sql(
                """
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'[Resources]')
                      AND name = 'Title'
                      AND is_nullable = 1
                )
                BEGIN
                    UPDATE [Resources] SET [Title] = N'' WHERE [Title] IS NULL;
                    ALTER TABLE [Resources] ALTER COLUMN [Title] nvarchar(250) NOT NULL;
                END
                """);

            migrationBuilder.Sql(
                """
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'[Resources]')
                      AND name = 'Description'
                )
                BEGIN
                    ALTER TABLE [Resources] ALTER COLUMN [Description] nvarchar(2000) NULL;
                END
                """);

            migrationBuilder.Sql(
                """
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = 'IX_Resources_ResourceType'
                      AND object_id = OBJECT_ID(N'[Resources]')
                )
                BEGIN
                    CREATE INDEX [IX_Resources_ResourceType] ON [Resources]([ResourceType]);
                END
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
