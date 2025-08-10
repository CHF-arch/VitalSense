using DietManagement.Api.Models.Tasks;

namespace DietManagement.Api.Services;

public interface ITaskService
{
    Task<TaskResponse> CreateAsync(Guid dieticianId, CreateTaskRequest request);
    Task<IEnumerable<TaskResponse>> GetAllAsync(Guid dieticianId);
    Task<TaskResponse?> GetByIdAsync(Guid dieticianId, Guid taskId);
    Task<TaskResponse?> ToggleCompleteAsync(Guid dieticianId, Guid taskId);
    Task<bool> DeleteAsync(Guid dieticianId, Guid taskId);
}
