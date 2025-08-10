using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class HealthEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public HealthEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Health_Returns_Healthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    doc.RootElement.GetProperty("status").GetString().Should().Be("Healthy");
    }
}
