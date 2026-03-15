using Microsoft.AspNetCore.Mvc;

namespace DimeBoard.Server.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(DashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            try
            {
                _logger.LogInformation("GET /api/dashboard/overview");

                //var data = new
                //{
                //    stockIndices = new[] {
                //        new { id = 1, name = "S&P 500",   symbol = "SPX", price = 5100.50,  change = 0.5, value = 5100.50  },
                //        new { id = 2, name = "NASDAQ",    symbol = "NDX", price = 18000.75, change = 0.8, value = 18000.75 },
                //        new { id = 3, name = "Dow Jones", symbol = "DJI", price = 39500.25, change = 0.3, value = 39500.25 }
                //    },
                //    cryptocurrencies = new[] {
                //        new { id = 1, name = "Bitcoin",  symbol = "BTC", price = 65000.50, change = 2.5,  icon = "₿" },
                //        new { id = 2, name = "Ethereum", symbol = "ETH", price = 3500.25,  change = 1.8,  icon = "Ξ" },
                //        new { id = 3, name = "Solana",   symbol = "SOL", price = 150.75,   change = 3.2,  icon = "S" },
                //        new { id = 4, name = "Cardano",  symbol = "ADA", price = 0.65,     change = -0.5, icon = "A" }
                //    },
                //    blockchainMetrics = new[] {
                //        new { id = 1, name = "Total Transactions", value = "1.2M",     change = 1.5,  label = "24h"     },
                //        new { id = 2, name = "Gas Price",          value = "25 Gwei",  change = -2.3, label = "Avg"     },
                //        new { id = 3, name = "Active Addresses",   value = "850K",     change = 0.8,  label = "24h"     },
                //        new { id = 4, name = "Network Hashrate",   value = "650 TH/s", change = 1.2,  label = "Current" }
                //    },
                //    cryptoPairs = new[] {
                //        new { id = 1, pair = "BTC/USDT", name = "Bitcoin",   price = 65000.50, change = 2.5  },
                //        new { id = 2, pair = "ETH/USDT", name = "Ethereum",  price = 3500.25,  change = 1.8  },
                //        new { id = 3, pair = "SOL/USDT", name = "Solana",    price = 150.75,   change = 3.2  },
                //        new { id = 4, pair = "ADA/USDT", name = "Cardano",   price = 0.65,     change = -0.5 },
                //        new { id = 5, pair = "XRP/USDT", name = "Ripple",    price = 0.55,     change = 0.3  },
                //        new { id = 6, pair = "DOT/USDT", name = "Polkadot",  price = 8.25,     change = 1.1  }
                //    },
                //    news = new[] {
                //        new { id = 1, category = "Stock",      title = "S&P 500 Hits Record High on Tech Rally",          source = "Bloomberg", time = "2h ago", description = "Technology stocks lead the market to new highs as earnings season kicks off.",                        imageUrl = "https://logo.clearbit.com/bloomberg.com", url = "#", author = "John Smith"   },
                //        new { id = 2, category = "Crypto",     title = "Bitcoin Surpasses $65,000 Amid Institutional Interest", source = "CoinDesk", time = "3h ago", description = "Major institutions continue to accumulate Bitcoin as ETF inflows hit record levels.",        imageUrl = "https://logo.clearbit.com/coindesk.com",  url = "#", author = "Jane Doe"     },
                //        new { id = 3, category = "Blockchain", title = "Ethereum Gas Fees Drop to 6-Month Low",            source = "The Block", time = "4h ago", description = "Network upgrades and increased efficiency lead to lower transaction costs.",                     imageUrl = "https://logo.clearbit.com/theblock.co",   url = "#", author = "Alex Johnson" },
                //        new { id = 4, category = "Stock",      title = "Fed Holds Rates Steady, Signals Gradual Increases", source = "Reuters",   time = "5h ago", description = "Federal Reserve maintains current interest rates while preparing for future adjustments.",    imageUrl = "https://logo.clearbit.com/reuters.com",   url = "#", author = "Robert Chen"  }
                //    },
                //    chartData = new[] {
                //        new { id = 1, date = "Mon", value = 32.50 },
                //        new { id = 2, date = "Tue", value = 36.80 },
                //        new { id = 3, date = "Wed", value = 38.20 },
                //        new { id = 4, date = "Thu", value = 35.40 },
                //        new { id = 5, date = "Fri", value = 40.00 },
                //        new { id = 6, date = "Sat", value = 37.50 },
                //        new { id = 7, date = "Sun", value = 39.20 }
                //    },
                //    marketStats = new { high = 40.00, low = 32.50, volume24h = 45000000000, change24h = 2.5 },
                //    timestamp = DateTime.UtcNow,
                //    status = "success",
                //    message = "Data loaded"
                //};

                //return Ok(data);

                var data = await _dashboardService.GetDashboardAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/dashboard/overview");
                return StatusCode(500, new { status = "error", message = ex.Message, timestamp = DateTime.UtcNow });
            }
        }

    
        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { status = "online", timestamp = DateTime.UtcNow, message = "Dashboard API is running" });
        }

    
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                message = "DimeBoard Dashboard API",
                endpoints = new[] { "/api/dashboard/overview", "/api/dashboard/status" },
                timestamp = DateTime.UtcNow
            });
        }
    }
}