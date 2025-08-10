using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DietManagement.Api.Data;
using DietManagement.Api.Data.Entities;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace DietManagement.Api.Tests;

public class ClientsEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public ClientsEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_And_Get_Client_By_Id_Works()
    {
        var client = _factory.CreateClient();

        // Arrange: seed a dietician user id and set Authorization header
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create client
        var createReq = new
        {
            FirstName = "John",
            LastName = "Doe",
            Email = $"john{Guid.NewGuid():N}@example.com",
            Phone = "1234567890",
            Gender = "Male",
            HasCard = true
        };

        var createRes = await client.PostAsJsonAsync("/api/clients", createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdJson = await createRes.Content.ReadAsStringAsync();
        Guid createdId;
        using (var doc = JsonDocument.Parse(createdJson))
        {
            createdId = Guid.Parse(doc.RootElement.GetProperty("id").GetRawText().Trim('"'));
        }

        // Fetch by id
        var getRes = await client.GetAsync($"/api/clients/{createdId}");
        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
