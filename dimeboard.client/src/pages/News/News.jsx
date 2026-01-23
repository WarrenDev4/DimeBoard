import styles from "./News.module.css";

export default function News() {
    return (
        <div className={styles.newsWrapper}>
            <div className={styles.newsContainer}>

                {/* Header */}
                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>News</h1>
                        <p className={styles.subtitle}>
                            Latest stock, crypto, and blockchain updates
                        </p>
                    </div>

                    <div className={styles.newsControls}>
                        <input placeholder="Search news..." />
                        <select>
                            <option>All</option>
                            <option>Stocks</option>
                            <option>Crypto</option>
                            <option>Blockchain</option>
                        </select>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                    <button className={styles.activeTab}>All</button>
                    <button>Stocks</button>
                    <button>Crypto</button>
                    <button>Blockchain</button>
                </div>

                {/* News Grid */}
                <div className={styles.newsGrid}>

                    <div className={styles.newsCard}>
                        <div className={styles.newsImage} />
                        <div className={styles.newsContent}>
                            <span className={styles.tag} data-type="Stock">Stock</span>
                            <h3>N/A</h3>
                            <p>
                                N/A
                            </p>
                            <div className={styles.newsMeta}>
                                <span>N/A</span>
                                <span>0h ago</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.newsCard}>
                        <div className={styles.newsImage} />
                        <div className={styles.newsContent}>
                            <span className={styles.tag} data-type="Crypto">Crypto</span>
                            <h3>N/A</h3>
                            <p>
                                N/A
                            </p>
                            <div className={styles.newsMeta}>
                                <span>N/A</span>
                                <span>0h ago</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.newsCard}>
                        <div className={styles.newsImage} />
                        <div className={styles.newsContent}>
                            <span className={styles.tag} data-type="Blockchain">Blockchain</span>
                            <h3>N/A</h3>
                            <p>
                                N/A
                            </p>
                            <div className={styles.newsMeta}>
                                <span>N/A</span>
                                <span>0h ago</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
