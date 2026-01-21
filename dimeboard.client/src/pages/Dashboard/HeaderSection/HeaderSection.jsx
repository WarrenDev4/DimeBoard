import styles from "./Dashboard.module.css";

export default function HeaderSection() {
    return (
        <div className={styles.headerSection}>
            <div className={styles.left}>
                <h1>Dashboard</h1>
                <p>Stock, Crypto & Blockchain Overview</p>
            </div>

            <div className={styles.right}>
                <button className={styles.refreshBtn}>Refresh</button>
            </div>
        </div>
    );
}

