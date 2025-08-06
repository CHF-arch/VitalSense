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

    public async Task<IEnumerable<Client>> GetAllAsync()
        => await _context.Clients.ToListAsync();

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
}