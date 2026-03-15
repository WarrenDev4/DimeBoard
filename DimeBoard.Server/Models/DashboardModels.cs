namespace DimeBoard.Server.Models
{
    public class DashboardData
    {
        public List<StockIndex> StockIndices { get; set; } = new List<StockIndex>();
        public List<Cryptocurrency> Cryptocurrencies { get; set; } = new List<Cryptocurrency>();
        public List<BlockchainMetric> BlockchainMetrics { get; set; } = new List<BlockchainMetric>();
        public List<CryptoPair> CryptoPairs { get; set; } = new List<CryptoPair>();
        public List<NewsItem> News { get; set; } = new List<NewsItem>();
        public List<ChartDataPoint> ChartData { get; set; } = new List<ChartDataPoint>();
        public MarketStats MarketStats { get; set; } = new MarketStats();
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
}