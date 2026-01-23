import styles from "./Crypto.module.css";

export default function Crypto() {
    return (
        <div className={styles.cryptoWrapper}>
            <div className={styles.cryptoContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Crypto</h1>
                    </div>

                    <div className={styles.cryptoControls}>
                        <input placeholder="Search crypto..." />
                        <select>
                            <option>All</option>
                            <option>Top Market Cap</option>
                            <option>Trending</option>
                            <option>DeFi</option>
                            <option>Layer 1</option>
                            <option>Layer 2</option>
                            <option>AI Tokens</option>
                        </select>
                    </div>
                </div>

                <div className={styles.cryptoOverview}>
                    <div className={styles.overviewCard}>Crypto Summary</div>
                    <div className={styles.overviewCard}>Fear & Greed Index</div>
                    <div className={styles.overviewCard}>Whale Activity</div>
                    <div className={styles.overviewCard}>Liquidity Flow</div>
                </div>

              
                <div className={styles.cryptoMain}>

                    <div className={styles.tokenList}>
                        <h3>Tokens</h3>
                        <div className={styles.tokenItem}>BTC</div>
                        <div className={styles.tokenItem}>ETH</div>
                        <div className={styles.tokenItem}>SOL</div>
                        <div className={styles.tokenItem}>AVAX</div>
                        <div className={styles.tokenItem}>LINK</div>
                        <div className={styles.tokenItem}>RNDR</div>
                    </div>

                    <div className={styles.tokenDetails}>
                        <h3>Token Analytics</h3>

                        <div className={styles.chartBox}>Price Chart (API)</div>

                        <div className={styles.statsRow}>
                            <div className={styles.stat}>Price</div>
                            <div className={styles.stat}>24h Change</div>
                            <div className={styles.stat}>Volume</div>
                            <div className={styles.stat}>Market Cap</div>
                        </div>

                        <div className={styles.aiPanel}>
                            <h4>AI Market Analysis</h4>
                            <p>
                                AI-generated explanation of price movement, sentiment, momentum, and trend probability.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.cryptoBottom}>

                    <div className={styles.newsSection}>
                        <h3>Crypto News</h3>
                        <div className={styles.newsCard}>Bitcoin ETF inflows surge</div>
                        <div className={styles.newsCard}>Ethereum scaling update</div>
                        <div className={styles.newsCard}>DeFi protocol exploit analysis</div>
                    </div>

                    <div className={styles.aiInsights}>
                        <h3>AI Insights</h3>
                        <div className={styles.aiCard}>AI Trade Signals</div>
                        <div className={styles.aiCard}>Risk Alerts</div>
                        <div className={styles.aiCard}>Trend Forecasts</div>
                        <div className={styles.aiCard}>Volatility Prediction</div>
                    </div>

                </div>

            </div>
        </div>
    );
}
