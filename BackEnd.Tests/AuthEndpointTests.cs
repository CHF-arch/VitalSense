using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class AuthEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Register_Then_Login_Succeeds()
    {
        var client = _factory.CreateClient();

        var registerRequest = new
        {
            Username = $"user_{Guid.NewGuid():N}",
            Email = $"user_{Guid.NewGuid():N}@example.com",
            Password = "P@ssword123",
            ConfirmPassword = "P@ssword123"
        };

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", registerRequest);
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var loginRequest = new { Username = registerRequest.Username, Password = registerRequest.Password };
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginJson = await loginResponse.Content.ReadAsStringAsync();
        using (var doc = JsonDocument.Parse(loginJson))
        {
            string? accessToken = doc.RootElement.GetProperty("accessToken").GetString();
            accessToken.Should().NotBeNullOrWhiteSpace();
        }
    }

    [Fact]
    public async Task RefreshToken_With_Valid_Token_Succeeds()
    {
        var client = _factory.CreateClient();

        var registerRequest = new
        {
            Username = $"user_{Guid.NewGuid():N}",
            Email = $"user_{Guid.NewGuid():N}@example.com",
            Password = "P@ssword123",
            ConfirmPassword = "P@ssword123"
        };

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", registerRequest);
        registerResponse.EnsureSuccessStatusCode();

        var loginRequest = new { Username = registerRequest.Username, Password = registerRequest.Password };
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();
        var loginJson = await loginResponse.Content.ReadAsStringAsync();
        string refreshToken;
        using (var doc = JsonDocument.Parse(loginJson))
        {
            refreshToken = doc.RootElement.GetProperty("refreshToken").GetString()!;
        }

        var refreshResponse = await client.PostAsJsonAsync("/api/auth/refresh", new { RefreshToken = refreshToken });
        refreshResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
