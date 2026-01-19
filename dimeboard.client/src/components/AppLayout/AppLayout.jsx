import { Outlet, NavLink } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { FaChartBar, FaNewspaper, FaStar, FaLink, FaRobot } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiBitCoinLine } from "react-icons/ri";
import { BsGraphUp } from "react-icons/bs";

export default function AppLayout() {
    return (
        <div className={styles.appLayout}>
            {/* Sidebar */ }
            <aside className={styles.sidebar}>
                <a href="/app" className={styles.logo}>DimeBoard</a>
                    <nav className={styles.sidebarLinks}>
                    <NavLink to="/app" className={({ isActive }) =>
                        isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <MdDashboard className={styles.icon} />
                        <span>Dashboard</span>
                        </NavLink>
                    <NavLink to="/markets" className={({ isActive }) =>
                          isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <BsGraphUp className={styles.icon} />
                        <span>Markets</span>
                    </NavLink>
                    <NavLink to="/crypto" className={({ isActive }) =>
                        isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <RiBitCoinLine className={styles.icon} />
                        <span>Crypto</span>
                    </NavLink>
                    <NavLink to="/blockchain" className={({ isActive }) =>
                            isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <FaLink className={styles.icon} />
                        <span>Blockchain</span>
                    </NavLink>
                    <NavLink to="/ai" className={({ isActive }) =>
                            isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <FaRobot className={styles.icon} />
                        <span>AI Insights</span>
                    </NavLink>
                    <NavLink to="/news" className={({ isActive }) =>
                            isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink }>
                        <FaNewspaper className={styles.icon} />
                        <span>News</span>
                    </NavLink>
                </nav>
                <div className={styles.spacer}></div>
                <div className={styles.authButtons}>
                    <a href="/login" className={styles.loginLink}>Log In</a>
                    <a href="/signup" className={styles.signUpLink}>Sign Up</a>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}