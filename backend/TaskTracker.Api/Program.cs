using TaskTracker.Api.Data;
using TaskTracker.Api.Models;
using TaskTracker.Api.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("TaskDb"));

 builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });

builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpLogging();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Tasks.AddRange(
        new TaskItem
        {
            Title = "Initial task",
            Description = "Seeded task",
            Status = TaskTracker.Api.Models.TaskStatus.InProgress,
            Priority = TaskTracker.Api.Models.TaskPriority.High,
            DueDate = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        },
        new TaskItem
        {
            Title = "Another task",
             Description = "Seeded task 2",
            Status = TaskTracker.Api.Models.TaskStatus.InProgress,
            Priority = TaskTracker.Api.Models.TaskPriority.High,
            DueDate = DateTime.UtcNow.AddDays(3),
            CreatedAt = DateTime.UtcNow
        }
    );

    db.SaveChanges();
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        var problem = new ProblemDetails
        {
            Type = "https://httpstatuses.com/400",
            Title = "Request validation error",
            Status = StatusCodes.Status400BadRequest,
            Detail = exception?.Message
        };

        context.Response.StatusCode = problem.Status.Value;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problem);
    });
});

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();