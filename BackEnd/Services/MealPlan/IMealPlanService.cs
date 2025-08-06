using DietManagement.Api.Models;

namespace DietManagement.Api.Services;

public interface IMealPlanService
{
    Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request);
    Task<MealPlanResponse?> GetByIdAsync(Guid id);
}