import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Clock, BarChart3, PieChart, LineChart, Filter } from 'lucide-react';

import styles from "./Dashboard.module.css";
import headerRow from "./HeaderSection/HeaderSection.module.css";
import chartsRow from "./ChartsRow/ChartsRow.module.css";
import statsRow from "./StatsRow/StatsRow.module.css";

const API_BASE_URL = 'http://localhost:49901';

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState('1D');
    const [assetType, setAssetType] = useState('All');
    const [newsTab, setNewsTab] = useState('All');
    const [activeChartTab, setActiveChartTab] = useState('Summary');

    const [stockIndices, setStockIndices] = useState([
        { id: 1, name: 'Connecting...', symbol: '...', price: '0.00', change: 0.00, value: 0.00 },
        { id: 2, name: 'Connecting...', symbol: '...', price: '0.00', change: 0.00, value: 0.00 },
        { id: 3, name: 'Connecting...', symbol: '...', price: '0.00', change: 0.00, value: 0.00 }
    ]);

    const [cryptoAssets, setCryptoAssets] = useState([
        { id: 1, name: 'Connecting...', symbol: '...', price: '$0.00', change: 0.00, icon: '...' },
        { id: 2, name: 'Connecting...', symbol: '...', price: '$0.00', change: 0.00, icon: '...' },
        { id: 3, name: 'Connecting...', symbol: '...', price: '$0.00', change: 0.00, icon: '...' },
        { id: 4, name: 'Connecting...', symbol: '...', price: '$0.00', change: 0.00, icon: '...' }
    ]);

    const [blockchainMetrics, setBlockchainMetrics] = useState([
        { id: 1, name: 'Connecting...', value: '...', change: 0.0, label: '...' },
        { id: 2, name: 'Connecting...', value: '...', change: 0.0, label: '...' },
        { id: 3, name: 'Connecting...', value: '...', change: 0.0, label: '...' },
        { id: 4, name: 'Connecting...', value: '...', change: 0.0, label: '...' },
    ]);

    const [chartData, setChartData] = useState([
        { id: 1, date: 'Mon', value: 32.50 },
        { id: 2, date: 'Tue', value: 36.80 },
        { id: 3, date: 'Wed', value: 38.20 },
        { id: 4, date: 'Thu', value: 35.40 },
        { id: 5, date: 'Fri', value: 40.00 },
        { id: 6, date: 'Sat', value: 37.50 },
        { id: 7, date: 'Sun', value: 39.20 }
    ]);

    const [cryptoPairs, setCryptoPairs] = useState([
        { id: 1, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
        { id: 2, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
        { id: 3, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
        { id: 4, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
        { id: 5, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
        { id: 6, pair: 'Connecting...', name: 'Connecting...', price: '$0.00', change: 0.00 },
    ]);

    const [newsData, setNewsData] = useState([
        {
            id: 1,
            category: 'Stock',
            title: 'Connecting to real-time feed...',
            source: 'System',
            time: 'Just now',
            description: 'Establishing connection to news API...',
            imageUrl: '',
            url: '#',
            author: 'Dashboard'
        }
    ]);

    const [marketStats, setMarketStats] = useState({
        high: 0, low: 0, volume24h: 0, change24h: 0
    });

    const [lastUpdated, setLastUpdated] = useState(null);

    const formatNumber = useCallback((num) => {
        if (num === 0) return '0.00';
        if (!num && num !== 0) return '0.00';
        if (num >= 1000000000) return '$' + (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return '$' + (num / 1000).toFixed(1) + 'K';
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    const formatCryptoPrice = useCallback((price) => {
        if (!price && price !== 0) return '$0.00';
        return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    const formatMarketStat = useCallback((value) => {
        if (!value && value !== 0) return '$0.00';
        if (value >= 1000000000) return '$' + (value / 1000000000).toFixed(1) + 'B';
        if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
        return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();

            if (data.stockIndices?.length) {
                setStockIndices(data.stockIndices.map(item => ({
                    ...item,
                    price: formatNumber(item.price)
                })));
            }
            if (data.cryptocurrencies?.length) {
                setCryptoAssets(data.cryptocurrencies.map(item => ({
                    ...item,
                    price: formatCryptoPrice(item.price)
                })));
            }
            if (data.blockchainMetrics?.length) setBlockchainMetrics(data.blockchainMetrics);
            if (data.cryptoPairs?.length) {
                setCryptoPairs(data.cryptoPairs.map(item => ({
                    ...item,
                    price: formatCryptoPrice(item.price)
                })));
            }
            if (data.news?.length) setNewsData(data.news);
            if (data.chartData?.length) setChartData(data.chartData);
            if (data.marketStats) setMarketStats(data.marketStats);

            setLastUpdated(new Date(data.timestamp || Date.now()));
        } catch (err) {
            console.error('Dashboard fetch error:', err.message);
        }
    }, [formatNumber, formatCryptoPrice]);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 10000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const filterOptions = ['All', 'Stock', 'Crypto', 'Blockchain'];
    const assetFilterOptions = ['All', 'Stock', 'Crypto', 'Blockchain'];
    const filteredNews = newsTab === 'All'
        ? newsData
        : newsData.filter(item => item.category === newsTab);

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardContainer}>

                <div className={headerRow.headerSection}>
                    <div className={headerRow.headerLeft}>
                        <h1 className={headerRow.title}>Dashboard</h1>
                        {lastUpdated && (
                            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                                Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.marketTrendsSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <LineChart size={20} /> Market Trends
                        </h2>
                        <div className={styles.sectionControls}>
                            <div className={styles.filterButtons}>
                                <Filter size={16} />
                                <div className={styles.buttonGroup}>
                                    {assetFilterOptions.map(type => (
                                        <button
                                            key={type}
                                            className={`${styles.filterBtn} ${assetType === type ? styles.filterBtnActive : ''}`}
                                            onClick={() => setAssetType(type)}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.timeButtons}>
                                <div className={styles.buttonGroup}>
                                    {['1D', '1W', '1M', '3M', '1Y'].map(range => (
                                        <button
                                            key={range}
                                            className={`${styles.timeBtn} ${timeRange === range ? styles.timeBtnActive : ''}`}
                                            onClick={() => setTimeRange(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={chartsRow.chartContainer}>
                        <div className={chartsRow.chartHeader}>
                            <div className={chartsRow.chartTabs}>
                                {['Summary', 'Chart', 'Conversations', 'Historical Data'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`${chartsRow.chartTab} ${activeChartTab === tab ? chartsRow.chartTabActive : ''}`}
                                        onClick={() => setActiveChartTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(() => {
                            const vals = chartData.map(d => typeof d.value === 'number' ? d.value : parseFloat(d.value) || 0);
                            const minVal = Math.min(...vals);
                            const maxVal = Math.max(...vals);
                            const range = maxVal - minVal || 1;

                            
                            const yLabels = Array.from({ length: 5 }, (_, i) =>
                                (maxVal - (i / 4) * range).toLocaleString('en-US', { maximumFractionDigits: 0 })
                            );

                            return (
                                <div className={chartsRow.chartArea}>
                                    <div className={chartsRow.chartYAxis}>
                                        {yLabels.map((label, i) => (
                                            <span key={i}>{label}</span>
                                        ))}
                                    </div>
                                    <div className={chartsRow.chartBars}>
                                        {chartData.map((data) => {
                                            const val = typeof data.value === 'number' ? data.value : parseFloat(data.value) || 0;
                                            const height = Math.max(((val - minVal) / range) * 100, 2); 
                                            const label = typeof data.date === 'string' && data.date.includes('T')
                                                ? new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : data.date;
                                            return (
                                                <div key={data.id} className={chartsRow.chartBarContainer}>
                                                    <div
                                                        className={chartsRow.chartBar}
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    <div className={chartsRow.chartDate}>{label}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className={statsRow.marketStats}>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>High</div>
                                <div className={statsRow.statValue}>{formatMarketStat(marketStats.high)}</div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Low</div>
                                <div className={statsRow.statValue}>{formatMarketStat(marketStats.low)}</div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Volume (24h)</div>
                                <div className={statsRow.statValue}>
                                    {marketStats.volume24h >= 1000000000
                                        ? '$' + (marketStats.volume24h / 1000000000).toFixed(1) + 'B'
                                        : formatMarketStat(marketStats.volume24h)}
                                </div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Change</div>
                                <div className={marketStats.change24h >= 0 ? statsRow.statValuePositive : statsRow.statValueNegative}>
                                    {marketStats.change24h >= 0 ? '+' : ''}{marketStats.change24h?.toFixed(2) || '0.00'}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cryptoPairsSection}>
                        <h3 className={styles.subsectionTitle}>Live Crypto Prices</h3>
                        <div className={styles.cryptoPairsGrid}>
                            {cryptoPairs.map((pair) => (
                                <div key={pair.id} className={styles.cryptoPairCard}>
                                    <div className={styles.cryptoPairHeader}>
                                        <div>
                                            <div className={styles.cryptoPair}>{pair.pair}</div>
                                            <div className={styles.cryptoName}>{pair.name}</div>
                                        </div>
                                        <div className={`${styles.changeIndicator} ${pair.change >= 0 ? styles.positive : styles.negative}`}>
                                            {pair.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        </div>
                                    </div>
                                    <div className={styles.cryptoPairPrice}>{pair.price}</div>
                                    <div className={`${styles.cryptoPairChange} ${pair.change >= 0 ? styles.positive : styles.negative}`}>
                                        {pair.change >= 0 ? '+' : ''}{pair.change?.toFixed(2) || '0.00'}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.cardsSection}>

                    <div className={`${styles.mainCard} ${styles.stockCard}`}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitle}>Stock Indices</h3>
                                <p className={styles.cardSubtitle}>Major market indices performance</p>
                            </div>
                            <div className={styles.cardIcon}><BarChart3 size={24} /></div>
                        </div>
                        <div className={styles.cardContent}>
                            {stockIndices.map((stock) => (
                                <div key={stock.id} className={styles.metricRow}>
                                    <div className={styles.metricInfo}>
                                        <span className={styles.metricName}>{stock.name}</span>
                                        <span className={styles.metricSymbol}>{stock.symbol}</span>
                                    </div>
                                    <div className={styles.metricValues}>
                                        <span className={styles.metricValue}>{stock.price}</span>
                                        <div className={`${styles.metricChange} ${stock.change >= 0 ? styles.positive : styles.negative}`}>
                                            {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            <span>{Math.abs(stock.change)?.toFixed(2) || '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.mainCard} ${styles.cryptoCard}`}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitle}>Top Cryptocurrencies</h3>
                                <p className={styles.cardSubtitle}>Leading crypto assets by market cap</p>
                            </div>
                            <div className={styles.cardIcon}><BarChart3 size={24} /></div>
                        </div>
                        <div className={styles.cardContent}>
                            {cryptoAssets.map((crypto) => (
                                <div key={crypto.id} className={styles.metricRow}>
                                    <div className={styles.metricInfo}>
                                        <div className={styles.cryptoIconContainer}>
                                            <span className={styles.cryptoIcon}>{crypto.icon}</span>
                                            <div>
                                                <span className={styles.metricName}>{crypto.name}</span>
                                                <span className={styles.metricSymbol}>{crypto.symbol}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.metricValues}>
                                        <span className={styles.metricValue}>{crypto.price}</span>
                                        <div className={`${styles.metricChange} ${crypto.change >= 0 ? styles.positive : styles.negative}`}>
                                            {crypto.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            <span>{Math.abs(crypto.change)?.toFixed(2) || '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.mainCard} ${styles.blockchainCard}`}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitle}>Blockchain Metrics</h3>
                                <p className={styles.cardSubtitle}>Network performance & activity</p>
                            </div>
                            <div className={styles.cardIcon}><PieChart size={24} /></div>
                        </div>
                        <div className={styles.cardContent}>
                            {blockchainMetrics.map((metric) => (
                                <div key={metric.id} className={styles.metricRow}>
                                    <div className={styles.metricInfo}>
                                        <span className={styles.metricName}>{metric.name}</span>
                                        <span className={styles.metricLabel}>{metric.label}</span>
                                    </div>
                                    <div className={styles.metricValues}>
                                        <span className={styles.metricValue}>{metric.value}</span>
                                        <div className={`${styles.metricChange} ${metric.change >= 0 ? styles.positive : styles.negative}`}>
                                            {metric.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            <span>{Math.abs(metric.change)?.toFixed(2) || '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.newsSidebar}>
                    <div className={styles.newsHeader}>
                        <h2 className={styles.sectionTitle}>
                            <Newspaper size={20} /> Latest News
                        </h2>
                        <div className={styles.newsTabs}>
                            {filterOptions.map(tab => (
                                <button
                                    key={tab}
                                    className={`${styles.newsTab} ${newsTab === tab ? styles.newsTabActive : ''}`}
                                    onClick={() => setNewsTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.newsScrollContainer}>
                        <div className={styles.newsList}>
                            {filteredNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                >
                                    <div className={styles.newsCard} style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        padding: '10px',
                                        overflow: 'hidden'
                                    }}>

                                        
                                        <div style={{
                                            width: '80px',
                                            height: '70px',
                                            flexShrink: 0,
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            background: '#F1F5F9'
                                        }}>
                                            <img
                                                src={news.imageUrl}
                                                alt={news.source}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    const initials = news.source?.substring(0, 2) ?? '??';
                                                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='70'%3E%3Crect width='80' height='70' fill='%23E2E8F0'/%3E%3Ctext x='40' y='40' font-family='sans-serif' font-size='14' fill='%2364748B' text-anchor='middle'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
                                                }}
                                            />
                                        </div>

                                       
                                        <div className={styles.newsContent} style={{
                                            flex: 1,
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <div className={styles.newsMeta}>
                                                <span className={styles.newsCategory} data-category={news.category}>
                                                    {news.category}
                                                </span>
                                                <div className={styles.newsTime}>
                                                    <Clock size={11} />
                                                    <span>{news.time}</span>
                                                </div>
                                            </div>
                                            <h3 className={styles.newsTitle}>{news.title}</h3>
                                            <p className={styles.newsDescription}>{news.description}</p>
                                            <div className={styles.newsFooter}>
                                                <div className={styles.sourceInfo}>
                                                    <span className={styles.sourceName}>{news.source}</span>
                                                    {news.author && (
                                                        <span className={styles.author}> • {news.author}</span>
                                                    )}
                                                </div>
                                                <span className={styles.readMore}>Read more →</span>
                                            </div>
                                        </div>

                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
