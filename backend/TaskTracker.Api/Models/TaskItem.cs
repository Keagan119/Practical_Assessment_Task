using System;
using System.ComponentModel.DataAnnotations;
namespace TaskTracker.Api.Models
{
    public enum TaskStatus { New, InProgress, Done }
    public enum TaskPriority { Low, Medium, High }

    public class TaskItem
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string? Description { get; set; }
        [Required(ErrorMessage = "Status is required")]
        [EnumDataType(typeof(TaskStatus), ErrorMessage = "Invalid status value")]
        public TaskStatus Status { get; set; }
        [Required(ErrorMessage = "Priority is required")]
        [EnumDataType(typeof(TaskPriority), ErrorMessage = "Invalid priority value")]
        public TaskPriority Priority { get; set; }
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date format. Please use ISO-8601 format")]
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
