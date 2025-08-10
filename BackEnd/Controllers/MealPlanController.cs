using DietManagement.Api.Models;
using DietManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DietManagement.Api.Controllers;

[ApiController]
public class MealPlanController : ControllerBase
{
    private readonly IMealPlanService _mealPlanService;

    public MealPlanController(IMealPlanService mealPlanService)
    {
        _mealPlanService = mealPlanService;
    }

    [HttpPost(ApiEndpoints.MealPlans.Create)]
    [Authorize]
    [ProducesResponseType(typeof(MealPlanResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateMealPlanRequest request)
    {
        var result = await _mealPlanService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { mealPlanId = result.Id }, result);
    }

    [HttpGet(ApiEndpoints.MealPlans.GetById)]
    [ProducesResponseType(typeof(MealPlanResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid mealPlanId)
    {
        var mealPlan = await _mealPlanService.GetByIdAsync(mealPlanId);
        if (mealPlan == null)
            return NotFound();
        return Ok(mealPlan);
    }

    [HttpGet(ApiEndpoints.MealPlans.GetByClientId)]
    [ProducesResponseType(typeof(List<MealPlanResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMealPlansByClientId([FromRoute] Guid clientId)
    {
        var mealPlans = await _mealPlanService.GetAllAsync(clientId);
        return Ok(mealPlans);
    }

    [HttpGet(ApiEndpoints.MealPlans.GetActiveByClientId)]
        [ProducesResponseType(typeof(MealPlanResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetActiveMealPlan([FromRoute] Guid clientId)
        {
            var mealPlan = await _mealPlanService.GetActiveMealPlanAsync(clientId);
            if (mealPlan == null)
                return NotFound();
            return Ok(mealPlan);
        }
}