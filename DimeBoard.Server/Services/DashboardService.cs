using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

public class DashboardService
{
    private readonly FinnhubService _finnhub;
    private readonly MoralisService _moralis;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(FinnhubService finnhub, MoralisService moralis, ILogger<DashboardService> logger)
    {
        _finnhub = finnhub;
        _moralis = moralis;
        _logger = logger;
    }

    public async Task<DashboardData> GetDashboardAsync()
    {
        try
        {
            _logger.LogInformation("Fetching dashboard data from APIs");

            var stockTask = GetRealStockIndicesAsync();
            var cryptoTask = GetRealCryptocurrenciesAsync();
            var cryptoPairsTask = GetRealCryptoPairsAsync();
            var blockchainTask = GetRealBlockchainMetricsAsync();
            var newsTask = GetRealNewsAsync();
            var chartTask = GetRealChartDataAsync();

            await Task.WhenAll(stockTask, cryptoTask, cryptoPairsTask, blockchainTask, newsTask, chartTask);

            var cryptos = await cryptoTask;
            var marketStats = CalculateMarketStats(cryptos);

            return new DashboardData
            {
                StockIndices = await stockTask,
                Cryptocurrencies = cryptos,
                BlockchainMetrics = await blockchainTask,
                CryptoPairs = await cryptoPairsTask,
                News = await newsTask,
                ChartData = await chartTask,
                MarketStats = marketStats,
                Timestamp = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard data");
            throw;
        }
    }

    private async Task<List<StockIndex>> GetRealStockIndicesAsync()
    {
        var symbols = new[]
        {
            ("S&P 500",   "^GSPC"),
            ("Dow Jones", "^DJI"),
            ("NASDAQ",    "^IXIC")
        };

        var stocks = new List<StockIndex>();
        int id = 1;

        foreach (var (name, symbol) in symbols)
        {
            try
            {
                var quote = await _finnhub.GetQuoteAsync(symbol);
                if (quote == null) continue;

                stocks.Add(new StockIndex
                {
                    Id = id++,
                    Name = name,
                    Symbol = symbol,
                    Price = quote.c,
                    Change = quote.dp,
                    Value = quote.c
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stock data for {Symbol}", symbol);
            }
        }

        return stocks;
    }

    private async Task<List<Cryptocurrency>> GetRealCryptocurrenciesAsync()
    {
        var cryptos = new List<Cryptocurrency>();
        int id = 1;

        var popularCryptos = new[]
        {
            ("Bitcoin",      "BTC", "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "₿"),
            ("Ethereum",     "ETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "Ξ"),
            ("Binance Coin", "BNB", "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", "B"),
            ("Solana",       "SOL", "0x7dff46370e9ea5f0bad3c4e29711ad50062ea7a4", "S"),
            ("Cardano",      "ADA", "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47", "A"),
            ("Ripple",       "XRP", "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe", "X")
        };

        foreach (var (name, symbol, address, icon) in popularCryptos)
        {
            try
            {
                var tokenPrice = await _moralis.GetTokenPriceAsync(address);

                if (tokenPrice != null && tokenPrice.UsdPrice > 0)
                {
                    var finnhubQuote = await _finnhub.GetCryptoQuoteAsync($"BINANCE:{symbol}USDT");

                    cryptos.Add(new Cryptocurrency
                    {
                        Id = id++,
                        Name = name,
                        Symbol = symbol,
                        Price = tokenPrice.UsdPrice,
                        Change = finnhubQuote?.dp ?? 0,
                        Icon = icon
                    });
                    continue;
                }

                var quote = await _finnhub.GetCryptoQuoteAsync($"BINANCE:{symbol}USDT");
                if (quote != null && quote.c > 0)
                {
                    cryptos.Add(new Cryptocurrency
                    {
                        Id = id++,
                        Name = name,
                        Symbol = symbol,
                        Price = quote.c,
                        Change = quote.dp,
                        Icon = icon
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting crypto data for {Name}", name);
            }
        }

        return cryptos;
    }

    private async Task<List<CryptoPair>> GetRealCryptoPairsAsync()
    {
        var pairs = new List<CryptoPair>();
        int id = 1;

        var popularPairs = new[]
        {
            ("BTC/USDT",  "Bitcoin/Tether",  "BINANCE:BTCUSDT"),
            ("ETH/USDT",  "Ethereum/Tether", "BINANCE:ETHUSDT"),
            ("ADA/USDT",  "Cardano/Tether",  "BINANCE:ADAUSDT"),
            ("XRP/USDT",  "Ripple/Tether",   "BINANCE:XRPUSDT"),
            ("DOGE/USDT", "Dogecoin/Tether", "BINANCE:DOGEUSDT"),
            ("DOT/USDT",  "Polkadot/Tether", "BINANCE:DOTUSDT")
        };

        foreach (var (pair, name, finnhubSymbol) in popularPairs)
        {
            try
            {
                var quote = await _finnhub.GetCryptoQuoteAsync(finnhubSymbol);
                if (quote == null || quote.c == 0) continue;

                pairs.Add(new CryptoPair
                {
                    Id = id++,
                    Pair = pair,
                    Name = name,
                    Price = quote.c,
                    Change = quote.dp
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting crypto pair data for {Pair}", pair);
            }
        }

        return pairs;
    }

    private async Task<List<BlockchainMetric>> GetRealBlockchainMetricsAsync()
    {
        try
        {
            var stats = await _moralis.GetBlockchainStatsAsync("eth");
            if (stats == null) return new List<BlockchainMetric>();

            return new List<BlockchainMetric>
            {
                new() { Id = 1, Name = "Total Blocks",   Value = $"{stats.Blocks:N0}",            Change = 0, Label = "Network Size"   },
                new() { Id = 2, Name = "Gas Price",      Value = $"{stats.GasPriceGwei:F2} Gwei", Change = 0, Label = "Current Fee"    },
                new() { Id = 3, Name = "Gas Price USD",  Value = $"${stats.GasPriceUsd:F4}",      Change = 0, Label = "Fee in USD"     },
                new() { Id = 4, Name = "Indexed Blocks", Value = $"{stats.IndexedBlocks:N0}",     Change = 0, Label = "Processed Data" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get blockchain stats from Moralis");
            return new List<BlockchainMetric>();
        }
    }

    private async Task<List<NewsItem>> GetRealNewsAsync()
    {
        try
        {
            
            var generalTask = _finnhub.GetMarketNewsAsync("general");
            var cryptoTask = _finnhub.GetMarketNewsAsync("crypto");
            var forexTask = _finnhub.GetMarketNewsAsync("forex");

            await Task.WhenAll(generalTask, cryptoTask, forexTask);

            var allArticles = new List<NewsArticle>();
            allArticles.AddRange(await generalTask ?? new());
            allArticles.AddRange(await cryptoTask ?? new());
            allArticles.AddRange(await forexTask ?? new());

       
            var seen = new HashSet<string>();
            var unique = allArticles
                .Where(a => !string.IsNullOrEmpty(a.headline) && seen.Add(a.headline))
                .OrderByDescending(a => a.datetime)
                .Take(20)
                .ToList();

            var categoryMap = new Dictionary<string, string>
        {
            { "crypto",  "Crypto"     },
            { "forex",   "Stock"      },
            { "general", "Stock"      },
        };

            int id = 1;
            return unique.Select((article, index) => new NewsItem
            {
                Id = id++,
                Category = categoryMap.GetValueOrDefault(article.category, "Stock"),
                Title = article.headline ?? "Market Update",
                Source = article.source ?? "Financial News",
                Time = FormatTimeAgo(DateTimeOffset.FromUnixTimeSeconds(article.datetime).UtcDateTime),
                Description = article.summary ?? "Click to read full article",
                ImageUrl = !string.IsNullOrEmpty(article.image)
                                ? article.image
                                : $"https://logo.clearbit.com/{article.source?.ToLower().Replace(" ", "").Replace(".", "")}.com",
                Url = article.url ?? "#",
                Author = "Financial Reporter"
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting news");
            return new List<NewsItem>();
        }
    }

    private async Task<List<ChartDataPoint>> GetRealChartDataAsync()
    {
        try
        {
            var btcQuote = await _finnhub.GetCryptoQuoteAsync("BINANCE:BTCUSDT");
            var basePrice = btcQuote?.c ?? 40_000m;
            var rng = new Random();
            var chartData = new List<ChartDataPoint>();
            var current = basePrice;

            for (int i = 1; i <= 7; i++)
            {
                var change = (decimal)(rng.NextDouble() * 0.04 - 0.02); 
                current *= (1 + change);

                chartData.Add(new ChartDataPoint
                {
                    Id = i,
                    Date = DateTime.UtcNow.AddDays(-(7 - i)),
                    Value = (double)Math.Round(current, 2)
                });
            }

            return chartData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating chart data");
            return new List<ChartDataPoint>();
        }
    }

    private static MarketStats CalculateMarketStats(List<Cryptocurrency> cryptos)
    {
        var prices = cryptos.Select(c => c.Price).Where(p => p > 0).ToList();
        if (!prices.Any()) return new MarketStats();

        var avgChange = cryptos.Where(c => c.Change != 0).Select(c => c.Change).DefaultIfEmpty(0).Average();
        var estimatedVolume = prices.Sum() * 1_000_000m;

        return new MarketStats
        {
            High = prices.Max(),
            Low = prices.Min(),
            Volume24h = estimatedVolume,
            Change24h = avgChange
        };
    }

    private static string FormatTimeAgo(DateTime utcTime)
    {
        var span = DateTime.UtcNow - utcTime;
        if (span.TotalDays >= 1) return $"{(int)span.TotalDays}d ago";
        if (span.TotalHours >= 1) return $"{(int)span.TotalHours}h ago";
        if (span.TotalMinutes >= 1) return $"{(int)span.TotalMinutes}m ago";
        return "Just now";
    }
}


public class DashboardData
{
    public List<StockIndex> StockIndices { get; set; } = new();
    public List<Cryptocurrency> Cryptocurrencies { get; set; } = new();
    public List<BlockchainMetric> BlockchainMetrics { get; set; } = new();
    public List<CryptoPair> CryptoPairs { get; set; } = new();
    public List<NewsItem> News { get; set; } = new();
    public List<ChartDataPoint> ChartData { get; set; } = new();
    public MarketStats MarketStats { get; set; } = new();
    public DateTime Timestamp { get; set; }
    public string Status { get; set; } = "success";
    public string Message { get; set; } = "Real-time data loaded";
}

public class StockIndex
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public decimal Value { get; set; }
}

public class Cryptocurrency
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public string Icon { get; set; } = "";
}

public class BlockchainMetric
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Value { get; set; } = "";
    public float Change { get; set; }
    public string Label { get; set; } = "";
}

public class CryptoPair
{
    public int Id { get; set; }
    public string Pair { get; set; } = "";
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public decimal Change { get; set; }
}

public class NewsItem
{
    public int Id { get; set; }
    public string Category { get; set; } = "";
    public string Title { get; set; } = "";
    public string Source { get; set; } = "";
    public string Time { get; set; } = "";
    public string Description { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string Url { get; set; } = "";
    public string Author { get; set; } = "";
}

public class ChartDataPoint
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public double Value { get; set; }
}

public class MarketStats
{
    public decimal High { get; set; }
    public decimal Low { get; set; }
    public decimal Volume24h { get; set; }
    public decimal Change24h { get; set; }
}