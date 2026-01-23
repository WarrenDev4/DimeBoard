import styles from "./AIInsights.module.css";

export default function AIInsights() {
    return (
        <div className={styles.aiWrapper}>
            <div className={styles.aiContainer}>

                {/* Header */}
                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>AI Insights</h1>
                    </div>

                    <div className={styles.aiControls}>
                        <select>
                            <option>All Markets</option>
                            <option>Stocks</option>
                            <option>Crypto</option>
                            <option>Blockchain</option>
                        </select>
                        <select>
                            <option>Last 24 Hours</option>
                            <option>7 Days</option>
                            <option>30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Insight Summary */}
                <div className={styles.insightOverview}>
                    <div className={styles.overviewCard}>Market Direction</div>
                    <div className={styles.overviewCard}>Risk Level</div>
                    <div className={styles.overviewCard}>Volatility Outlook</div>
                    <div className={styles.overviewCard}>AI Confidence</div>
                </div>

                {/* Main */}
                <div className={styles.aiMain}>

                    {/* Insight Feed */}
                    <div className={styles.insightFeed}>
                        <h3>AI Analysis Feed</h3>

                        <div className={styles.insightCard}>
                            <h4>N/A</h4>
                            <p>
                                N/A
                            </p>
                        </div>

                        <div className={styles.insightCard}>
                            <h4>N/A</h4>
                            <p>
                                N/A
                            </p>
                        </div>

                        <div className={styles.insightCard}>
                            <h4>N/A</h4>
                            <p>
                                N/A
                            </p>
                        </div>
                    </div>

                    {/* Detailed Panel */}
                    <div className={styles.detailPanel}>
                        <h3>Insight Breakdown</h3>

                        <div className={styles.chartBox}>
                            AI Signal Confidence Chart
                        </div>

                        <div className={styles.metricRow}>
                            <div className={styles.metric}>Bullish Score</div>
                            <div className={styles.metric}>Bearish Score</div>
                            <div className={styles.metric}>Uncertainty</div>
                            <div className={styles.metric}>Signal Strength</div>
                        </div>

                        <div className={styles.aiExplanation}>
                            <strong>AI Explanation</strong>
                            <p>
                                The model weighs price momentum, volume anomalies,
                                on-chain flows, and sentiment embeddings to
                                estimate directional bias and risk exposure.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className={styles.aiBottom}>

                    <div className={styles.warningPanel}>
                        <h3>AI Warnings</h3>
                        <div className={styles.warningCard}>Liquidity Risk Increasing</div>
                        <div className={styles.warningCard}>Sentiment Overheating</div>
                        <div className={styles.warningCard}>Correlation Breakdown</div>
                    </div>

                    <div className={styles.modelPanel}>
                        <h3>Model Performance</h3>
                        <div className={styles.modelCard}>Sentiment Model Accuracy</div>
                        <div className={styles.modelCard}>Trend Detection Precision</div>
                        <div className={styles.modelCard}>Anomaly Recall</div>
                    </div>

                </div>

            </div>
        </div>
    );
}
