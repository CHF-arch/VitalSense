using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class MealPlanEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public MealPlanEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_And_Get_MealPlan_Works()
    {
        var client = _factory.CreateClient();
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var request = new
        {
            Title = "Weekly plan",
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddDays(6),
            DieticianId = userId,
            ClientId = Guid.NewGuid(),
            Days = new[]
            {
                new {
                    Title = "Day 1",
                    Meals = new[]
                    {
                        new { Title = "Breakfast", Time = "08:00", Description = "Oats", Protein = 10, Carbs = 30, Fats = 5, Calories = 250f },
                        new { Title = "Lunch", Time = "12:30", Description = "Chicken", Protein = 35, Carbs = 40, Fats = 12, Calories = 500f }
                    }
                }
            }
        };

        var createRes = await client.PostAsJsonAsync("/api/meal-plans", request);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdJson = await createRes.Content.ReadAsStringAsync();
        Guid mealPlanId;
        using (var doc = JsonDocument.Parse(createdJson))
        {
            mealPlanId = Guid.Parse(doc.RootElement.GetProperty("id").GetRawText().Trim('"'));
        }

        var getRes = await client.GetAsync($"/api/meal-plans/{mealPlanId}");
        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
