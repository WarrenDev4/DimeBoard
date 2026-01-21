import styles from "./Markets.module.css";

export default function Markets() {
    return (
        <div className={styles.marketsWrapper}>
            <div className={styles.marketsContainer}>
                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Markets</h1>
                    </div>
                </div>
                    <div className={styles.headerRight}>
                        <input placeholder="Search asset..." />
                        <select>
                            <option>All</option>
                            <option>Stocks</option>
                            <option>Crypto</option>
                            <option>Blockchain</option>
                        </select>
                    </div>
                </div>
                <div className={styles.marketsOverview}>
                    <div className={styles.overviewCard}>AI Market Summary</div>
                    <div className={styles.overviewCard}>Market Sentiment</div>
                    <div className={styles.overviewCard}>Top Movers</div>
                    <div className={styles.overviewCard}>Volatility Index</div>
                </div>
                <div className={styles.marketsMain}>
                    <div className={styles.assetList}>
                        <h3>Assets</h3>
                        <div className={styles.assetItem}>BTC</div>
                        <div className={styles.assetItem}>ETH</div>
                        <div className={styles.assetItem}>AAPL</div>
                        <div className={styles.assetItem}>TSLA</div>
                    </div>
                    <div className={styles.assetDetails}>
                        <h3>Asset Details</h3>
                        <div className={styles.chartBox}>Chart Placeholder</div>
                        <div className={styles.statsRow}>
                            <div className={styles.stat}>Price</div>
                            <div className={styles.stat}>Volume</div>
                            <div className={styles.stat}>Change</div>
                            <div className={styles.stat}>Market Cap</div>
                        </div>

                        <div className={styles.aiExplanation}>
                            AI explanation of trend will appear here.
                        </div>
                    </div>
                </div>
                <div className={styles.marketsBottom}>
                    <div className={styles.newsSection}>
                        <h3>Market News</h3>
                        <div className={styles.newsCard}>Headline 1</div>
                        <div className={styles.newsCard}>Headline 2</div>
                        <div className={styles.newsCard}>Headline 3</div>
                    </div>

                    <div className={styles.aiInsights}>
                        <h3>AI Insights</h3>
                        <div className={styles.aiCard}>Daily Market Summary</div>
                        <div className={styles.aiCard}>Recommendations</div>
                        <div className={styles.aiCard}>Trend Warnings</div>
                    </div>
                </div>
        </div>
             
    );
}
