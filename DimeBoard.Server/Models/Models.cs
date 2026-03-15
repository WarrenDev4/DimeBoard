namespace DimeBoard.Server.Models
{
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
        public string category { get; set; } = "";
        public string headline { get; set; } = "";
        public string summary { get; set; } = "";
        public string source { get; set; } = "";
        public string url { get; set; } = "";
        public string image { get; set; } = "";
        public DateTime datetime { get; set; }
    }
}
