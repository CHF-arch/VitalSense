using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DietManagement.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace DietManagement.Api.Tests;

public class TasksEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public TasksEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_List_Toggle_Delete_Task_Works()
    {
        var client = _factory.CreateClient();
        var userId = Guid.NewGuid();
        var token = JwtHelper.CreateTestToken("your-very-very-secret-and-long-key-1234567890", "your-app-name", "your-app-audience", userId);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create
        var createReq = new { Title = "Buy groceries", Description = "Milk, eggs", DueDate = DateTime.UtcNow.Date.AddDays(1) };
        var createRes = await client.PostAsJsonAsync("/api/tasks", createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var createJson = await createRes.Content.ReadAsStringAsync();
        Guid taskId;
        using (var doc = JsonDocument.Parse(createJson))
        {
            taskId = Guid.Parse(doc.RootElement.GetProperty("id").GetRawText().Trim('"'));
        }

        // List
        var listRes = await client.GetAsync("/api/tasks");
        listRes.StatusCode.Should().Be(HttpStatusCode.OK);

        // Toggle
        var toggleRes = await client.PostAsync($"/api/tasks/{taskId}/toggle", null);
        toggleRes.StatusCode.Should().Be(HttpStatusCode.OK);

        // Delete
        var delRes = await client.DeleteAsync($"/api/tasks/{taskId}");
        delRes.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Get by id should be 404
        var getRes = await client.GetAsync($"/api/tasks/{taskId}");
        getRes.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
