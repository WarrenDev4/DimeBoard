import styles from "./Blockchain.module.css";

export default function Blockchain() {
    return (
        <div className={styles.blockchainWrapper}>
            <div className={styles.blockchainContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Blockchain</h1>
                    </div>

                    <div className={styles.blockchainControls}>
                        <input placeholder="Search blockchain or protocol..." />
                        <select>
                            <option>All Networks</option>
                            <option>Ethereum</option>
                            <option>Bitcoin</option>
                            <option>Solana</option>
                            <option>Polygon</option>
                            <option>Avalanche</option>
                            <option>Layer 2</option>
                        </select>
                    </div>
                </div>

                <div className={styles.blockchainOverview}>
                    <div className={styles.overviewCard}>Network Activity</div>
                    <div className={styles.overviewCard}>Transactions / sec</div>
                    <div className={styles.overviewCard}>Gas / Fees</div>
                    <div className={styles.overviewCard}>Validator Health</div>
                </div>

                <div className={styles.blockchainMain}>

                    <div className={styles.networkList}>
                        <h3>Networks</h3>
                        <div className={styles.networkItem}>Ethereum</div>
                        <div className={styles.networkItem}>Bitcoin</div>
                        <div className={styles.networkItem}>Solana</div>
                        <div className={styles.networkItem}>Polygon</div>
                        <div className={styles.networkItem}>Avalanche</div>
                        <div className={styles.networkItem}>Arbitrum</div>
                    </div>

                    <div className={styles.networkDetails}>
                        <h3>On-Chain Analytics</h3>

                        <div className={styles.chartBox}>On-chain Activity Chart</div>

                        <div className={styles.statsRow}>
                            <div className={styles.stat}>Block Time</div>
                            <div className={styles.stat}>TPS</div>
                            <div className={styles.stat}>Active Wallets</div>
                            <div className={styles.stat}>Fees</div>
                        </div>

                        <div className={styles.aiPanel}>
                            <h4>AI Chain Analysis</h4>
                            <p>
                                AI explanation of network congestion, validator behavior,
                                decentralization metrics, and security signals.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.blockchainBottom}>

                    <div className={styles.protocolSection}>
                        <h3>Protocol Activity</h3>
                        <div className={styles.protocolCard}>DeFi Protocol Growth</div>
                        <div className={styles.protocolCard}>NFT Volume</div>
                        <div className={styles.protocolCard}>Bridge Flows</div>
                    </div>

                    <div className={styles.aiInsights}>
                        <h3>AI Insights</h3>
                        <div className={styles.aiCard}>Security Risk Alerts</div>
                        <div className={styles.aiCard}>Centralization Warnings</div>
                        <div className={styles.aiCard}>Scalability Forecast</div>
                        <div className={styles.aiCard}>Network Stress Signals</div>
                    </div>

                </div>

            </div>
        </div>
    );
}
