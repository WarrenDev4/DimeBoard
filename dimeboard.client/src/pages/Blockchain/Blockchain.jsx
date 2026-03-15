import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, Cpu, AlertTriangle, Shield, Zap, RefreshCw, Activity, GitBranch, BarChart2 } from 'lucide-react';
import styles from "./Blockchain.module.css";

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

const NETWORKS = [
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', blockTime: '~12s', tps: '15-30', layer: 'Layer 1' },
    { id: 'BTC', name: 'Bitcoin', icon: '₿', blockTime: '~10m', tps: '7', layer: 'Layer 1' },
    { id: 'SOL', name: 'Solana', icon: 'S', blockTime: '~0.4s', tps: '2,000+', layer: 'Layer 1' },
    { id: 'MATIC', name: 'Polygon', icon: 'M', blockTime: '~2s', tps: '7,000+', layer: 'Layer 2' },
    { id: 'AVAX', name: 'Avalanche', icon: 'A', blockTime: '~1s', tps: '4,500+', layer: 'Layer 1' },
    { id: 'ARB', name: 'Arbitrum', icon: 'Ar', blockTime: '~0.25s', tps: '40,000+', layer: 'Layer 2' },
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

export default function Blockchain() {
    const [networkFilter, setNetworkFilter] = useState('All Networks');
    const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
    const [blockchainData, setBlockchainData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [networkActivity, setNetworkActivity] = useState('');
    const [tpsAnalysis, setTpsAnalysis] = useState('');
    const [gasAnalysis, setGasAnalysis] = useState('');
    const [validatorHealth, setValidatorHealth] = useState('');

    const [chainAnalysis, setChainAnalysis] = useState('');

    const [defiGrowth, setDefiGrowth] = useState('');
    const [nftVolume, setNftVolume] = useState('');
    const [bridgeFlows, setBridgeFlows] = useState('');

    const [securityRisk, setSecurityRisk] = useState('');
    const [centralization, setCentralization] = useState('');
    const [scalability, setScalability] = useState('');
    const [networkStress, setNetworkStress] = useState('');

    const [loadingActivity, setLoadingActivity] = useState(false);
    const [loadingTps, setLoadingTps] = useState(false);
    const [loadingGas, setLoadingGas] = useState(false);
    const [loadingValidator, setLoadingValidator] = useState(false);
    const [loadingChain, setLoadingChain] = useState(false);
    const [loadingDefi, setLoadingDefi] = useState(false);
    const [loadingNft, setLoadingNft] = useState(false);
    const [loadingBridge, setLoadingBridge] = useState(false);
    const [loadingSecurity, setLoadingSecurity] = useState(false);
    const [loadingCentral, setLoadingCentral] = useState(false);
    const [loadingScale, setLoadingScale] = useState(false);
    const [loadingStress, setLoadingStress] = useState(false);

    const fetchBlockchainData = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!res.ok) return;
            const data = await res.json();

            
            const map = {};
            data.blockchainMetrics?.forEach(m => {
                map[m.name] = { value: m.value, change: m.change, label: m.label };
            });
            setBlockchainData(map);

            if (data.chartData?.length) {
                setChartData(data.chartData.map((d, i) => ({
                    label: d.date || `D${i + 1}`,
                    value: typeof d.value === 'number' ? d.value : parseFloat(d.value) || 0
                })));
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error('Blockchain fetch error:', err.message);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const load = async () => { if (mounted) await fetchBlockchainData(); };
        load();
        const interval = setInterval(() => { if (mounted) fetchBlockchainData(); }, 15000);
        return () => { mounted = false; clearInterval(interval); };
    }, [fetchBlockchainData]);

    const networkInfo = selectedNetwork;
    const filteredNetworks = networkFilter === 'All Networks'
        ? NETWORKS
        : NETWORKS.filter(n => n.layer === networkFilter || n.name === networkFilter);

    const gasPrice = blockchainData['Gas Price']?.value || '—';
    const gasPriceUsd = blockchainData['Gas Price USD']?.value || '—';
    const totalBlocks = blockchainData['Total Blocks']?.value || '—';
    const indexed = blockchainData['Indexed Blocks']?.value || '—';

    const networkContext = `${selectedNetwork.name} with block time ${selectedNetwork.blockTime}, TPS ${selectedNetwork.tps}, current gas ${gasPrice}`;

    const handleNetworkActivity = async () => {
        setLoadingActivity(true); setNetworkActivity('');
        try {
            const r = await askAI(`[INST] You are a blockchain analyst. Describe in 2-3 sentences the current network activity on ${selectedNetwork.name}, given: total blocks ${totalBlocks}, indexed blocks ${indexed}, gas price ${gasPrice}. Be factual and concise. [/INST]`);
            setNetworkActivity(r || 'Unable to analyze network activity.');
        } catch { setNetworkActivity('AI service unavailable.'); }
        setLoadingActivity(false);
    };

    const handleTpsAnalysis = async () => {
        setLoadingTps(true); setTpsAnalysis('');
        try {
            const r = await askAI(`[INST] As a blockchain engineer, compare the transaction throughput of these networks: ${NETWORKS.map(n => `${n.name}: ${n.tps} TPS`).join(', ')}. Summarize in 2 sentences which are most performant and why. [/INST]`);
            setTpsAnalysis(r || 'Unable to analyze TPS.');
        } catch { setTpsAnalysis('AI service unavailable.'); }
        setLoadingTps(false);
    };

    const handleGasAnalysis = async () => {
        setLoadingGas(true); setGasAnalysis('');
        try {
            const r = await askAI(`[INST] As a DeFi analyst, explain in 2 sentences what the current gas price of ${gasPrice} (${gasPriceUsd}) on Ethereum means for users and whether it's favorable for transactions. [/INST]`);
            setGasAnalysis(r || 'Unable to analyze gas fees.');
        } catch { setGasAnalysis('AI service unavailable.'); }
        setLoadingGas(false);
    };

    const handleValidatorHealth = async () => {
        setLoadingValidator(true); setValidatorHealth('');
        try {
            const r = await askAI(`[INST] As a blockchain validator analyst, assess the validator/miner health of ${selectedNetwork.name} in 2 sentences. Consider its consensus mechanism and typical decentralization metrics. [/INST]`);
            setValidatorHealth(r || 'Unable to assess validator health.');
        } catch { setValidatorHealth('AI service unavailable.'); }
        setLoadingValidator(false);
    };

    const handleChainAnalysis = async () => {
        setLoadingChain(true); setChainAnalysis('');
        try {
            const r = await askAI(`[INST] You are a blockchain analyst. Analyze ${networkContext}. Explain network congestion levels, validator behavior, decentralization metrics, and security signals in 3-4 sentences. [/INST]`);
            setChainAnalysis(r || 'Unable to generate chain analysis.');
        } catch { setChainAnalysis('AI service unavailable.'); }
        setLoadingChain(false);
    };

    const handleDefiGrowth = async () => {
        setLoadingDefi(true); setDefiGrowth('');
        try {
            const r = await askAI(`[INST] As a DeFi analyst, describe in 2 sentences the current DeFi protocol growth trends on ${selectedNetwork.name}, considering its TPS of ${selectedNetwork.tps} and gas price of ${gasPrice}. [/INST]`);
            setDefiGrowth(r || 'Unable to analyze DeFi growth.');
        } catch { setDefiGrowth('AI service unavailable.'); }
        setLoadingDefi(false);
    };

    const handleNftVolume = async () => {
        setLoadingNft(true); setNftVolume('');
        try {
            const r = await askAI(`[INST] As an NFT market analyst, describe in 2 sentences the current NFT volume trends on ${selectedNetwork.name}. Consider network fees and activity levels. [/INST]`);
            setNftVolume(r || 'Unable to analyze NFT volume.');
        } catch { setNftVolume('AI service unavailable.'); }
        setLoadingNft(false);
    };

    const handleBridgeFlows = async () => {
        setLoadingBridge(true); setBridgeFlows('');
        try {
            const r = await askAI(`[INST] As a cross-chain analyst, describe in 2 sentences the likely bridge flow activity between ${selectedNetwork.name} and other networks given current gas prices of ${gasPrice}. [/INST]`);
            setBridgeFlows(r || 'Unable to analyze bridge flows.');
        } catch { setBridgeFlows('AI service unavailable.'); }
        setLoadingBridge(false);
    };

    const handleSecurityRisk = async () => {
        setLoadingSecurity(true); setSecurityRisk('');
        try {
            const r = await askAI(`[INST] As a blockchain security analyst, identify 2-3 current security risk alerts for ${selectedNetwork.name} given: block time ${selectedNetwork.blockTime}, TPS ${selectedNetwork.tps}. Be specific and cautionary. [/INST]`);
            setSecurityRisk(r || 'No major security alerts at this time.');
        } catch { setSecurityRisk('AI service unavailable.'); }
        setLoadingSecurity(false);
    };

    const handleCentralization = async () => {
        setLoadingCentral(true); setCentralization('');
        try {
            const r = await askAI(`[INST] As a decentralization analyst, assess centralization risks for ${selectedNetwork.name} in 2-3 sentences. Consider validator concentration, governance, and network control factors. [/INST]`);
            setCentralization(r || 'Unable to assess centralization.');
        } catch { setCentralization('AI service unavailable.'); }
        setLoadingCentral(false);
    };

    const handleScalability = async () => {
        setLoadingScale(true); setScalability('');
        try {
            const r = await askAI(`[INST] As a blockchain scalability researcher, forecast the scalability outlook for ${selectedNetwork.name} in 2-3 sentences. Current TPS: ${selectedNetwork.tps}, block time: ${selectedNetwork.blockTime}. [/INST]`);
            setScalability(r || 'Unable to generate scalability forecast.');
        } catch { setScalability('AI service unavailable.'); }
        setLoadingScale(false);
    };

    const handleNetworkStress = async () => {
        setLoadingStress(true); setNetworkStress('');
        try {
            const r = await askAI(`[INST] As a network engineer, identify 2-3 network stress signals for ${selectedNetwork.name} given gas price ${gasPrice}, total blocks ${totalBlocks}. Describe what these signals indicate about network load. [/INST]`);
            setNetworkStress(r || 'No significant network stress detected.');
        } catch { setNetworkStress('AI service unavailable.'); }
        setLoadingStress(false);
    };

    return (
        <div className={styles.blockchainWrapper}>
            <div className={styles.blockchainContainer}>

                <div className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Blockchain</h1>
                        {lastUpdated && (
                            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        )}
                    </div>
                    <div className={styles.blockchainControls}>
                        <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
                            <option>All Networks</option>
                            <option>Ethereum</option>
                            <option>Bitcoin</option>
                            <option>Solana</option>
                            <option>Polygon</option>
                            <option>Avalanche</option>
                            <option>Layer 2</option>
                        </select>
                        <button
                            onClick={fetchBlockchainData}
                            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                </div>

                <div className={styles.blockchainOverview}>

                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Activity size={12} style={{ marginRight: 4 }} />Network Activity</p>
                        <div style={{ minHeight: 55 }}>
                            {networkActivity
                                ? <p style={aiTextStyle}>{networkActivity}</p>
                                : <p style={placeholderStyle}>Click below for an AI analysis of current network activity.</p>
                            }
                            {Object.keys(blockchainData).length > 0 && (
                                <div style={{ marginTop: 6, fontSize: 11, color: '#6366F1' }}>
                                    Blocks: {totalBlocks} · Indexed: {indexed}
                                </div>
                            )}
                        </div>
                        <button style={loadingActivity ? btnDisabled : btn} onClick={handleNetworkActivity} disabled={loadingActivity}>
                            {loadingActivity ? 'Analyzing...' : 'Analyze Activity'}
                        </button>
                    </div>

                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Zap size={12} style={{ marginRight: 4 }} />Transactions / sec</p>
                        <div style={{ minHeight: 55 }}>
                            {tpsAnalysis
                                ? <p style={aiTextStyle}>{tpsAnalysis}</p>
                                : <>
                                    <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#6366F1' }}>{selectedNetwork.tps}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{selectedNetwork.name} TPS</p>
                                </>
                            }
                        </div>
                        <button style={loadingTps ? btnDisabled : btn} onClick={handleTpsAnalysis} disabled={loadingTps}>
                            {loadingTps ? 'Analyzing...' : 'Compare Networks'}
                        </button>
                    </div>

                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><BarChart2 size={12} style={{ marginRight: 4 }} />Gas / Fees</p>
                        <div style={{ minHeight: 55 }}>
                            {gasAnalysis
                                ? <p style={aiTextStyle}>{gasAnalysis}</p>
                                : <>
                                    <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{gasPrice}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{gasPriceUsd} · Ethereum</p>
                                </>
                            }
                        </div>
                        <button style={loadingGas ? btnDisabled : btn} onClick={handleGasAnalysis} disabled={loadingGas}>
                            {loadingGas ? 'Analyzing...' : 'Analyze Gas Fees'}
                        </button>
                    </div>

                    <div className={styles.overviewCard}>
                        <p style={labelStyle}><Shield size={12} style={{ marginRight: 4 }} />Validator Health</p>
                        <div style={{ minHeight: 55 }}>
                            {validatorHealth
                                ? <p style={aiTextStyle}>{validatorHealth}</p>
                                : <p style={placeholderStyle}>Click below to assess validator health for {selectedNetwork.name}.</p>
                            }
                        </div>
                        <button style={loadingValidator ? btnDisabled : btn} onClick={handleValidatorHealth} disabled={loadingValidator}>
                            {loadingValidator ? 'Assessing...' : 'Check Validators'}
                        </button>
                    </div>
                </div>

                <div className={styles.blockchainMain}>

                    <div className={styles.networkList}>
                        <h3 style={sectionTitleStyle}>Networks</h3>
                        {filteredNetworks.map(network => {
                            const active = selectedNetwork.id === network.id;
                            return (
                                <div
                                    key={network.id}
                                    className={styles.networkItem}
                                    onClick={() => { setSelectedNetwork(network); setChainAnalysis(''); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: active ? '#EEF2FF' : undefined,
                                        border: active ? '1px solid #C7D2FE' : '1px solid transparent',
                                    }}
                                >
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: active ? '#E0E7FF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: active ? '#4F46E5' : '#475569', flexShrink: 0 }}>
                                        {network.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{network.name}</div>
                                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{network.layer}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 11, color: '#6366F1', fontWeight: 600 }}>{network.tps} TPS</div>
                                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{network.blockTime}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.networkDetails}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ background: '#EEF2FF', borderRadius: 8, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{networkInfo.icon}</span>
                                    {networkInfo.name}
                                    <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>{networkInfo.id}</span>
                                </h3>
                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{networkInfo.layer}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#6366F1' }}>{networkInfo.tps} TPS</div>
                                <div style={{ fontSize: 12, color: '#94A3B8' }}>Block time: {networkInfo.blockTime}</div>
                            </div>
                        </div>

                        <div className={styles.chartBox} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {chartData.length > 0
                                ? <SparklineChart data={chartData} color="#6366F1" />
                                : <span style={{ color: '#94A3B8', fontSize: 13 }}>Loading on-chain activity chart...</span>
                            }
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Block Time</div>
                                <div style={statValueStyle}>{networkInfo.blockTime}</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>TPS</div>
                                <div style={{ ...statValueStyle, color: '#6366F1' }}>{networkInfo.tps}</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Active Wallets</div>
                                <div style={statValueStyle}>—</div>
                            </div>
                            <div className={styles.stat}>
                                <div style={statLabelStyle}>Fees</div>
                                <div style={statValueStyle}>{networkInfo.id === 'ETH' ? gasPrice : '—'}</div>
                            </div>
                        </div>

                   
                        <div className={styles.aiPanel}>
                            <h4>AI Chain Analysis — {networkInfo.name}</h4>
                            {chainAnalysis
                                ? <p>{chainAnalysis}</p>
                                : <p>Click below for an AI explanation of {networkInfo.name}'s network congestion, validator behavior, decentralization metrics, and security signals.</p>
                            }
                            <button
                                style={{ ...(loadingChain ? btnDisabled : btn), marginTop: 10 }}
                                onClick={handleChainAnalysis}
                                disabled={loadingChain}
                            >
                                {loadingChain ? 'Analyzing...' : `Analyze ${networkInfo.name}`}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.blockchainBottom}>

                    <div className={styles.protocolSection}>
                        <h3 style={sectionTitleStyle}><GitBranch size={15} style={{ marginRight: 6 }} />Protocol Activity</h3>

                      
                        <div className={styles.protocolCard}>
                            <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />DeFi Protocol Growth</p>
                            {defiGrowth
                                ? <p style={aiTextStyle}>{defiGrowth}</p>
                                : <p style={placeholderStyle}>Click below for AI analysis of DeFi protocol growth on {selectedNetwork.name}.</p>
                            }
                            <button style={{ ...(loadingDefi ? btnDisabled : btn), marginTop: 8 }} onClick={handleDefiGrowth} disabled={loadingDefi}>
                                {loadingDefi ? 'Analyzing...' : 'Analyze DeFi Growth'}
                            </button>
                        </div>

                   
                        <div className={styles.protocolCard}>
                            <p style={labelStyle}><BarChart2 size={12} style={{ marginRight: 4 }} />NFT Volume</p>
                            {nftVolume
                                ? <p style={aiTextStyle}>{nftVolume}</p>
                                : <p style={placeholderStyle}>Click below for AI analysis of NFT volume trends.</p>
                            }
                            <button style={{ ...(loadingNft ? btnDisabled : btn), marginTop: 8 }} onClick={handleNftVolume} disabled={loadingNft}>
                                {loadingNft ? 'Analyzing...' : 'Analyze NFT Volume'}
                            </button>
                        </div>

                   
                        <div className={styles.protocolCard}>
                            <p style={labelStyle}><GitBranch size={12} style={{ marginRight: 4 }} />Bridge Flows</p>
                            {bridgeFlows
                                ? <p style={aiTextStyle}>{bridgeFlows}</p>
                                : <p style={placeholderStyle}>Click below for AI analysis of cross-chain bridge activity.</p>
                            }
                            <button style={{ ...(loadingBridge ? btnDisabled : btn), marginTop: 8 }} onClick={handleBridgeFlows} disabled={loadingBridge}>
                                {loadingBridge ? 'Analyzing...' : 'Analyze Bridge Flows'}
                            </button>
                        </div>
                    </div>

     
                    <div className={styles.aiInsights}>
                        <h3 style={sectionTitleStyle}><Cpu size={15} style={{ marginRight: 6 }} />AI Insights</h3>

                     
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><Shield size={12} style={{ marginRight: 4 }} />Security Risk Alerts</p>
                            {securityRisk
                                ? <p style={aiTextStyle}>{securityRisk}</p>
                                : <p style={placeholderStyle}>Click below to identify security risks for {selectedNetwork.name}.</p>
                            }
                            <button style={{ ...(loadingSecurity ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleSecurityRisk} disabled={loadingSecurity}>
                                {loadingSecurity ? 'Analyzing...' : 'Check Security Risks'}
                            </button>
                        </div>

                  
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><AlertTriangle size={12} style={{ marginRight: 4 }} />Centralization Warnings</p>
                            {centralization
                                ? <p style={aiTextStyle}>{centralization}</p>
                                : <p style={placeholderStyle}>Click below to assess centralization risks.</p>
                            }
                            <button style={{ ...(loadingCentral ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleCentralization} disabled={loadingCentral}>
                                {loadingCentral ? 'Assessing...' : 'Check Centralization'}
                            </button>
                        </div>

                    
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><TrendingUp size={12} style={{ marginRight: 4 }} />Scalability Forecast</p>
                            {scalability
                                ? <p style={aiTextStyle}>{scalability}</p>
                                : <p style={placeholderStyle}>Click below for a scalability outlook for {selectedNetwork.name}.</p>
                            }
                            <button style={{ ...(loadingScale ? btnDisabled : btn), marginTop: 8 }} onClick={handleScalability} disabled={loadingScale}>
                                {loadingScale ? 'Forecasting...' : 'Get Scalability Forecast'}
                            </button>
                        </div>

                
                        <div className={styles.aiCard}>
                            <p style={labelStyle}><Activity size={12} style={{ marginRight: 4 }} />Network Stress Signals</p>
                            {networkStress
                                ? <p style={aiTextStyle}>{networkStress}</p>
                                : <p style={placeholderStyle}>Click below to detect network stress indicators.</p>
                            }
                            <button style={{ ...(loadingStress ? btnDisabled : btnWarning), marginTop: 8 }} onClick={handleNetworkStress} disabled={loadingStress}>
                                {loadingStress ? 'Detecting...' : 'Detect Stress Signals'}
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
