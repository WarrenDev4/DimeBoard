using System.Net.Http.Headers;
using System.Net.Http.Json;

public class MoralisService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly ILogger<MoralisService> _logger;

    
    public MoralisService(IConfiguration config, HttpClient http, ILogger<MoralisService> logger)
    {
        
        _http = http;
        _logger = logger;  

        _apiKey = config["Moralis:ApiKey"] ?? config["MORALIS_API"] ?? "";
        if (string.IsNullOrEmpty(_apiKey))
            _logger.LogWarning("Moralis:ApiKey is missing — blockchain data will be unavailable");

        _http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _http.DefaultRequestHeaders.Add("X-API-Key", _apiKey);
        _http.Timeout = TimeSpan.FromSeconds(15);
    }

   

    public async Task<TokenPrice?> GetTokenPriceAsync(string address, string chain = "eth")
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/erc20/{address}/price?chain={chain}";
        return await FetchJsonAsync<TokenPrice>(url, $"token price for {address}");
    }


    public async Task<BlockchainStats?> GetBlockchainStatsAsync(string chain = "eth")
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/web3/stats?chain={chain}";
        return await FetchJsonAsync<BlockchainStats>(url, $"blockchain stats for {chain}");
    }


    public async Task<List<TokenInfo>> GetTopTokensAsync(string chain = "eth", int limit = 10)
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/erc20?chain={chain}&limit={limit}";
        var result = await FetchJsonAsync<TopTokensResponse>(url, $"top {limit} tokens");
        return result?.Result ?? new List<TokenInfo>();
    }


    public async Task<List<NFTCollection>> GetTopNFTCollectionsAsync(string chain = "eth", int limit = 5)
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/nft/collections/top?chain={chain}&limit={limit}";
        var result = await FetchJsonAsync<TopNFTCollectionsResponse>(url, $"top {limit} NFT collections");
        return result?.Result ?? new List<NFTCollection>();
    }


    public async Task<List<TokenBalance>> GetWalletBalancesAsync(string address, string chain = "eth")
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/{address}/erc20?chain={chain}";
        var result = await FetchJsonAsync<List<TokenBalance>>(url, $"wallet balances for {address}");
        return result ?? new List<TokenBalance>();
    }


    public async Task<TokenMetadata?> GetTokenMetadataAsync(string address, string chain = "eth")
    {
        var url = $"https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain={chain}&addresses={address}";
        var result = await FetchJsonAsync<List<TokenMetadata>>(url, $"token metadata for {address}");
        return result?.FirstOrDefault();
    }


    private async Task<T?> FetchJsonAsync<T>(string url, string label)
    {
        try
        {
            _logger.LogInformation("Moralis: fetching {Label}", label);
            var response = await _http.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Moralis returned {StatusCode} for {Label}", response.StatusCode, label);
                return default;
            }

            return await response.Content.ReadFromJsonAsync<T>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Moralis error fetching {Label}", label);
            return default;
        }
    }
}


public class TokenPrice
{
    public string NativePrice { get; set; } = "";
    public decimal UsdPrice { get; set; }
    public string ExchangeName { get; set; } = "";
    public string ExchangeAddress { get; set; } = "";
}

public class TokenInfo
{
    public string TokenAddress { get; set; } = "";
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public string Logo { get; set; } = "";
    public string Thumbnail { get; set; } = "";
    public decimal Decimals { get; set; }
    public decimal Balance { get; set; }
    public decimal BalanceFormatted { get; set; }
    public decimal BalanceUsd { get; set; }
}

public class TopTokensResponse
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<TokenInfo> Result { get; set; } = new();
}

public class BlockchainStats
{
    public string Chain { get; set; } = "";
    public long Blocks { get; set; }
    public long IndexedBlocks { get; set; }
    public long IndexedTotal { get; set; }
    public long GasPriceWei { get; set; }
    public decimal GasPriceGwei { get; set; }
    public decimal GasPriceUsd { get; set; }
}

public class NFTCollection
{
    public string TokenAddress { get; set; } = "";
    public string ContractType { get; set; } = "";
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
}

public class TopNFTCollectionsResponse
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<NFTCollection> Result { get; set; } = new();
}

public class TokenBalance
{
    public string TokenAddress { get; set; } = "";
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public string Logo { get; set; } = "";
    public string Thumbnail { get; set; } = "";
    public decimal Decimals { get; set; }
    public string Balance { get; set; } = "";
    public decimal BalanceFormatted { get; set; }
    public decimal BalanceUsd { get; set; }
}

public class TokenMetadata
{
    public string Address { get; set; } = "";
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public decimal Decimals { get; set; }
    public string Logo { get; set; } = "";
}