import React, { useState } from 'react';
import styles from "./News.module.css";

export default function News() {

    const filterOptions = ['All', 'Stock', 'Crypto', 'Blockchain'];
    const [categoryTab, setCategoryTab] = useState('All');
    return (
        <div className={styles.newsWrapper}>
            <div className={styles.newsContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>News</h1>
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

                <div className={styles.categoryTabs}>
           
                    {filterOptions.map(tab => (
                        <button
                            key={tab}
                            className={`${styles.categoryTab} ${categoryTab === tab ? styles.categoryTabActive : ''}`}
                            onClick={() => setCategoryTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

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
    );
}
