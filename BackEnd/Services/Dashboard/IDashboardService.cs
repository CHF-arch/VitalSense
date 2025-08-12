using DietManagement.Api.Models.Dashboard;

namespace DietManagement.Api.Services;

public interface IDashboardService
{
    Task<DashboardMetricsResponse> GetMetricsAsync(Guid dieticianId, DateTime utcNow);
}
