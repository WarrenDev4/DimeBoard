using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboard;

    public DashboardController(DashboardService dashboard)
    {
        _dashboard = dashboard;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var data = await _dashboard.GetDashboardAsync();
        return Ok(data);
    }
}
