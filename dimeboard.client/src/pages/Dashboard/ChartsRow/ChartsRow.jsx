import styles from "./Dashboard.module.css";

export default function ChartsRow({ children }) {
    return (
        <div className={styles.chartsRow}>
            {children}
        </div>
    );
}
