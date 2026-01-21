using Microsoft.AspNetCore.Mvc;

namespace TaskTracker.Api.Controllers;


[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Backend is connected!");
    }
}