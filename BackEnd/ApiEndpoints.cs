namespace DietManagement.Api;

public static class ApiEndpoints
{
    private const string ApiBase = "api";

    public static class Users
    {
        private const string Base = $"{ApiBase}/auth";

        public const string Login = $"{Base}/login";
        public const string Register = $"{Base}/register";
        public const string RefreshToken = $"{Base}/refresh";
        public const string Me = $"{Base}/me";
    }

    public static class Clients
    {
        private const string Base = $"{ApiBase}/clients";
        public const string Create = $"{Base}";
        public const string GetAll = $"{Base}";
        public const string GetById = $"{Base}/{{clientId}}";
        public const string Edit = $"{Base}/{{clientId}}";
        public const string Delete = $"{Base}/{{clientId}}";
    }

    public static class MealPlans
    {
    private const string Base = $"{ApiBase}/meal-plans";
    public const string Create = $"{Base}";
    public const string GetById = $"{Base}/{{mealPlanId}}";
    public const string GetByClientId = $"{Base}/client/{{clientId}}";
    public const string GetActiveByClientId = $"{Base}/{{clientId}}/active";
    }

    public static class Health
    {
        private const string Base = $"{ApiBase}/health";
        public const string Get = $"{Base}";
    }
}