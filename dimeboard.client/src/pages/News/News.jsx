import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import styles from "./News.module.css";

const API_BASE_URL = 'http://localhost:49901';

const filterOptions = ['All', 'Stock', 'Crypto', 'Blockchain'];

export default function News() {
    const [categoryTab, setCategoryTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [allNews, setAllNews] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNews = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!res.ok) return;
            const data = await res.json();

            if (data.news?.length) {
                setAllNews(data.news);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('News fetch error:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const load = async () => { if (mounted) await fetchNews(); };
        load();
        const interval = setInterval(() => { if (mounted) fetchNews(); }, 30000);
        return () => { mounted = false; clearInterval(interval); };
    }, [fetchNews]);

    const filteredNews = allNews.filter(article => {
        const matchesCategory = categoryTab === 'All' || article.category === categoryTab;
        const matchesSearch = searchQuery === ''
            || article.title?.toLowerCase().includes(searchQuery.toLowerCase())
            || article.description?.toLowerCase().includes(searchQuery.toLowerCase())
            || article.source?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const placeholders = [
        { id: 'p1', category: 'Stock', title: 'Loading...', description: 'Fetching latest stock news...', source: '—', time: '—', url: '#', imageUrl: '' },
        { id: 'p2', category: 'Crypto', title: 'Loading...', description: 'Fetching latest crypto news...', source: '—', time: '—', url: '#', imageUrl: '' },
        { id: 'p3', category: 'Blockchain', title: 'Loading...', description: 'Fetching latest blockchain news...', source: '—', time: '—', url: '#', imageUrl: '' },
    ];

    const displayNews = loading ? placeholders : filteredNews.length > 0 ? filteredNews : [];

    return (
        <div className={styles.newsWrapper}>
            <div className={styles.newsContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>News</h1>
                        {lastUpdated && (
                            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        )}
                    </div>
                    <div className={styles.newsControls}>
                        <input
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <select
                            value={categoryTab}
                            onChange={e => setCategoryTab(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Stock">Stocks</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                        <button
                            onClick={fetchNews}
                            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
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
                            {tab !== 'All' && (
                                <span style={{
                                    marginLeft: 6,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: categoryTab === tab ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                                    color: categoryTab === tab ? '#fff' : '#64748B',
                                    padding: '1px 6px',
                                    borderRadius: 99
                                }}>
                                    {allNews.filter(n => n.category === tab).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 1450, margin: '0 auto', padding: '0 28px 28px' }}>

                {!loading && displayNews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
                        <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>No articles found</p>
                        <p style={{ fontSize: 13, margin: 0 }}>
                            {searchQuery ? `No results for "${searchQuery}"` : `No ${categoryTab} news available yet.`}
                        </p>
                    </div>
                )}

                <div className={styles.newsGrid}>
                    {displayNews.map(article => (
                        <a
                            key={article.id}
                            href={article.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                            <div className={styles.newsCard}>

                                <div className={styles.newsImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                    {article.imageUrl ? (
                                        <img
                                            src={article.imageUrl}
                                            alt={article.source}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={e => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                </div>

                       
                                <div className={styles.newsContent}>
                                    <span
                                        className={styles.tag}
                                        data-type={article.category}
                                    >
                                        {article.category}
                                    </span>

                                    <h3>{article.title}</h3>

                                    <p>{article.description}</p>

                                    <div className={styles.newsMeta}>
                                        <span style={{ fontWeight: 600 }}>{article.source}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Clock size={11} /> {article.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
}
