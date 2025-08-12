using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class AppointmentEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AppointmentEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_And_Get_By_Date_Works()
    {
        var client = _factory.CreateClient();
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var start = DateTime.UtcNow.Date.AddHours(9);
        var end = start.AddHours(1);

        var createReq = new
        {
            Title = "Consultation",
            Start = start,
            End = end,
            AllDay = false,
            DieticianId = userId,
            ClientId = Guid.NewGuid()
        };

        var createRes = await client.PostAsJsonAsync("/api/appointments", createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);

        var dateString = start.ToString("yyyy-MM-dd");
        var getByDateRes = await client.GetAsync($"/api/appointments/date/{dateString}");
        getByDateRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await getByDateRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.ValueKind.Should().Be(JsonValueKind.Array);
        doc.RootElement.GetArrayLength().Should().BeGreaterOrEqualTo(1);
    }
}
