using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class ClientSearchEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public ClientSearchEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Search_Returns_Expected_Client()
    {
        var http = _factory.CreateClient();
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create a client
        var createReq = new {
            FirstName = "Alice",
            LastName = "Zimmer",
            Email = $"alice{Guid.NewGuid():N}@example.com",
            Phone = "1234567890",
            Gender = "Female",
            HasCard = true
        };
        var createRes = await http.PostAsJsonAsync("/api/clients", createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);

        // Search
        var searchRes = await http.GetAsync("/api/clients/search?q=Ali");
        searchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await searchRes.Content.ReadAsStringAsync();
        content.Should().Contain("Alice");
    }
}
