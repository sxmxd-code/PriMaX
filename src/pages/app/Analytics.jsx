import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';

const stats = [
    { label: 'Growth Score', value: '847', color: '#7c3aed' },
    { label: 'Avg. Focus Hours', value: '6.2h', color: '#00f5ff' },
    { label: 'Habit Consistency', value: '91%', color: '#10b981' },
    { label: 'Weekly Goals Met', value: '8/10', color: '#f59e0b' },
];

const dimensions = [
    { dim: 'Mind', pct: 92, color: '#7c3aed' },
    { dim: 'Body', pct: 78, color: '#10b981' },
    { dim: 'Career', pct: 85, color: '#00f5ff' },
    { dim: 'Wealth', pct: 71, color: '#f59e0b' },
    { dim: 'Social', pct: 80, color: '#ec4899' },
    { dim: 'Spirit', pct: 88, color: '#f97316' },
];

const bars = [55, 70, 60, 88, 74, 92, 80];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Analytics() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiBarChart2 size={10} /> Analytics</div>
                <h1 className="page-title">Growth Analytics</h1>
                <p className="page-desc">Deep AI-generated insights across every life dimension — visualized, explained, and actioned.</p>
            </div>
            <div className="stat-grid">
                {stats.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #00f5ff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>🧭 Life Dimensions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {dimensions.map((d, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{d.dim}</span>
                                    <span style={{ fontSize: 13, color: d.color, fontWeight: 700 }}>{d.pct}%</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
                                        style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${d.color}, #7c3aed)` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>📈 7-Day Focus Trend</h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120, marginBottom: 10 }}>
                        {bars.map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
                                        style={{ width: '100%', borderRadius: '4px 4px 0 0', background: i === 5 ? 'linear-gradient(to top, #7c3aed, #00f5ff)' : 'rgba(124,58,237,0.25)' }} />
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{days[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="coming-soon-card" style={{ margin: 0, padding: '18px 20px', display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', textAlign: 'left' }}>
                        <span style={{ fontSize: 28 }}>📊</span>
                        <div>
                            <div className="coming-soon-title" style={{ fontSize: 14, margin: 0 }}>Full Analytics Suite</div>
                            <p className="coming-soon-desc" style={{ fontSize: 13, margin: 0 }}>Advanced charts, trend forecasting, and AI-generated weekly reports — coming soon.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
