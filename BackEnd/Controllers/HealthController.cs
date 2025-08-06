using Microsoft.AspNetCore.Mvc;
using DietManagement.Api;

namespace DietManagement.Api.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet(ApiEndpoints.Health.Get)]
    public IActionResult Get() => Ok(new { status = "Healthy" });
}