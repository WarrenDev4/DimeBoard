import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Newspaper, Clock, BarChart3, PieChart, LineChart, Filter } from 'lucide-react';

import styles from "./Dashboard.module.css";
import headerRow from "./HeaaderSection/HeaderSection.module.css";
import chartsRow from "./ChartsRow/ChartsRow.module.css";
import statsRow from "./StatsRow/StatsRow.module.css";
import bottomRow from "./BottomRow/BottomRow.module.css";


export default function Dashboard() {
    const [timeRange, setTimeRange] = useState('1D');
    const [assetType, setAssetType] = useState('All');
    const [newsTab, setNewsTab] = useState('All');
    const [activeChartTab, setActiveChartTab] = useState('Summary');

    const stockIndices = [
        { id: 1, name: 'N/A', symbol: 'N/A', price: '0.00', change: 0.00, value: 0.00 },
        { id: 2, name: 'N/A', symbol: 'N/A', price: '0.00', change: 0.00, value: 0.00 },
        { id: 3, name: 'N/A', symbol: 'N/A', price: '0.00', change: 0.00, value: 0.00 }
    ];

    const cryptoAssets = [
        { id: 1, name: 'N/A', symbol: '-', price: '$0.00', change: 0.00, icon: '-' },
        { id: 2, name: 'N/A', symbol: '-', price: '$0.00', change: 0.00, icon: '-' },
        { id: 3, name: 'N/A', symbol: '-', price: '$0.00', change: 0.00, icon: '-' },
        { id: 4, name: 'N/A', symbol: '-', price: '$0.00', change: 0.00, icon: '-' }
    ];

    const blockchainMetrics = [
        { id: 1, name: 'N/A', value: 'N/A', change: 0.0, label: 'N/A' },
        { id: 2, name: 'N/A', value: 'N/A', change: 0.0, label: 'N/A' },
        { id: 3, name: 'N/A', value: 'N/A', change: 0.0, label: 'N/A' },
        { id: 4, name: 'N/A', value: 'N/A', change: 0.0, label: 'N/A' },
    ];

    const chartData = [
        { id: 1, date: '08 Jan', value: 32.50 },
        { id: 2, date: '16 Jan', value: 36.80 },
        { id: 3, date: '24 Jan', value: 38.20 },
        { id: 4, date: 'Feb \'19', value: 35.40 },
        { id: 5, date: '08 Feb', value: 40.00 },
        { id: 6, date: '16 Feb', value: 37.50 },
        { id: 7, date: '24 Feb', value: 39.20 }
    ];

    const cryptoPairs = [
        { id: 1, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
        { id: 2, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
        { id: 3, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
        { id: 4, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
        { id: 5, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
        { id: 6, pair: 'N/A', name: 'N/A', price: '$0.00', change: 0.00 },
    ];

    const newsData = [
        {
            id: 1,
            category: 'Stock',
            title: 'N/A',
            source: 'Untitled',
            time: '0h ago',
            description: 'N/A',
            imageUrl: 'https://logo.clearbit.com/bloomberg.com',
            url: 'https://www.bloomberg.com/news/articles/2024-01-15/sp-500-record-high-tech-stocks-rally',
            author: 'John Doe'
        },
        {
            id: 2,
            category: 'Crypto',
            title: 'N/A',
            source: 'Untitled',
            time: '0h ago',
            description: 'N/A',
            imageUrl: 'https://logo.clearbit.com/coindesk.com',
            url: 'https://www.coindesk.com/markets/2024/01/15/bitcoin-price-68000-institutional-demand',
            author: 'Jane Doe'
        },
        {
            id: 3,
            category: 'Blockchain',
            title: 'N/A',
            source: 'Untitled',
            time: '0h ago',
            description: 'N/A',
            imageUrl: 'https://logo.clearbit.com/theblock.co',
            url: 'https://www.theblock.co/post/280541/ethereum-gas-fees-drop-lowest-levels',
            author: 'John Doe'
        },
        {
            id: 4,
            category: 'Stock',
            title: 'N/A',
            source: 'Untitled',
            time: '0h ago',
            description: 'N/A',
            imageUrl: 'https://logo.clearbit.com/reuters.com',
            url: 'https://www.reuters.com/markets/rates-bonds/fed-holds-rates-steady-2024-01-15',
            author: 'John Doe'
        },
    ];

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
                                            onClick={() => setAssetType(type)}
                                        >
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

                        <div className={chartsRow.chartArea}>
                            <div className={chartsRow.chartYAxis}>
                                <span>40.00</span>
                                <span>38.00</span>
                                <span>36.00</span>
                                <span>34.00</span>
                                <span>32.00</span>
                                <span>30.00</span>
                                <span>28.00</span>
                            </div>
                            <div className={chartsRow.chartBars}>
                                {chartData.map((data) => (
                                    <div key={data.id} className={chartsRow.chartBarContainer}>
                                        <div
                                            className={chartsRow.chartBar}
                                            style={{ height: `${(data.value / 40) * 100}%` }}
                                        />
                                        <div className={chartsRow.chartDate}>{data.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={statsRow.marketStats}>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>High</div>
                                <div className={statsRow.statValue}>$0.00</div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Low</div>
                                <div className={statsRow.statValue}>$0.00</div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Volume (24h)</div>
                                <div className={statsRow.statValue}>$00.0B</div>
                            </div>
                            <div className={statsRow.statItem}>
                                <div className={statsRow.statLabel}>Change</div>
                                <div className={statsRow.statValuePositive}>+0.00%</div>
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
                                        {pair.change >= 0 ? '+' : ''}{pair.change}%
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
                                <h3 className={styles.cardTitle}> Stock Indices</h3>
                                <p className={styles.cardSubtitle}>Major market indices performance</p>
                            </div>
                            <div className={styles.cardIcon}>
                                <BarChart3 size={24} />
                            </div>
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
                                            <span>{Math.abs(stock.change)}%</span>
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
                            <div className={styles.cardIcon}>
                                <BarChart3 size={24} />
                            </div>
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
                                            <span>{Math.abs(crypto.change)}%</span>
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
                            <div className={styles.cardIcon}>
                                <PieChart size={24} />
                            </div>
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
                                            <span>{Math.abs(metric.change)}%</span>
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
                                <div key={news.id} className={styles.newsCard}>
                                  
                                    <div className={styles.newsImageContainer}>
                                        <div className={styles.newsImage}>
                                            <img
                                                src={news.imageUrl}
                                                alt={news.source}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://via.placeholder.com/100x60/6B7280/fff?text=${news.source.substring(0, 2)}`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.newsContent}>
                                        <div className={styles.newsMeta}>
                                            <span
                                                className={styles.newsCategory}
                                                data-category={news.category}
                                            >
                                                {news.category}
                                            </span>
                                            <div className={styles.newsTime}>
                                                <Clock size={12} />
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
                                            <a href={news.url} className={styles.readMore} target="_blank" rel="noopener noreferrer">
                                                Read more →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}