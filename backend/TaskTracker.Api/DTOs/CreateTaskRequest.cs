public record CreateTaskRequest(
    string Title,
    string? Description,
    string Status,
    string Priority,
    DateTime? DueDate
);
