# BackEnd Integration Tests

This project contains xUnit integration tests for the ASP.NET Core API using WebApplicationFactory and EF Core InMemory.

How to run:
- From the repository root, run `dotnet test`.

What is covered:
- /api/health returns 200 and payload
- Auth: register, login, refresh token
- Clients: create and fetch by id (with JWT)
- MealPlans: create, get by id, and list by client (with JWT)

Notes:
- Program.cs conditionally skips HTTPS redirection when ASPNETCORE_ENVIRONMENT=Testing.
- EF Core InMemory is used during tests; migrations are not executed.
