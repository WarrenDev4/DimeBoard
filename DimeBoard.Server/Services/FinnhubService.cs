using System.Net.Http.Json;


public class Quote
{
    public decimal c { get; set; }  
    public decimal h { get; set; } 
    public decimal l { get; set; }
    public decimal o { get; set; }  
    public decimal pc { get; set; } 
    public decimal dp { get; set; }  
    public decimal d { get; set; }  
}

public class CryptoSymbol
{
    public string description { get; set; } = "";
    public string displaySymbol { get; set; } = "";
    public string symbol { get; set; } = "";
}

public class NewsArticle
{
    public string category { get; set; } = "general";
    public string headline { get; set; } = "";
    public string summary { get; set; } = "";
    public string source { get; set; } = "";
    public string url { get; set; } = "";
    public string image { get; set; } = "";
    public long datetime { get; set; }
    public DateTime PublishedAt =>
        DateTimeOffset.FromUnixTimeSeconds(datetime).UtcDateTime;
}

public class FinnhubService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly ILogger<FinnhubService> _logger;

    public FinnhubService(IConfiguration config, HttpClient http, ILogger<FinnhubService> logger)
    {
        _http = http;
        _logger = logger; 

        _apiKey = config["Finnhub:ApiKey"] ?? "";
        if (string.IsNullOrEmpty(_apiKey))
            _logger.LogWarning("Finnhub:ApiKey is missing — stock/crypto data will be unavailable");

        _http.DefaultRequestHeaders.UserAgent.ParseAdd("DimeBoard/1.0");
        _http.Timeout = TimeSpan.FromSeconds(15);
    }


    public async Task<Quote?> GetQuoteAsync(string symbol) =>
        await FetchJsonAsync<Quote>(
            $"https://finnhub.io/api/v1/quote?symbol={Uri.EscapeDataString(symbol)}&token={_apiKey}",
            $"quote for {symbol}");

    public Task<Quote?> GetCryptoQuoteAsync(string symbol) => GetQuoteAsync(symbol);


    public async Task<List<NewsArticle>> GetMarketNewsAsync(string category = "general")
    {
        var url = $"https://finnhub.io/api/v1/news?category={category}&token={_apiKey}";
        var result = await FetchJsonAsync<List<NewsArticle>>(url, $"{category} news");
        return result ?? new List<NewsArticle>();
    }


    public async Task<List<NewsArticle>> GetCompanyNewsAsync(string symbol, DateTime from, DateTime to)
    {
        var url = $"https://finnhub.io/api/v1/company-news" +
                  $"?symbol={Uri.EscapeDataString(symbol)}" +
                  $"&from={from:yyyy-MM-dd}&to={to:yyyy-MM-dd}" +
                  $"&token={_apiKey}";
        var result = await FetchJsonAsync<List<NewsArticle>>(url, $"company news for {symbol}");
        return result ?? new List<NewsArticle>();
    }


    public async Task<List<CryptoSymbol>> GetCryptoSymbolsAsync()
    {
        var result = await FetchJsonAsync<List<CryptoSymbol>>(
            $"https://finnhub.io/api/v1/crypto/symbol?exchange=BINANCE&token={_apiKey}",
            "crypto symbols");
        return result ?? new List<CryptoSymbol>();
    }


    public async Task<object?> GetCryptoCandlesAsync(string symbol, string resolution, long from, long to)
    {
        var url = $"https://finnhub.io/api/v1/crypto/candle" +
                  $"?symbol={Uri.EscapeDataString(symbol)}&resolution={resolution}" +
                  $"&from={from}&to={to}&token={_apiKey}";
        return await FetchJsonAsync<object>(url, $"candles for {symbol}");
    }


    private async Task<T?> FetchJsonAsync<T>(string url, string label)
    {
        try
        {
            _logger.LogInformation("Fetching {Label}", label);
            var response = await _http.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Finnhub returned {StatusCode} for {Label}", response.StatusCode, label);
                return default;
            }

            return await response.Content.ReadFromJsonAsync<T>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching {Label}", label);
            return default;
        }
    }
}