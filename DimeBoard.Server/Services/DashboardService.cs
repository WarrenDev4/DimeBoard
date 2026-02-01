public class DashboardService
{
    private readonly FinnhubService _finnhub;

    public DashboardService(FinnhubService finnhub)
    {
        _finnhub = finnhub;
    }

    public async Task<object> GetDashboardAsync()
    {
        return new
        {
            MarketStatus = await _finnhub.GetMarketStatusAsync(),
            Crypto = await _finnhub.GetCryptoPricesAsync(),
            Timestamp = DateTime.UtcNow
        };
    }
}
