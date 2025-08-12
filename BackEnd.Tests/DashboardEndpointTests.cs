using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class DashboardEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public DashboardEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Metrics_Returns_Data()
    {
        var client = _factory.CreateClient();
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create one client this month
        var createClientReq = new
        {
            FirstName = "John",
            LastName = "Doe",
            Email = $"john{Guid.NewGuid()}@example.com",
            Phone = "1234567890",
            HasCard = false
        };
        var res = await client.PostAsJsonAsync("/api/clients", createClientReq);
        res.StatusCode.Should().Be(HttpStatusCode.Created);

        var metricsRes = await client.GetAsync("/api/dashboard/metrics");
        metricsRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var metrics = await metricsRes.Content.ReadFromJsonAsync<MetricsDto>();
        metrics.Should().NotBeNull();
        metrics!.TotalClients.Should().BeGreaterOrEqualTo(1);
        metrics.NewClientsThisMonth.Should().BeGreaterOrEqualTo(1);
    }

    private class MetricsDto
    {
        public int TotalClients { get; set; }
        public int ActiveClients { get; set; }
        public int NewClientsThisMonth { get; set; }
        public int NewClientsLastMonth { get; set; }
        public double NewClientsChangePercent { get; set; }
    }
}
