using System.ComponentModel.DataAnnotations;

namespace DietManagement.Api.Models.Tasks;

public class CreateTaskRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public Guid? ClientId { get; set; }
}
