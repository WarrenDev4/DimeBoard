using System.Net.Http.Headers;
using System.Net.Http.Json;

public class FinnhubService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public FinnhubService(IConfiguration config, HttpClient http)
    {
        _http = http;
        _apiKey = config["Finnhub:ApiKey"]
            ?? throw new Exception("Finnhub API key is NULL. Check appsettings.json");
    }

    public async Task<object?> GetMarketStatusAsync()
    {
        var url = $"https://finnhub.io/api/v1/market/status?exchange=US&token={_apiKey}";
        return await _http.GetFromJsonAsync<object>(url);
    }

    public async Task<object?> GetCryptoPricesAsync()
    {
        var url = $"https://finnhub.io/api/v1/crypto/symbol?exchange=BINANCE&token={_apiKey}";
        return await _http.GetFromJsonAsync<object>(url);
    }
}
