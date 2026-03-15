import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Cpu, AlertTriangle, Star, RefreshCw, Clock } from 'lucide-react';
import styles from "./Markets.module.css";

const API_BASE_URL = 'http://localhost:49901';
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

async function askHuggingFace(prompt) {
    const res = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 300, temperature: 0.7, return_full_text: false }
            })
        }
    );
    if (!res.ok) throw new Error(`HuggingFace error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data)
        ? data[0]?.generated_text?.trim()
        : data?.generated_text?.trim();
}

const ASSETS = [
    { id: 'BTC', name: 'Bitcoin', type: 'Crypto', icon: '₿' },
    { id: 'ETH', name: 'Ethereum', type: 'Crypto', icon: 'Ξ' },
    { id: 'SOL', name: 'Solana', type: 'Crypto', icon: 'S' },
    { id: 'ADA', name: 'Cardano', type: 'Crypto', icon: 'A' },
    { id: 'XRP', name: 'Ripple', type: 'Crypto', icon: 'X' },
    { id: 'DOGE', name: 'Dogecoin', type: 'Crypto', icon: 'D' },
    { id: 'SPX', name: 'S&P 500', type: 'Stocks', icon: 'S' },
    { id: 'NDX', name: 'NASDAQ', type: 'Stocks', icon: 'N' },
    { id: 'DJI', name: 'Dow Jones', type: 'Stocks', icon: 'D' },
    { id: 'ETH', name: 'Ethereum', type: 'Blockchain', icon: 'Ξ' },
    { id: 'DOT', name: 'Polkadot', type: 'Blockchain', icon: '●' },
    { id: 'LINK', name: 'Chainlink', type: 'Blockchain', icon: '⬡' },
    { id: 'MATIC', name: 'Polygon', type: 'Blockchain', icon: 'M' },
];

function SparklineChart({ data, color = '#6366F1' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !data?.length) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const vals = data.map(d => typeof d.value === 'number' ? d.value : parseFloat(d.value) || 0);
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const range = max - min || 1;
        const pad = 14;

        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color + '33');
        grad.addColorStop(1, color + '00');

        ctx.beginPath();
        vals.forEach((v, i) => {
            const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
            const y = h - pad - ((v - min) / range) * (h - pad * 2);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        const lastX = pad + (w - pad * 2);
        ctx.lineTo(lastX, h);
        ctx.lineTo(pad, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        vals.forEach((v, i) => {
            const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
            const y = h - pad - ((v - min) / range) * (h - pad * 2);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        data.forEach((d, i) => {
            const x = pad + (i / (data.length - 1)) * (w - pad * 2);
            ctx.fillText(d.label || '', x, h - 2);
        });
    }, [data, color]);

    return (
        <canvas
            ref={canvasRef}
            width={700}
            height={220}
            style={{ width: '100%', height: '220px', display: 'block' }}
        />
    );
}

export default function Markets() {
    const [filter, setFilter] = useState('All');
    const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
    const [assetData, setAssetData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [news, setNews] = useState([]);
    const [topMovers, setTopMovers] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [aiSummary, setAiSummary] = useState('');
    const [aiSentiment, setAiSentiment] = useState('');
    const [aiExplanation, setAiExplanation] = useState('');
    const [aiRecommendations, setAiRecommendations] = useState('');
    const [aiWarnings, setAiWarnings] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingSentiment, setLoadingSentiment] = useState(false);
    const [loadingExplain, setLoadingExplain] = useState(false);
    const [loadingRecommend, setLoadingRecommend] = useState(false);
    const [loadingWarnings, setLoadingWarnings] = useState(false);

    const fetchMarketData = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!res.ok) return;
            const data = await res.json();

            const map = {};
            data.cryptoPairs?.forEach(p => {
                const sym = p.pair?.split('/')[0];
                if (sym) map[sym] = { price: p.price, change: p.change };
            });
            data.cryptocurrencies?.forEach(c => {
                if (!map[c.symbol]) map[c.symbol] = { price: c.price, change: c.change };
            });
            data.stockIndices?.forEach(s => {
                const sym = s.symbol?.replace('^', '');
                map[sym] = { price: s.price, change: s.change };
                if (s.name === 'S&P 500') map['SPX'] = map[sym];
                if (s.name === 'NASDAQ') map['NDX'] = map[sym];
                if (s.name === 'Dow Jones') map['DJI'] = map[sym];
            });
            setAssetData(map);

            if (data.chartData?.length) {
                setChartData(data.chartData.map((d, i) => ({
                    label: d.date || `D${i + 1}`,
                    value: typeof d.value === 'number' ? d.value : parseFloat(d.value) || 0
                })));
            }

            if (data.news?.length) setNews(data.news);

            const movers = Object.entries(map)
                .filter(([, v]) => v?.change != null)
                .map(([sym, v]) => ({ sym, ...v }))
                .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                .slice(0, 4);
            setTopMovers(movers);

            setLastUpdated(new Date());
        } catch (err) {
            console.error('Markets fetch error:', err.message);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (mounted) await fetchMarketData();
        };

        load();

        const interval = setInterval(() => {
            if (mounted) fetchMarketData();
        }, 15000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [fetchMarketData]);

    const fmt = (price) => {
        if (price == null) return '—';
        const n = typeof price === 'string' ? parseFloat(price.replace(/[$,]/g, '')) : price;
        if (isNaN(n)) return String(price);
        if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return '$' + n.toFixed(4);
    };

    const fmtChange = (change) => {
        const n = parseFloat(change ?? 0);
        return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
    };

    const current = assetData[selectedAsset.id];
    const isUp = (current?.change ?? 0) >= 0;
    const chartColor = isUp ? '#10B981' : '#EF4444';
    const filtered = filter === 'All' ? ASSETS : ASSETS.filter(a => a.type === filter);

    const avgVol = topMovers.length
        ? topMovers.reduce((s, m) => s + Math.abs(parseFloat(m.change) || 0), 0) / topMovers.length
        : 0;
    const volLevel = avgVol > 4 ? 'High' : avgVol > 2 ? 'Moderate' : 'Low';
    const volColor = avgVol > 4 ? '#EF4444' : avgVol > 2 ? '#F59E0B' : '#10B981';

   
    const handleAiSummary = async () => {
        setLoadingSummary(true); setAiSummary('');
        try {
            const topStr = topMovers.map(m => `${m.sym} ${fmtChange(m.change)}`).join(', ');
            const result = await askHuggingFace(
                `[INST] You are a financial analyst. Give a concise 3-sentence daily market summary based on these top movers: ${topStr}. Be factual and professional. [/INST]`
            );
            setAiSummary(result || 'Unable to generate summary.');
        } catch { setAiSummary('AI service unavailable. Check your HuggingFace API key.'); }
        setLoadingSummary(false);
    };

    const handleAiSentiment = async () => {
        setLoadingSentiment(true); setAiSentiment('');
        try {
            const changes = Object.entries(assetData).map(([sym, v]) => `${sym}: ${fmtChange(v?.change)}`).join(', ');
            const result = await askHuggingFace(
                `[INST] Based on these asset price changes: ${changes}. Analyze the overall market sentiment in 2-3 sentences. Is it bullish, bearish, or neutral? [/INST]`
            );
            setAiSentiment(result || 'Unable to analyze sentiment.');
        } catch { setAiSentiment('AI service unavailable. Check your HuggingFace API key.'); }
        setLoadingSentiment(false);
    };

    const handleAiExplanation = async () => {
        setLoadingExplain(true); setAiExplanation('');
        try {
            const result = await askHuggingFace(
                `[INST] You are a financial analyst. Explain in 3 sentences what a ${fmtChange(current?.change)} price change for ${selectedAsset.name} (${selectedAsset.id}) at ${fmt(current?.price)} likely means for investors. Be concise and insightful. [/INST]`
            );
            setAiExplanation(result || 'Unable to generate explanation.');
        } catch { setAiExplanation('AI service unavailable. Check your HuggingFace API key.'); }
        setLoadingExplain(false);
    };

    const handleAiRecommendations = async () => {
        setLoadingRecommend(true); setAiRecommendations('');
        try {
            const topStr = topMovers.map(m => `${m.sym} ${fmtChange(m.change)}`).join(', ');
            const result = await askHuggingFace(
                `[INST] As a financial analyst, provide 3 brief investment considerations based on current market data: ${topStr}. Format as a numbered list. Include a disclaimer that this is not financial advice. [/INST]`
            );
            setAiRecommendations(result || 'Unable to generate recommendations.');
        } catch { setAiRecommendations('AI service unavailable. Check your HuggingFace API key.'); }
        setLoadingRecommend(false);
    };

    const handleAiWarnings = async () => {
        setLoadingWarnings(true); setAiWarnings('');
        try {
            const bigMovers = Object.entries(assetData)
                .filter(([, v]) => Math.abs(parseFloat(v?.change ?? 0)) > 2)
                .map(([sym, v]) => `${sym}: ${fmtChange(v?.change)}`)
                .join(', ');
            const result = await askHuggingFace(
                `[INST] As a risk analyst, identify 2-3 potential trend warnings based on these significant market moves: ${bigMovers || 'no major moves today'}. Be concise and cautionary. [/INST]`
            );
            setAiWarnings(result || 'No significant warnings at this time.');
        } catch { setAiWarnings('AI service unavailable. Check your HuggingFace API key.'); }
        setLoadingWarnings(false);
    };

   
    return (
        <div className={styles.marketsWrapper}>
            <div className={styles.marketsContainer}>

               
                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.title}>Markets</h1>
                        {lastUpdated && (
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        )}
                    </div>
                  
                    <div className={styles.marketsControls}>
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            <option value="All">All Assets</option>
                            <option value="Stocks">Stocks</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                        <button
                            onClick={fetchMarketData}
                            style={{
                                padding: '10px 14px',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                background: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                transition: 'box-shadow 0.2s'
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                </div>

            
                <div className={styles.marketsOverview}>

                   
                    <div className={styles.overviewCard}>
                        <p style={cardLabelStyle}><Cpu size={13} style={{ marginRight: 5 }} />AI Market Summary</p>
                        <div style={{ flex: 1, minHeight: 60 }}>
                            {aiSummary
                                ? <p style={aiTextStyle}>{aiSummary}</p>
                                : <p style={placeholderStyle}>Click below to generate an AI-powered summary of today's market.</p>
                            }
                        </div>
                        <button style={loadingSummary ? aiBtnDisabled : aiBtn} onClick={handleAiSummary} disabled={loadingSummary}>
                            {loadingSummary ? 'Generating...' : 'Generate Summary'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={cardLabelStyle}><Star size={13} style={{ marginRight: 5 }} />Market Sentiment</p>
                        <div style={{ flex: 1, minHeight: 60 }}>
                            {aiSentiment
                                ? <p style={aiTextStyle}>{aiSentiment}</p>
                                : <p style={placeholderStyle}>Click below to analyze overall market sentiment using AI.</p>
                            }
                        </div>
                        <button style={loadingSentiment ? aiBtnDisabled : aiBtn} onClick={handleAiSentiment} disabled={loadingSentiment}>
                            {loadingSentiment ? 'Analyzing...' : 'Analyze Sentiment'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={cardLabelStyle}><TrendingUp size={13} style={{ marginRight: 5 }} />Top Movers</p>
                        <div style={{ flex: 1 }}>
                            {topMovers.length > 0
                                ? topMovers.map(m => (
                                    <div key={m.sym} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{m.sym}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: m.change >= 0 ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            {m.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {fmtChange(m.change)}
                                        </span>
                                    </div>
                                ))
                                : <p style={placeholderStyle}>Loading movers...</p>
                            }
                        </div>
                    </div>

                    <div className={styles.overviewCard}>
                        <p style={cardLabelStyle}><AlertTriangle size={13} style={{ marginRight: 5 }} />Volatility Index</p>
                        <div style={{ flex: 1 }}>
                            {topMovers.length > 0 ? (
                                <>
                                    <p style={{ fontSize: 28, fontWeight: 700, color: volColor, margin: '4px 0 2px' }}>{avgVol.toFixed(2)}%</p>
                                    <p style={{ fontSize: 12, color: volColor, margin: '0 0 10px' }}>Average Move: {volLevel}</p>
                                    <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(avgVol * 10, 100)}%`, background: volColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
                                    </div>
                                </>
                            ) : <p style={placeholderStyle}>Loading volatility data...</p>}
                        </div>
                    </div>
                </div>

            
                <div className={styles.marketsMain}>

               
                    <div className={styles.assetList}>
                        <h3 style={sectionTitleStyle}>Assets</h3>
                        {filtered.map(asset => {
                            const d = assetData[asset.id];
                            const up = (d?.change ?? 0) >= 0;
                            const active = selectedAsset.id === asset.id;
                            return (
                                <div
                                    key={asset.id}
                                    className={styles.assetItem}
                                    onClick={() => { setSelectedAsset(asset); setAiExplanation(''); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: active ? '#EEF2FF' : undefined,
                                        border: active ? '1px solid #C7D2FE' : '1px solid transparent',
                                    }}
                                >
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: active ? '#E0E7FF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: active ? '#4F46E5' : '#475569', flexShrink: 0 }}>
                                        {asset.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{asset.id}</div>
                                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{asset.name}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {d
                                            ? <>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{fmt(d.price)}</div>
                                                <div style={{ fontSize: 11, fontWeight: 600, color: up ? '#10B981' : '#EF4444' }}>{fmtChange(d.change)}</div>
                                            </>
                                            : <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>

             
                    <div className={styles.assetDetails}>
                      
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ background: '#F1F5F9', borderRadius: 8, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{selectedAsset.icon}</span>
                                    {selectedAsset.name}
                                    <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>{selectedAsset.id}</span>
                                </h3>
                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{selectedAsset.type}</span>
                            </div>
                            {current && (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{fmt(current.price)}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: isUp ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {fmtChange(current.change)}
                                    </div>
                                </div>
                            )}
                        </div>

                    
                        <div className={styles.chartBox} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {chartData.length > 0
                                ? <SparklineChart data={chartData} color={chartColor} />
                                : <span style={{ color: '#94A3B8', fontSize: 13 }}>Loading chart...</span>
                            }
                        </div>

                 
                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Price</div>
                                <div style={statValueStyle}>{current ? fmt(current.price) : '—'}</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Volume</div>
                                <div style={statValueStyle}>—</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Change</div>
                                <div style={{ ...statValueStyle, color: isUp ? '#10B981' : '#EF4444' }}>
                                    {current ? fmtChange(current.change) : '—'}
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Market Cap</div>
                                <div style={statValueStyle}>—</div>
                            </div>
                        </div>

                    
                        <div className={styles.aiExplanation}>
                            <p style={{ ...cardLabelStyle, color: '#475569', marginBottom: 8 }}>
                                <Cpu size={13} style={{ marginRight: 5 }} />AI Trend Explanation — {selectedAsset.name}
                            </p>
                            {aiExplanation
                                ? <p style={aiTextStyle}>{aiExplanation}</p>
                                : <p style={placeholderStyle}>Click below to get an AI explanation of the current {selectedAsset.id} trend.</p>
                            }
                            <button style={{ ...(loadingExplain ? aiBtnDisabled : aiBtn), marginTop: 10 }} onClick={handleAiExplanation} disabled={loadingExplain}>
                                {loadingExplain ? 'Analyzing...' : `Explain ${selectedAsset.id} Trend`}
                            </button>
                        </div>
                    </div>
                </div>

              
                <div className={styles.marketsBottom}>

              
                    <div className={styles.newsSection}>
                        <h3 style={sectionTitleStyle}><Newspaper size={15} style={{ marginRight: 6 }} />Market News</h3>
                        {(news.length > 0 ? news.slice(0, 4) : []).map((n, i) => (
                            <a
                                key={n.id ?? i}
                                href={n.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                            >
                                <div className={styles.newsCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6366F1', background: '#EEF2FF', padding: '2px 6px', borderRadius: 4 }}>{n.category}</span>
                                        <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Clock size={10} /> {n.time}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', lineHeight: 1.45 }}>{n.title}</div>
                                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{n.source}</div>
                                </div>
                            </a>
                        ))}
                        {news.length === 0 && (
                            <>
                                {['Headline 1', 'Headline 2', 'Headline 3'].map(h => (
                                    <div key={h} className={styles.newsCard} style={{ fontSize: 13, color: '#94A3B8' }}>{h}</div>
                                ))}
                            </>
                        )}
                    </div>

             
                    <div className={styles.aiInsights}>
                        <h3 style={sectionTitleStyle}><Cpu size={15} style={{ marginRight: 6 }} />AI Insights</h3>

                     
                        <div className={styles.aiCard}>
                            <p style={cardLabelStyle}><Star size={12} style={{ marginRight: 4 }} />Daily Market Summary</p>
                            {aiSummary
                                ? <p style={aiTextStyle}>{aiSummary}</p>
                                : <p style={placeholderStyle}>Generate a summary using the card above.</p>
                            }
                        </div>

                       
                        <div className={styles.aiCard}>
                            <p style={cardLabelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Recommendations</p>
                            {aiRecommendations
                                ? <p style={aiTextStyle}>{aiRecommendations}</p>
                                : <p style={placeholderStyle}>Click below for AI-generated investment considerations.</p>
                            }
                            <button style={{ ...(loadingRecommend ? aiBtnDisabled : aiBtn), marginTop: 8 }} onClick={handleAiRecommendations} disabled={loadingRecommend}>
                                {loadingRecommend ? 'Generating...' : 'Get Recommendations'}
                            </button>
                        </div>

                 
                        <div className={styles.aiCard}>
                            <p style={cardLabelStyle}><AlertTriangle size={12} style={{ marginRight: 4 }} />Trend Warnings</p>
                            {aiWarnings
                                ? <p style={aiTextStyle}>{aiWarnings}</p>
                                : <p style={placeholderStyle}>Click below to identify potential market risks.</p>
                            }
                            <button style={{ ...(loadingWarnings ? aiBtnDisabled : aiBtnWarning), marginTop: 8 }} onClick={handleAiWarnings} disabled={loadingWarnings}>
                                {loadingWarnings ? 'Analyzing...' : 'Check Warnings'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const cardLabelStyle = {
    margin: '0 0 8px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
};

const sectionTitleStyle = {
    margin: '0 0 14px',
    fontSize: 15,
    fontWeight: 700,
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
};

const statLabelStyle = {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
};

const statValueStyle = {
    fontSize: 15,
    fontWeight: 700,
    color: '#0F172A',
};

const aiTextStyle = {
    fontSize: 13,
    color: '#334155',
    lineHeight: 1.65,
    margin: 0,
    whiteSpace: 'pre-wrap',
};

const placeholderStyle = {
    fontSize: 12,
    color: '#94A3B8',
    margin: 0,
    fontStyle: 'italic',
};

const aiBtn = {
    padding: '8px 16px',
    background: '#6366F1',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
};

const aiBtnWarning = {
    ...aiBtn,
    background: '#F59E0B',
};

const aiBtnDisabled = {
    ...aiBtn,
    background: '#E5E7EB',
    color: '#9CA3AF',
    cursor: 'not-allowed',
};

