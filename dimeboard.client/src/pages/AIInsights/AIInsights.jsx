import { useState, useEffect, useCallback, } from 'react';
import { TrendingUp, TrendingDown, Cpu, AlertTriangle, RefreshCw, Zap, BarChart2, Shield, Activity } from 'lucide-react';
import styles from "./AIInsights.module.css";

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

function ConfidenceBar({ label, value, color }) {
    return (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color }}>{value}%</span>
            </div>
            <div style={{ height: 7, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
        </div>
    );
}


export default function AIInsights() {
    const [marketFilter, setMarketFilter] = useState('All Markets');
    const [timeFilter, setTimeFilter] = useState('Last 24 Hours');
    const [topMovers, setTopMovers] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    
    const [scores, setScores] = useState({ bullish: 0, bearish: 0, uncertainty: 0, signalStrength: 0 });

    
    const [marketDirection, setMarketDirection] = useState('');
    const [riskLevel, setRiskLevel] = useState('');
    const [volatilityOut, setVolatilityOut] = useState('');
    const [aiConfidence, setAiConfidence] = useState('');

    const [feedCards, setFeedCards] = useState([
        { title: 'Market Momentum Analysis', body: '', loading: false },
        { title: 'Volume & Liquidity Signals', body: '', loading: false },
        { title: 'Sentiment & On-Chain Flow', body: '', loading: false },
    ]);

    const [aiExplanation, setAiExplanation] = useState('');

    const [liquidityRisk, setLiquidityRisk] = useState('');
    const [sentimentOver, setSentimentOver] = useState('');
    const [correlationBreak, setCorrelationBreak] = useState('');
    const [sentimentAcc, setSentimentAcc] = useState('');
    const [trendPrecision, setTrendPrecision] = useState('');
    const [anomalyRecall, setAnomalyRecall] = useState('');

    const [loadingDirection, setLoadingDirection] = useState(false);
    const [loadingRisk, setLoadingRisk] = useState(false);
    const [loadingVol, setLoadingVol] = useState(false);
    const [loadingConfidence, setLoadingConfidence] = useState(false);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const [loadingLiquidity, setLoadingLiquidity] = useState(false);
    const [loadingSentOver, setLoadingSentOver] = useState(false);
    const [loadingCorrelation, setLoadingCorrelation] = useState(false);
    const [loadingSentAcc, setLoadingSentAcc] = useState(false);
    const [loadingTrend, setLoadingTrend] = useState(false);
    const [loadingAnomaly, setLoadingAnomaly] = useState(false);

   
    const fetchData = useCallback(async () => {
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
                if (sym) map[sym] = { price: p.price, change: p.change, type: 'Crypto' };
            });
            data.cryptocurrencies?.forEach(c => {
                if (!map[c.symbol]) map[c.symbol] = { price: c.price, change: c.change, type: 'Crypto' };
            });
            data.stockIndices?.forEach(s => {
                const sym = s.symbol?.replace('^', '');
                map[sym] = { price: s.price, change: s.change, type: 'Stocks' };
                if (s.name === 'S&P 500') map['SPX'] = map[sym];
                if (s.name === 'NASDAQ') map['NDX'] = map[sym];
                if (s.name === 'Dow Jones') map['DJI'] = map[sym];
            });

            
            const filtered = marketFilter === 'All Markets'
                ? map
                : Object.fromEntries(Object.entries(map).filter(([, v]) => v.type === marketFilter));

            const movers = Object.entries(filtered)
                .filter(([, v]) => v?.change != null)
                .map(([sym, v]) => ({ sym, ...v }))
                .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                .slice(0, 6);
            setTopMovers(movers);

           
            const changes = Object.values(filtered).map(v => parseFloat(v?.change ?? 0));
            const avgChange = changes.length ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
            const posCount = changes.filter(c => c > 0).length;
            const negCount = changes.filter(c => c < 0).length;
            const total = changes.length || 1;
            const bullish = Math.round((posCount / total) * 100);
            const bearish = Math.round((negCount / total) * 100);
            const uncertainty = 100 - bullish - bearish;
            const signalStrength = Math.min(Math.round(Math.abs(avgChange) * 15), 100);

            setScores({ bullish, bearish, uncertainty: Math.max(uncertainty, 0), signalStrength });
            setLastUpdated(new Date());
        } catch (err) {
            console.error('AIInsights fetch error:', err.message);
        }
    }, [marketFilter]);

    useEffect(() => {
        let mounted = true;
        const load = async () => { if (mounted) await fetchData(); };
        load();
        const interval = setInterval(() => { if (mounted) fetchData(); }, 15000);
        return () => { mounted = false; clearInterval(interval); };
    }, [fetchData]);

    
    const moverStr = () => topMovers.map(m => `${m.sym} ${parseFloat(m.change ?? 0) >= 0 ? '+' : ''}${parseFloat(m.change ?? 0).toFixed(2)}%`).join(', ');
    const timeCtx = () => `over the ${timeFilter.toLowerCase()}`;

    const handleMarketDirection = async () => {
        setLoadingDirection(true); setMarketDirection('');
        try {
            const r = await askAI(`[INST] You are a financial analyst. Based on these market movers ${timeCtx()}: ${moverStr()}. Determine the overall market direction (bullish/bearish/sideways) and explain in 2 sentences. [/INST]`);
            setMarketDirection(r || 'Unable to determine market direction.');
        } catch { setMarketDirection('AI service unavailable.'); }
        setLoadingDirection(false);
    };

    const handleRiskLevel = async () => {
        setLoadingRisk(true); setRiskLevel('');
        try {
            const avgMove = topMovers.reduce((s, m) => s + Math.abs(parseFloat(m.change) || 0), 0) / (topMovers.length || 1);
            const r = await askAI(`[INST] As a risk analyst, assess the current market risk level (Low/Moderate/High/Extreme) based on an average move of ${avgMove.toFixed(2)}% across top assets ${timeCtx()}: ${moverStr()}. Explain in 2 sentences. [/INST]`);
            setRiskLevel(r || 'Unable to assess risk level.');
        } catch { setRiskLevel('AI service unavailable.'); }
        setLoadingRisk(false);
    };

    const handleVolatilityOut = async () => {
        setLoadingVol(true); setVolatilityOut('');
        try {
            const r = await askAI(`[INST] As a quant analyst, provide a volatility outlook for the next 24 hours based on current market moves ${timeCtx()}: ${moverStr()}. Give a 2-sentence forward-looking assessment. [/INST]`);
            setVolatilityOut(r || 'Unable to generate volatility outlook.');
        } catch { setVolatilityOut('AI service unavailable.'); }
        setLoadingVol(false);
    };

    const handleAiConfidence = async () => {
        setLoadingConfidence(true); setAiConfidence('');
        try {
            const r = await askAI(`[INST] As an AI analyst, rate your confidence (0-100%) in the current market signals based on: bullish score ${scores.bullish}%, bearish score ${scores.bearish}%, signal strength ${scores.signalStrength}%. Explain in 2 sentences. [/INST]`);
            setAiConfidence(r || 'Unable to assess AI confidence.');
        } catch { setAiConfidence('AI service unavailable.'); }
        setLoadingConfidence(false);
    };

   
    const handleFeedCard = async (index, prompt) => {
        setFeedCards(prev => prev.map((c, i) => i === index ? { ...c, loading: true, body: '' } : c));
        try {
            const r = await askAI(prompt);
            setFeedCards(prev => prev.map((c, i) => i === index ? { ...c, body: r || 'Unable to generate analysis.', loading: false } : c));
        } catch {
            setFeedCards(prev => prev.map((c, i) => i === index ? { ...c, body: 'AI service unavailable.', loading: false } : c));
        }
    };

    const feedPrompts = [
        `[INST] As a market analyst, analyze price momentum ${timeCtx()} for these assets: ${moverStr()}. Describe momentum trends and whether they are accelerating or decelerating in 3 sentences. [/INST]`,
        `[INST] As a liquidity analyst, analyze volume and liquidity signals ${timeCtx()} based on these market moves: ${moverStr()}. Identify any unusual volume patterns in 3 sentences. [/INST]`,
        `[INST] As a sentiment analyst, evaluate market sentiment and on-chain flow signals ${timeCtx()} based on: ${moverStr()}. Describe the emotional state of the market and likely positioning in 3 sentences. [/INST]`,
    ];

    
    const handleAiExplanation = async () => {
        setLoadingExplanation(true); setAiExplanation('');
        try {
            const r = await askAI(`[INST] You are a quantitative analyst. Explain in 3-4 sentences how price momentum (${moverStr()}), volume anomalies, on-chain flows, and sentiment embeddings combine to estimate directional bias and risk exposure ${timeCtx()}. Be technical but clear. [/INST]`);
            setAiExplanation(r || 'Unable to generate explanation.');
        } catch { setAiExplanation('AI service unavailable.'); }
        setLoadingExplanation(false);
    };

    
    const handleLiquidityRisk = async () => {
        setLoadingLiquidity(true); setLiquidityRisk('');
        try {
            const r = await askAI(`[INST] As a risk analyst, assess whether liquidity risk is increasing ${timeCtx()} based on: ${moverStr()}. Give a 2-sentence warning with specific indicators. [/INST]`);
            setLiquidityRisk(r || 'No significant liquidity risk detected.');
        } catch { setLiquidityRisk('AI service unavailable.'); }
        setLoadingLiquidity(false);
    };

    const handleSentimentOver = async () => {
        setLoadingSentOver(true); setSentimentOver('');
        try {
            const r = await askAI(`[INST] As a sentiment analyst, determine if market sentiment is overheating ${timeCtx()} based on: ${moverStr()}. Explain the overheating signals in 2 sentences. [/INST]`);
            setSentimentOver(r || 'Sentiment appears within normal range.');
        } catch { setSentimentOver('AI service unavailable.'); }
        setLoadingSentOver(false);
    };

    const handleCorrelationBreak = async () => {
        setLoadingCorrelation(true); setCorrelationBreak('');
        try {
            const r = await askAI(`[INST] As a quantitative analyst, identify any correlation breakdowns between assets ${timeCtx()} given these divergent moves: ${moverStr()}. Explain the significance in 2 sentences. [/INST]`);
            setCorrelationBreak(r || 'No significant correlation breakdowns detected.');
        } catch { setCorrelationBreak('AI service unavailable.'); }
        setLoadingCorrelation(false);
    };

    
    const handleSentimentAcc = async () => {
        setLoadingSentAcc(true); setSentimentAcc('');
        try {
            const r = await askAI(`[INST] As an AI model evaluator, estimate and explain the sentiment model accuracy ${timeCtx()} given a bullish score of ${scores.bullish}% and bearish score of ${scores.bearish}%. Assess reliability in 2 sentences. [/INST]`);
            setSentimentAcc(r || 'Unable to evaluate sentiment model.');
        } catch { setSentimentAcc('AI service unavailable.'); }
        setLoadingSentAcc(false);
    };

    const handleTrendPrecision = async () => {
        setLoadingTrend(true); setTrendPrecision('');
        try {
            const r = await askAI(`[INST] As an AI model evaluator, assess the trend detection precision ${timeCtx()} given signal strength of ${scores.signalStrength}% and these market moves: ${moverStr()}. Rate precision and explain in 2 sentences. [/INST]`);
            setTrendPrecision(r || 'Unable to evaluate trend precision.');
        } catch { setTrendPrecision('AI service unavailable.'); }
        setLoadingTrend(false);
    };

    const handleAnomalyRecall = async () => {
        setLoadingAnomaly(true); setAnomalyRecall('');
        try {
            const bigMovers = topMovers.filter(m => Math.abs(parseFloat(m.change) || 0) > 3).map(m => `${m.sym}: ${parseFloat(m.change).toFixed(2)}%`).join(', ');
            const r = await askAI(`[INST] As an anomaly detection specialist, assess the recall rate for detecting market anomalies ${timeCtx()}. Significant anomalies detected: ${bigMovers || 'none'}. Rate recall and explain in 2 sentences. [/INST]`);
            setAnomalyRecall(r || 'Unable to evaluate anomaly recall.');
        } catch { setAnomalyRecall('AI service unavailable.'); }
        setLoadingAnomaly(false);
    };

  
    return (
        <div className={styles.aiWrapper}>
            <div className={styles.aiContainer}>

                
                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>AI Insights</h1>
                        {lastUpdated && (
                            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        )}
                    </div>
                    <div className={styles.aiControls}>
                        <select value={marketFilter} onChange={e => setMarketFilter(e.target.value)}>
                            <option>All Markets</option>
                            <option>Stocks</option>
                            <option>Crypto</option>
                            <option>Blockchain</option>
                        </select>
                        <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
                            <option>Last 24 Hours</option>
                            <option>7 Days</option>
                            <option>30 Days</option>
                        </select>
                        <button
                            onClick={fetchData}
                            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                </div>

              
                <div className={styles.insightOverview}>

                   
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Market Direction</p>
                        <div style={{ minHeight: 55 }}>
                            {marketDirection
                                ? <p style={aiTextStyle}>{marketDirection}</p>
                                : <>
                                    <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: scores.bullish >= scores.bearish ? '#10B981' : '#EF4444' }}>
                                        {scores.bullish >= scores.bearish ? '↑ Bullish' : '↓ Bearish'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{scores.bullish}% assets up · {scores.bearish}% down</p>
                                </>
                            }
                        </div>
                        <button style={loadingDirection ? btnDisabled : btn} onClick={handleMarketDirection} disabled={loadingDirection}>
                            {loadingDirection ? 'Analyzing...' : 'Analyze Direction'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><AlertTriangle size={12} style={{ marginRight: 4 }} />Risk Level</p>
                        <div style={{ minHeight: 55 }}>
                            {riskLevel
                                ? <p style={aiTextStyle}>{riskLevel}</p>
                                : <>
                                    {(() => {
                                        const avgMove = topMovers.reduce((s, m) => s + Math.abs(parseFloat(m.change) || 0), 0) / (topMovers.length || 1);
                                        const level = avgMove > 5 ? 'Extreme' : avgMove > 3 ? 'High' : avgMove > 1.5 ? 'Moderate' : 'Low';
                                        const color = avgMove > 5 ? '#EF4444' : avgMove > 3 ? '#F59E0B' : avgMove > 1.5 ? '#3B82F6' : '#10B981';
                                        return <>
                                            <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color }}>{level}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Avg move: {avgMove.toFixed(2)}%</p>
                                        </>;
                                    })()}
                                </>
                            }
                        </div>
                        <button style={loadingRisk ? btnDisabled : btnWarning} onClick={handleRiskLevel} disabled={loadingRisk}>
                            {loadingRisk ? 'Assessing...' : 'Assess Risk'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />Volatility Outlook</p>
                        <div style={{ minHeight: 55 }}>
                            {volatilityOut
                                ? <p style={aiTextStyle}>{volatilityOut}</p>
                                : <p style={placeholderStyle}>Click below for a forward-looking volatility assessment.</p>
                            }
                        </div>
                        <button style={loadingVol ? btnDisabled : btn} onClick={handleVolatilityOut} disabled={loadingVol}>
                            {loadingVol ? 'Forecasting...' : 'Get Outlook'}
                        </button>
                    </div>

                   
                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Cpu size={12} style={{ marginRight: 4 }} />AI Confidence</p>
                        <div style={{ minHeight: 55 }}>
                            {aiConfidence
                                ? <p style={aiTextStyle}>{aiConfidence}</p>
                                : <>
                                    <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#6366F1' }}>{scores.signalStrength}%</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Signal strength index</p>
                                </>
                            }
                        </div>
                        <button style={loadingConfidence ? btnDisabled : btn} onClick={handleAiConfidence} disabled={loadingConfidence}>
                            {loadingConfidence ? 'Evaluating...' : 'Evaluate Confidence'}
                        </button>
                    </div>
                </div>

              
                <div className={styles.aiMain}>

                  
                    <div className={styles.insightFeed}>
                        <h3 style={sectionTitleStyle}><Activity size={15} style={{ marginRight: 6 }} />AI Analysis Feed</h3>
                        {feedCards.map((card, i) => (
                            <div key={i} className={styles.insightCard}>
                                <h4>{card.title}</h4>
                                {card.body
                                    ? <p style={{ ...aiTextStyle, color: '#475569' }}>{card.body}</p>
                                    : <p>Click below to generate AI analysis for this signal.</p>
                                }
                                <button
                                    style={{ ...(card.loading ? btnDisabled : btn), marginTop: 10 }}
                                    onClick={() => handleFeedCard(i, feedPrompts[i])}
                                    disabled={card.loading}
                                >
                                    {card.loading ? 'Analyzing...' : 'Generate Analysis'}
                                </button>
                            </div>
                        ))}
                    </div>

                  
                    <div className={styles.detailPanel}>
                        <h3 style={sectionTitleStyle}><BarChart2 size={15} style={{ marginRight: 6 }} />Insight Breakdown</h3>

                       
                        <div className={styles.chartBox} style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#4338CA' }}>AI Signal Confidence Chart</p>
                            <ConfidenceBar label="Bullish Score" value={scores.bullish} color="#10B981" />
                            <ConfidenceBar label="Bearish Score" value={scores.bearish} color="#EF4444" />
                            <ConfidenceBar label="Uncertainty" value={scores.uncertainty} color="#F59E0B" />
                            <ConfidenceBar label="Signal Strength" value={scores.signalStrength} color="#6366F1" />
                        </div>

                       
                        <div className={styles.metricRow}>
                            <div className={styles.metric}>
                                <div style={statLabelStyle}>Bullish Score</div>
                                <div style={{ ...statValueStyle, color: '#10B981' }}>{scores.bullish}%</div>
                            </div>
                            <div className={styles.metric}>
                                <div style={statLabelStyle}>Bearish Score</div>
                                <div style={{ ...statValueStyle, color: '#EF4444' }}>{scores.bearish}%</div>
                            </div>
                            <div className={styles.metric}>
                                <div style={statLabelStyle}>Uncertainty</div>
                                <div style={{ ...statValueStyle, color: '#F59E0B' }}>{scores.uncertainty}%</div>
                            </div>
                            <div className={styles.metric}>
                                <div style={statLabelStyle}>Signal Strength</div>
                                <div style={{ ...statValueStyle, color: '#6366F1' }}>{scores.signalStrength}%</div>
                            </div>
                        </div>

                    
                        <div className={styles.aiExplanation}>
                            <strong style={{ fontSize: 13, color: '#4338CA' }}>AI Explanation</strong>
                            {aiExplanation
                                ? <p>{aiExplanation}</p>
                                : <p>The model weighs price momentum, volume anomalies, on-chain flows, and sentiment embeddings to estimate directional bias and risk exposure. Click below to generate a live explanation.</p>
                            }
                            <button
                                style={{ ...(loadingExplanation ? btnDisabled : btn), marginTop: 10 }}
                                onClick={handleAiExplanation}
                                disabled={loadingExplanation}
                            >
                                {loadingExplanation ? 'Generating...' : 'Generate Explanation'}
                            </button>
                        </div>
                    </div>
                </div>

          
                <div className={styles.aiBottom}>

                   
                    <div className={styles.warningPanel}>
                        <h3 style={sectionTitleStyle}><AlertTriangle size={15} style={{ marginRight: 6 }} />AI Warnings</h3>

                       
                        <div className={styles.warningCard}>
                            <p style={labelStyle}><Shield size={12} style={{ marginRight: 4 }} />Liquidity Risk Increasing</p>
                            {liquidityRisk
                                ? <p style={aiTextStyle}>{liquidityRisk}</p>
                                : <p style={placeholderStyle}>Click below to assess current liquidity risk levels.</p>
                            }
                            <button style={{ ...(loadingLiquidity ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleLiquidityRisk} disabled={loadingLiquidity}>
                                {loadingLiquidity ? 'Assessing...' : 'Assess Liquidity Risk'}
                            </button>
                        </div>

                      
                        <div className={styles.warningCard}>
                            <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />Sentiment Overheating</p>
                            {sentimentOver
                                ? <p style={aiTextStyle}>{sentimentOver}</p>
                                : <p style={placeholderStyle}>Click below to check if sentiment is overheating.</p>
                            }
                            <button style={{ ...(loadingSentOver ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleSentimentOver} disabled={loadingSentOver}>
                                {loadingSentOver ? 'Checking...' : 'Check Sentiment Heat'}
                            </button>
                        </div>

                     
                        <div className={styles.warningCard}>
                            <p style={labelStyle}><Activity size={12} style={{ marginRight: 4 }} />Correlation Breakdown</p>
                            {correlationBreak
                                ? <p style={aiTextStyle}>{correlationBreak}</p>
                                : <p style={placeholderStyle}>Click below to identify asset correlation breakdowns.</p>
                            }
                            <button style={{ ...(loadingCorrelation ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleCorrelationBreak} disabled={loadingCorrelation}>
                                {loadingCorrelation ? 'Analyzing...' : 'Detect Correlations'}
                            </button>
                        </div>
                    </div>

               
                    <div className={styles.modelPanel}>
                        <h3 style={sectionTitleStyle}><Cpu size={15} style={{ marginRight: 6 }} />Model Performance</h3>

                        <div className={styles.modelCard}>
                            <p style={labelStyle}><BarChart2 size={12} style={{ marginRight: 4 }} />Sentiment Model Accuracy</p>
                            {sentimentAcc
                                ? <p style={aiTextStyle}>{sentimentAcc}</p>
                                : <p style={placeholderStyle}>Click below to evaluate the sentiment model's accuracy.</p>
                            }
                            <button style={{ ...(loadingSentAcc ? btnDisabled : btn), marginTop: 8 }} onClick={handleSentimentAcc} disabled={loadingSentAcc}>
                                {loadingSentAcc ? 'Evaluating...' : 'Evaluate Accuracy'}
                            </button>
                        </div>

                        <div className={styles.modelCard}>
                            <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Trend Detection Precision</p>
                            {trendPrecision
                                ? <p style={aiTextStyle}>{trendPrecision}</p>
                                : <p style={placeholderStyle}>Click below to assess trend detection precision.</p>
                            }
                            <button style={{ ...(loadingTrend ? btnDisabled : btn), marginTop: 8 }} onClick={handleTrendPrecision} disabled={loadingTrend}>
                                {loadingTrend ? 'Assessing...' : 'Assess Precision'}
                            </button>
                        </div>

                        <div className={styles.modelCard}>
                            <p style={labelStyle}><AlertTriangle size={12} style={{ marginRight: 4 }} />Anomaly Recall</p>
                            {anomalyRecall
                                ? <p style={aiTextStyle}>{anomalyRecall}</p>
                                : <p style={placeholderStyle}>Click below to evaluate anomaly detection recall.</p>
                            }
                            <button style={{ ...(loadingAnomaly ? btnDisabled : btn), marginTop: 8 }} onClick={handleAnomalyRecall} disabled={loadingAnomaly}>
                                {loadingAnomaly ? 'Evaluating...' : 'Evaluate Recall'}
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
    fontSize: 18,
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
