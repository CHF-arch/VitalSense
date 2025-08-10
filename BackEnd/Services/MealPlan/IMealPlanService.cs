using DietManagement.Api.Models;

namespace DietManagement.Api.Services;

public interface IMealPlanService
{
    Task<List<MealPlanResponse>> GetAllAsync(Guid clientId);
    Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request);
    Task<MealPlanResponse?> GetByIdAsync(Guid mealPlanId);
    Task<MealPlanResponse?> GetActiveMealPlanAsync(Guid clientId);
}