using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.Models;
namespace TaskTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TaskController(AppDbContext db)
        {
            _db = db;
        }

     
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var tasks = await _db.Tasks.ToListAsync();
            return Ok(tasks);
        }

      
        [HttpPost]
public async Task<ActionResult<TaskItem>> CreateTask([FromBody] TaskItem task)
{
    task.CreatedAt = DateTime.UtcNow;
    _db.Tasks.Add(task);
    await _db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
}

        /
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTaskById(int id)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

       
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItem>> UpdateTask(int id, TaskItem updatedTask)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Status = updatedTask.Status;
            task.Priority = updatedTask.Priority;
            task.DueDate = updatedTask.DueDate;

            await _db.SaveChangesAsync();
            return Ok(task);
        }

       
[HttpDelete("task-delete/{id}")]
public async Task<IActionResult> DeleteTask(int id)
{
    var task = await _db.Tasks.FindAsync(id);

    if (task == null)
    {
        return NotFound(new { message = $"Task with id {id} not found." });
    }

    _db.Tasks.Remove(task);
    await _db.SaveChangesAsync();

    return NoContent();
}

    }
}
