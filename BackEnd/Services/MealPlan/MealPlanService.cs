using DietManagement.Api.Data;
using DietManagement.Api.Data.Entities;
using DietManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DietManagement.Api.Services;

public class MealPlanService : IMealPlanService
{
    private readonly AppDbContext _context;

    public MealPlanService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request)
    {
        var mealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            DieticianId = request.DieticianId,
            ClientId = request.ClientId,
            Days = request.Days.Select(day => new MealDay
            {
                Id = Guid.NewGuid(),
                Title = day.Title,
                Meals = day.Meals.Select(meal => new Meal
                {
                    Id = Guid.NewGuid(),
                    Title = meal.Title,
                    Time = meal.Time ?? "",
                    Description = meal.Description,
                    Protein = meal.Protein,
                    Carbs = meal.Carbs,
                    Fats = meal.Fats,
                    Calories = meal.Calories
                }).ToList()
            }).ToList()
        };

        _context.MealPlans.Add(mealPlan);
        await _context.SaveChangesAsync();

        return new MealPlanResponse
        {
            Id = mealPlan.Id,
            Title = mealPlan.Title,
            StartDate = mealPlan.StartDate,
            EndDate = mealPlan.EndDate,
            DieticianId = mealPlan.DieticianId,
            ClientId = mealPlan.ClientId,
            Days = mealPlan.Days.Select(d => new MealDayResponse
            {
                Id = d.Id,
                Title = d.Title,
                Meals = d.Meals.Select(m => new MealResponse
                {
                    Id = m.Id,
                    Title = m.Title,
                    Time = m.Time,
                    Description = m.Description,
                    Protein = m.Protein,
                    Carbs = m.Carbs,
                    Fats = m.Fats,
                    Calories = m.Calories
                }).ToList()
            }).ToList()
        };
    }

    public async Task<MealPlanResponse?> GetByIdAsync(Guid id)
    {
        var mealPlan = await _context.MealPlans
            .Include(mp => mp.Days)
                .ThenInclude(d => d.Meals)
            .FirstOrDefaultAsync(mp => mp.Id == id);

        if (mealPlan == null) return null;

        return new MealPlanResponse
        {
            Id = mealPlan.Id,
            Title = mealPlan.Title,
            StartDate = mealPlan.StartDate,
            EndDate = mealPlan.EndDate,
            DieticianId = mealPlan.DieticianId,
            ClientId = mealPlan.ClientId,
            Days = mealPlan.Days.Select(d => new MealDayResponse
            {
                Id = d.Id,
                Title = d.Title,
                Meals = d.Meals.Select(m => new MealResponse
                {
                    Id = m.Id,
                    Title = m.Title,
                    Time = m.Time,
                    Description = m.Description,
                    Protein = m.Protein,
                    Carbs = m.Carbs,
                    Fats = m.Fats,
                    Calories = m.Calories
                }).ToList()
            }).ToList()
        };
    }
}