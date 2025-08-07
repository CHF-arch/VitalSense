using DietManagement.Api.Data;
using DietManagement.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DietManagement.Api.Services;

public class ClientService : IClientService
{
    private readonly AppDbContext _context;

    public ClientService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Client?> GetByIdAsync(Guid id)
        => await _context.Clients.FindAsync(id);

    public async Task<Client> CreateAsync(Client client)
    {
        client.Id = Guid.NewGuid();
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();
        return client;
    }

    public async Task<Client?> UpdateAsync(Guid id, Client updatedClient)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null) return null;

        client.FirstName = updatedClient.FirstName;
        client.LastName = updatedClient.LastName;
        client.Email = updatedClient.Email;
        client.Phone = updatedClient.Phone;
        client.DateOfBirth = updatedClient.DateOfBirth;
        client.Gender = updatedClient.Gender;
        client.HasCard = updatedClient.HasCard;
        client.Notes = updatedClient.Notes;
        client.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return client;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null) return false;

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Client>> GetAllByDieticianAsync(Guid dieticianId)
    {
        return await _context.Clients.Where(c => c.DieticianId == dieticianId).ToListAsync();
    }
}