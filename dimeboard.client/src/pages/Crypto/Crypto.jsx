import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Cpu, AlertTriangle, Zap, Droplets, RefreshCw, Clock } from 'lucide-react';
import styles from "./Crypto.module.css";

const API_BASE_URL = 'http://localhost:49901';
const AI_URL = 'http://localhost:49901/api/ai/ask';

async function askAI(prompt) {
    const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error(`AI proxy error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data)
        ? data[0]?.generated_text?.trim()
        : data?.generated_text?.trim();
}

const TOKENS = [
    { id: 'BTC', name: 'Bitcoin', icon: '₿', category: 'Top Market Cap' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', category: 'Layer 1' },
    { id: 'SOL', name: 'Solana', icon: 'S', category: 'Layer 1' },
    { id: 'AVAX', name: 'Avalanche', icon: 'A', category: 'Layer 1' },
    { id: 'LINK', name: 'Chainlink', icon: '⬡', category: 'DeFi' },
    { id: 'RNDR', name: 'Render', icon: 'R', category: 'AI Tokens' },
    { id: 'ADA', name: 'Cardano', icon: 'C', category: 'Layer 1' },
    { id: 'XRP', name: 'Ripple', icon: 'X', category: 'Top Market Cap' },
    { id: 'DOGE', name: 'Dogecoin', icon: 'D', category: 'Trending' },
    { id: 'MATIC', name: 'Polygon', icon: 'M', category: 'Layer 2' },
    { id: 'ARB', name: 'Arbitrum', icon: 'Ar', category: 'Layer 2' },
    { id: 'FET', name: 'Fetch.ai', icon: 'F', category: 'AI Tokens' },
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
        ctx.lineTo(pad + (w - pad * 2), h);
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

export default function Crypto() {
    const [category, setCategory] = useState('All');
    const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
    const [tokenData, setTokenData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [news, setNews] = useState([]);
    const [topMovers, setTopMovers] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [aiSummary, setAiSummary] = useState('');
    const [fearGreed, setFearGreed] = useState('');
    const [whaleActivity, setWhaleActivity] = useState('');
    const [liquidityFlow, setLiquidityFlow] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [tradeSignals, setTradeSignals] = useState('');
    const [riskAlerts, setRiskAlerts] = useState('');
    const [trendForecasts, setTrendForecasts] = useState('');
    const [volPrediction, setVolPrediction] = useState('');

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingFearGreed, setLoadingFearGreed] = useState(false);
    const [loadingWhale, setLoadingWhale] = useState(false);
    const [loadingLiquidity, setLoadingLiquidity] = useState(false);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [loadingSignals, setLoadingSignals] = useState(false);
    const [loadingRisk, setLoadingRisk] = useState(false);
    const [loadingTrend, setLoadingTrend] = useState(false);
    const [loadingVol, setLoadingVol] = useState(false);

    const fetchCryptoData = useCallback(async () => {
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
            setTokenData(map);

            if (data.chartData?.length) {
                setChartData(data.chartData.map((d, i) => ({
                    label: d.date || `D${i + 1}`,
                    value: typeof d.value === 'number' ? d.value : parseFloat(d.value) || 0
                })));
            }

            if (data.news?.length) setNews(data.news.filter(n => n.category === 'Crypto' || n.category === 'Blockchain'));

            const movers = Object.entries(map)
                .filter(([, v]) => v?.change != null)
                .map(([sym, v]) => ({ sym, ...v }))
                .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                .slice(0, 5);
            setTopMovers(movers);

            setLastUpdated(new Date());
        } catch (err) {
            console.error('Crypto fetch error:', err.message);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const load = async () => { if (mounted) await fetchCryptoData(); };
        load();
        const interval = setInterval(() => { if (mounted) fetchCryptoData(); }, 15000);
        return () => { mounted = false; clearInterval(interval); };
    }, [fetchCryptoData]);

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

    const current = tokenData[selectedToken.id];
    const isUp = (current?.change ?? 0) >= 0;
    const chartColor = isUp ? '#10B981' : '#EF4444';
    const filtered = category === 'All' ? TOKENS : TOKENS.filter(t => t.category === category);

    const moverStr = () => topMovers.map(m => `${m.sym} ${fmtChange(m.change)}`).join(', ');

    const handleAiSummary = async () => {
        setLoadingSummary(true); setAiSummary('');
        try {
            const r = await askAI(`[INST] You are a crypto analyst. Give a concise 3-sentence summary of the current crypto market based on these movers: ${moverStr()}. Be factual and professional. [/INST]`);
            setAiSummary(r || 'Unable to generate summary.');
        } catch { setAiSummary('AI service unavailable.'); }
        setLoadingSummary(false);
    };

    const handleFearGreed = async () => {
        setLoadingFearGreed(true); setFearGreed('');
        try {
            const changes = Object.entries(tokenData).map(([s, v]) => `${s}: ${fmtChange(v?.change)}`).join(', ');
            const r = await askAI(`[INST] Based on these crypto price changes: ${changes}. Estimate the current Fear & Greed index (0-100) and explain the market sentiment in 2 sentences. [/INST]`);
            setFearGreed(r || 'Unable to analyze.');
        } catch { setFearGreed('AI service unavailable.'); }
        setLoadingFearGreed(false);
    };

    const handleWhaleActivity = async () => {
        setLoadingWhale(true); setWhaleActivity('');
        try {
            const r = await askAI(`[INST] As a crypto analyst, describe in 2-3 sentences what whale activity (large wallet movements) might look like given these market moves: ${moverStr()}. Be analytical and concise. [/INST]`);
            setWhaleActivity(r || 'Unable to analyze whale activity.');
        } catch { setWhaleActivity('AI service unavailable.'); }
        setLoadingWhale(false);
    };

    const handleLiquidityFlow = async () => {
        setLoadingLiquidity(true); setLiquidityFlow('');
        try {
            const r = await askAI(`[INST] As a DeFi analyst, describe in 2 sentences what liquidity flow conditions likely look like in the current market given these moves: ${moverStr()}. [/INST]`);
            setLiquidityFlow(r || 'Unable to analyze liquidity.');
        } catch { setLiquidityFlow('AI service unavailable.'); }
        setLoadingLiquidity(false);
    };

    const handleAiAnalysis = async () => {
        setLoadingAnalysis(true); setAiAnalysis('');
        try {
            const r = await askAI(`[INST] You are a crypto analyst. Analyze ${selectedToken.name} (${selectedToken.id}) with a price of ${fmt(current?.price)} and a ${fmtChange(current?.change)} change. Explain the price movement, momentum, and trend probability in 3 sentences. [/INST]`);
            setAiAnalysis(r || 'Unable to generate analysis.');
        } catch { setAiAnalysis('AI service unavailable.'); }
        setLoadingAnalysis(false);
    };

    const handleTradeSignals = async () => {
        setLoadingSignals(true); setTradeSignals('');
        try {
            const r = await askAI(`[INST] As a crypto trader, provide 3 brief trade signal observations based on: ${moverStr()}. Format as a numbered list. This is not financial advice. [/INST]`);
            setTradeSignals(r || 'Unable to generate signals.');
        } catch { setTradeSignals('AI service unavailable.'); }
        setLoadingSignals(false);
    };

    const handleRiskAlerts = async () => {
        setLoadingRisk(true); setRiskAlerts('');
        try {
            const bigMovers = Object.entries(tokenData)
                .filter(([, v]) => Math.abs(parseFloat(v?.change ?? 0)) > 3)
                .map(([s, v]) => `${s}: ${fmtChange(v?.change)}`).join(', ');
            const r = await askAI(`[INST] As a risk analyst, identify 2-3 risk alerts for crypto investors based on these significant moves: ${bigMovers || 'no major moves'}. Be cautionary and concise. [/INST]`);
            setRiskAlerts(r || 'No significant risk alerts.');
        } catch { setRiskAlerts('AI service unavailable.'); }
        setLoadingRisk(false);
    };

    const handleTrendForecasts = async () => {
        setLoadingTrend(true); setTrendForecasts('');
        try {
            const r = await askAI(`[INST] As a crypto analyst, provide short-term trend forecasts in 3 sentences for the top movers: ${moverStr()}. Be analytical but include that forecasts are not guarantees. [/INST]`);
            setTrendForecasts(r || 'Unable to generate forecasts.');
        } catch { setTrendForecasts('AI service unavailable.'); }
        setLoadingTrend(false);
    };

    const handleVolPrediction = async () => {
        setLoadingVol(true); setVolPrediction('');
        try {
            const avgVol = topMovers.reduce((s, m) => s + Math.abs(parseFloat(m.change) || 0), 0) / (topMovers.length || 1);
            const r = await askAI(`[INST] As a quant analyst, predict volatility conditions for crypto markets in the next 24 hours based on current average move of ${avgVol.toFixed(2)}% across top tokens: ${moverStr()}. Give a 2-sentence prediction. [/INST]`);
            setVolPrediction(r || 'Unable to predict volatility.');
        } catch { setVolPrediction('AI service unavailable.'); }
        setLoadingVol(false);
    };

    return (
        <div className={styles.cryptoWrapper}>
            <div className={styles.cryptoContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Crypto</h1>
                        {lastUpdated && (
                            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        )}
                    </div>
                    <div className={styles.cryptoControls}>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Top Market Cap">Top Market Cap</option>
                            <option value="Trending">Trending</option>
                            <option value="DeFi">DeFi</option>
                            <option value="Layer 1">Layer 1</option>
                            <option value="Layer 2">Layer 2</option>
                            <option value="AI Tokens">AI Tokens</option>
                        </select>
                        <button
                            onClick={fetchCryptoData}
                            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                </div>

            
                <div className={styles.cryptoOverview}>

                
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Cpu size={12} style={{ marginRight: 4 }} />Crypto Summary</p>
                        <div style={{ minHeight: 55 }}>
                            {aiSummary
                                ? <p style={aiTextStyle}>{aiSummary}</p>
                                : <p style={placeholderStyle}>Click below for an AI-powered crypto market summary.</p>
                            }
                        </div>
                        <button style={loadingSummary ? btnDisabled : btn} onClick={handleAiSummary} disabled={loadingSummary}>
                            {loadingSummary ? 'Generating...' : 'Generate Summary'}
                        </button>
                    </div>

             
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />Fear & Greed Index</p>
                        <div style={{ minHeight: 55 }}>
                            {fearGreed
                                ? <p style={aiTextStyle}>{fearGreed}</p>
                                : <p style={placeholderStyle}>Click below to estimate current market fear & greed.</p>
                            }
                        </div>
                        <button style={loadingFearGreed ? btnDisabled : btn} onClick={handleFearGreed} disabled={loadingFearGreed}>
                            {loadingFearGreed ? 'Analyzing...' : 'Analyze Sentiment'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Whale Activity</p>
                        <div style={{ minHeight: 55 }}>
                            {whaleActivity
                                ? <p style={aiTextStyle}>{whaleActivity}</p>
                                : <p style={placeholderStyle}>Click below to analyze potential whale movements.</p>
                            }
                        </div>
                        <button style={loadingWhale ? btnDisabled : btn} onClick={handleWhaleActivity} disabled={loadingWhale}>
                            {loadingWhale ? 'Analyzing...' : 'Check Whale Activity'}
                        </button>
                    </div>

                    
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Droplets size={12} style={{ marginRight: 4 }} />Liquidity Flow</p>
                        <div style={{ minHeight: 55 }}>
                            {liquidityFlow
                                ? <p style={aiTextStyle}>{liquidityFlow}</p>
                                : <p style={placeholderStyle}>Click below to analyze DeFi liquidity conditions.</p>
                            }
                        </div>
                        <button style={loadingLiquidity ? btnDisabled : btn} onClick={handleLiquidityFlow} disabled={loadingLiquidity}>
                            {loadingLiquidity ? 'Analyzing...' : 'Check Liquidity'}
                        </button>
                    </div>

                </div>

              
                <div className={styles.cryptoMain}>

                  
                    <div className={styles.tokenList}>
                        <h3 style={sectionTitleStyle}>Tokens</h3>
                        {filtered.map(token => {
                            const d = tokenData[token.id];
                            const up = (d?.change ?? 0) >= 0;
                            const active = selectedToken.id === token.id;
                            return (
                                <div
                                    key={token.id + token.category}
                                    className={styles.tokenItem}
                                    onClick={() => { setSelectedToken(token); setAiAnalysis(''); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: active ? '#EEF2FF' : undefined,
                                        border: active ? '1px solid #C7D2FE' : '1px solid transparent',
                                    }}
                                >
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: active ? '#E0E7FF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: active ? '#4F46E5' : '#475569', flexShrink: 0 }}>
                                        {token.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{token.id}</div>
                                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{token.name}</div>
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

                  
                    <div className={styles.tokenDetails}>

                     
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ background: '#F1F5F9', borderRadius: 8, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{selectedToken.icon}</span>
                                    {selectedToken.name}
                                    <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>{selectedToken.id}</span>
                                </h3>
                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{selectedToken.category}</span>
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
                                <div style={statLabelStyle}>24h Change</div>
                                <div style={{ ...statValueStyle, color: isUp ? '#10B981' : '#EF4444' }}>
                                    {current ? fmtChange(current.change) : '—'}
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Volume</div>
                                <div style={statValueStyle}>—</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Market Cap</div>
                                <div style={statValueStyle}>—</div>
                            </div>
                        </div>

                   
                        <div className={styles.aiPanel}>
                            <h4>AI Market Analysis — {selectedToken.name}</h4>
                            {aiAnalysis
                                ? <p>{aiAnalysis}</p>
                                : <p>Click below to get an AI-generated analysis of {selectedToken.id}'s price movement, sentiment, momentum, and trend probability.</p>
                            }
                            <button
                                style={{ ...(loadingAnalysis ? btnDisabled : btn), marginTop: 10 }}
                                onClick={handleAiAnalysis}
                                disabled={loadingAnalysis}
                            >
                                {loadingAnalysis ? 'Analyzing...' : `Analyze ${selectedToken.id}`}
                            </button>
                        </div>
                    </div>
                </div>

     
                <div className={styles.cryptoBottom}>

                    <div className={styles.newsSection}>
                        <h3 style={sectionTitleStyle}><Newspaper size={15} style={{ marginRight: 6 }} />Crypto News</h3>
                        {news.length > 0
                            ? news.slice(0, 4).map((n, i) => (
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
                            ))
                            : ['No crypto news available yet.'].map((h, i) => (
                                <div key={i} className={styles.newsCard} style={{ fontSize: 13, color: '#94A3B8' }}>{h}</div>
                            ))
                        }
                    </div>

           
                    <div className={styles.aiInsights}>
                        <h3 style={sectionTitleStyle}><Cpu size={15} style={{ marginRight: 6 }} />AI Insights</h3>

              
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />AI Trade Signals</p>
                            {tradeSignals
                                ? <p style={aiTextStyle}>{tradeSignals}</p>
                                : <p style={placeholderStyle}>Click below for AI-generated trade signal observations.</p>
                            }
                            <button style={{ ...(loadingSignals ? btnDisabled : btn), marginTop: 8 }} onClick={handleTradeSignals} disabled={loadingSignals}>
                                {loadingSignals ? 'Generating...' : 'Get Trade Signals'}
                            </button>
                        </div>

                        <div className={styles.aiCard}>
                            <p style={labelStyle}><AlertTriangle size={12} style={{ marginRight: 4 }} />Risk Alerts</p>
                            {riskAlerts
                                ? <p style={aiTextStyle}>{riskAlerts}</p>
                                : <p style={placeholderStyle}>Click below to identify current crypto risk factors.</p>
                            }
                            <button style={{ ...(loadingRisk ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleRiskAlerts} disabled={loadingRisk}>
                                {loadingRisk ? 'Analyzing...' : 'Check Risk Alerts'}
                            </button>
                        </div>

            
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Trend Forecasts</p>
                            {trendForecasts
                                ? <p style={aiTextStyle}>{trendForecasts}</p>
                                : <p style={placeholderStyle}>Click below for short-term trend forecast analysis.</p>
                            }
                            <button style={{ ...(loadingTrend ? btnDisabled : btn), marginTop: 8 }} onClick={handleTrendForecasts} disabled={loadingTrend}>
                                {loadingTrend ? 'Forecasting...' : 'Get Trend Forecasts'}
                            </button>
                        </div>

                        <div className={styles.aiCard}>
                            <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />Volatility Prediction</p>
                            {volPrediction
                                ? <p style={aiTextStyle}>{volPrediction}</p>
                                : <p style={placeholderStyle}>Click below for a 24-hour volatility prediction.</p>
                            }
                            <button style={{ ...(loadingVol ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleVolPrediction} disabled={loadingVol}>
                                {loadingVol ? 'Predicting...' : 'Predict Volatility'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const labelStyle = {
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

const btn = {
    padding: '7px 14px',
    background: '#6366F1',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
};

const btnWarning = {
    ...btn,
    background: '#F59E0B',
};

const btnDisabled = {
    ...btn,
    background: '#E5E7EB',
    color: '#9CA3AF',
    cursor: 'not-allowed',
};
