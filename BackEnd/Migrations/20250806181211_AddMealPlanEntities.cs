using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddMealPlanEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "meal_plans",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    start_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    end_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dietician_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    client_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_meal_plans", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "meal_days",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    meal_plan_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_meal_days", x => x.id);
                    table.ForeignKey(
                        name: "FK_meal_days_meal_plans_meal_plan_id",
                        column: x => x.meal_plan_id,
                        principalTable: "meal_plans",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "meals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    time = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    protein = table.Column<float>(type: "real", nullable: false),
                    carbs = table.Column<float>(type: "real", nullable: false),
                    fats = table.Column<float>(type: "real", nullable: false),
                    calories = table.Column<float>(type: "real", nullable: false),
                    meal_day_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_meals", x => x.id);
                    table.ForeignKey(
                        name: "FK_meals_meal_days_meal_day_id",
                        column: x => x.meal_day_id,
                        principalTable: "meal_days",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_meal_days_meal_plan_id",
                table: "meal_days",
                column: "meal_plan_id");

            migrationBuilder.CreateIndex(
                name: "IX_meals_meal_day_id",
                table: "meals",
                column: "meal_day_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "meals");

            migrationBuilder.DropTable(
                name: "meal_days");

            migrationBuilder.DropTable(
                name: "meal_plans");
        }
    }
}
