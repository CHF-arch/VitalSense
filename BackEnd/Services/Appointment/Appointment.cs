using DietManagement.Api.Data;
using DietManagement.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DietManagement.Api.Services;

public class AppointmentService : IAppointmentService
{
	private readonly AppDbContext _context;

	public AppointmentService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<Appointment?> GetByIdAsync(Guid appointmentId)
		=> await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);

	public async Task<Appointment> CreateAsync(Appointment appointment)
	{
		if (appointment.Id == Guid.Empty)
		{
			appointment.Id = Guid.NewGuid();
		}

		await _context.Appointments.AddAsync(appointment);
		await _context.SaveChangesAsync();
		return appointment;
	}

	public async Task<Appointment?> UpdateAsync(Guid appointmentId, Appointment updated)
	{
		var existing = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);
		if (existing == null) return null;

		existing.Title = updated.Title;
		existing.Start = updated.Start;
		existing.End = updated.End;
		existing.AllDay = updated.AllDay;
		existing.ClientId = updated.ClientId;
		// DieticianId should remain as originally set for security; controller checks ownership.

		await _context.SaveChangesAsync();
		return existing;
	}

	public async Task<bool> DeleteAsync(Guid appointmentId)
	{
		var appt = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);
		if (appt == null) return false;
		_context.Appointments.Remove(appt);
		await _context.SaveChangesAsync();
		return true;
	}

	public async Task<IEnumerable<Appointment>> GetAllByDieticianAsync(Guid dieticianId)
	{
		return await _context.Appointments
			.Where(a => a.DieticianId == dieticianId)
			.OrderBy(a => a.Start)
			.ToListAsync();
	}
}

