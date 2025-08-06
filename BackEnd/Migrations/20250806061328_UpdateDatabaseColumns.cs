using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RefreshTokenExpiry",
                table: "Users",
                newName: "refresh_token_expiry");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "Users",
                newName: "refresh_token");

            migrationBuilder.RenameColumn(
                name: "PasswordSalt",
                table: "Users",
                newName: "password_salt");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "LastLogin",
                table: "Users",
                newName: "last_login");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Clients",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Clients",
                newName: "notes");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Clients",
                newName: "gender");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Clients",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Clients",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Clients",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Clients",
                newName: "last_name");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Clients",
                newName: "first_name");

            migrationBuilder.RenameColumn(
                name: "DateOfBirth",
                table: "Clients",
                newName: "date_of_birth");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Clients",
                newName: "created_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "refresh_token_expiry",
                table: "Users",
                newName: "RefreshTokenExpiry");

            migrationBuilder.RenameColumn(
                name: "refresh_token",
                table: "Users",
                newName: "RefreshToken");

            migrationBuilder.RenameColumn(
                name: "password_salt",
                table: "Users",
                newName: "PasswordSalt");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "Users",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "last_login",
                table: "Users",
                newName: "LastLogin");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "Clients",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "Clients",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "gender",
                table: "Clients",
                newName: "Gender");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Clients",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Clients",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Clients",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "last_name",
                table: "Clients",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "Clients",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "date_of_birth",
                table: "Clients",
                newName: "DateOfBirth");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Clients",
                newName: "CreatedAt");
        }
    }
}
