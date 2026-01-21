// src/components/Dashboard/StatsRow.jsx
import styles from "./Dashboard.module.css";

export default function StatsRow({ children }) {
    return (
        <div className={styles.statsRow}>
            {children}
        </div>
    );
}
