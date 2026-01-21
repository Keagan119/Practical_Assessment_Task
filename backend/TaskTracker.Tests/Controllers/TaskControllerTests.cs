using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskTracker.Api.Controllers;
using TaskTracker.Api.Data;
using TaskTracker.Api.Models;
using TaskStatus = TaskTracker.Api.Models.TaskStatus;  
using TaskPriority = TaskTracker.Api.Models.TaskPriority; 
using Microsoft.AspNetCore.Http;
using Xunit;

namespace TaskTracker.Tests.Controllers
{
    public class TaskControllerTests : IDisposable
    {
        private readonly AppDbContext _dbContext;
        private readonly TaskController _controller;

        public TaskControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
                .Options;

            _dbContext = new AppDbContext(options);
            SeedTestData(_dbContext);
            
            _controller = new TaskController(_dbContext);
        }

        private void SeedTestData(AppDbContext context)
        {
            if (!context.Tasks.Any())
            {
                context.Tasks.AddRange(
                    new TaskItem 
                    { 
                        Id = 1, 
                        Title = "Test Task 1", 
                        Status = TaskStatus.New, 
                        Priority = TaskPriority.Medium, 
                        CreatedAt = DateTime.UtcNow 
                    },
                    new TaskItem 
                    { 
                        Id = 2, 
                        Title = "Test Task 2", 
                        Status = TaskStatus.InProgress, 
                        Priority = TaskPriority.High, 
                        CreatedAt = DateTime.UtcNow 
                    }
                );
                context.SaveChanges();
            }
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Fact]
        public async Task GetTasks_ReturnsAllTasks()
        {
             
            var result = await _controller.GetTasks(null, null);

             
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<TaskItem>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetTask_WithValidId_ReturnsTask()
        {
            // Arrange
            int testId = 1;

             
            var result = await _controller.GetTaskById(testId);

             
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<TaskItem>(actionResult.Value);
            Assert.Equal(testId, returnValue.Id);
        }

        [Fact]
        public async Task GetTask_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            int testId = 999;

             
            var result = await _controller.GetTaskById(testId);

             
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateTask_WithValidTask_ReturnsCreatedTask()
        {
            // Arrange
            var newTask = new TaskItem 
            { 
                Title = "New Test Task", 
                Status = TaskStatus.New, 
                Priority = TaskPriority.Low,
                Description = "Test Description"
            };

             
            var result = await _controller.CreateTask(newTask);

             
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<TaskItem>(actionResult.Value);
            Assert.Equal(newTask.Title, returnValue.Title);
            Assert.True(returnValue.Id > 0);
           
        }

      [Fact]
public async Task CreateTask_WithInvalidModel_ReturnsBadRequest()
{
    _controller.ModelState.AddModelError("Title", "Required");
    var newTask = new TaskItem();
    
var result = await _controller.CreateTask(newTask);

var objectResult = Assert.IsType<ObjectResult>(result.Result);

var problemDetails = Assert.IsType<ValidationProblemDetails>(objectResult.Value);


Assert.True(problemDetails.Errors.ContainsKey("Title"),
    "Expected validation error for Title field");
}

        [Fact]
        public async Task UpdateTask_WithValidData_ReturnsUpdatedTask()
        {
             
            var updatedTask = new TaskItem 
            { 
                Title = "Updated Task", 
                Status = TaskStatus.Done, 
                Priority = TaskPriority.High,
                Description = "Updated Description"
            };

             
            var result = await _controller.UpdateTask(1, updatedTask);

             
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<TaskItem>(actionResult.Value);
            Assert.Equal(1, returnValue.Id);
            Assert.Equal("Updated Task", returnValue.Title);
            Assert.Equal(TaskStatus.Done, returnValue.Status);
        }

        [Fact]
        public async Task DeleteTask_WithValidId_ReturnsNoContent()
        {
             
            var result = await _controller.DeleteTask(1);

             
            Assert.IsType<NoContentResult>(result);
            var checkResult = await _controller.GetTaskById(1);
            Assert.IsType<NotFoundResult>(checkResult.Result);
        }
    }
}