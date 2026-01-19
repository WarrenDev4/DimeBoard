import styles from "./Dashboard.module.css";

export default function BottomRow({ children }) {
    return (
        <div className={styles.bottomRow}>
            {children}
        </div>
    );
}
