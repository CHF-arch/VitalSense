using DietManagement.Api.Data.Entities;

namespace DietManagement.Api.Services;

public interface IClientService
{
    Task<Client?> GetByIdAsync(Guid id);
    Task<Client> CreateAsync(Client client);
    Task<Client?> UpdateAsync(Guid id, Client client);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<Client>> GetAllByDieticianAsync(Guid dieticianId);
}