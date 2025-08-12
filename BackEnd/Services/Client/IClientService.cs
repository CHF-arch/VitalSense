using DietManagement.Api.Data.Entities;

namespace DietManagement.Api.Services;

public interface IClientService
{
    Task<Client?> GetByIdAsync(Guid clientId);
    Task<Client> CreateAsync(Client client);
    Task<Client?> UpdateAsync(Guid clientId, Client client);
    Task<bool> DeleteAsync(Guid clientId);
    Task<IEnumerable<Client>> GetAllByDieticianAsync(Guid dieticianId);
    Task<IEnumerable<Client>> SearchAsync(Guid dieticianId, string query, int limit = 20);
}