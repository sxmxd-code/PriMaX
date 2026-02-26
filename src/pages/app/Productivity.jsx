import { motion } from 'framer-motion';
import { FiZap, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

const tasks = [
    { text: 'Set daily focus target', done: true },
    { text: 'Configure Pomodoro timer', done: true },
    { text: 'Link calendar integration', done: false },
    { text: 'Enable AI distraction blocker', done: false },
];

const stats = [
    { label: 'Focus Hours Today', value: '4.2h', color: '#00f5ff' },
    { label: 'Tasks Completed', value: '7/11', color: '#10b981' },
    { label: 'Deep Work Sessions', value: '3', color: '#7c3aed' },
    { label: 'Focus Score', value: '84%', color: '#f59e0b' },
];

export default function Productivity() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiZap size={10} /> Productivity</div>
                <h1 className="page-title">Productivity Hub</h1>
                <p className="page-desc">AI-powered focus sessions, task management, and deep work optimization to 10x your output.</p>
            </div>
            <div className="stat-grid">
                {stats.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #7c3aed)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ padding: 24, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCheckCircle size={15} style={{ color: '#00f5ff' }} /> Today's Tasks
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {tasks.map((t, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: t.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${t.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                                <div style={{ width: 18, height: 18, borderRadius: 5, background: t.done ? '#10b981' : 'transparent', border: t.done ? 'none' : '2px solid var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {t.done && <FiCheckCircle size={12} color="white" />}
                                </div>
                                <span style={{ fontSize: 14, color: t.done ? 'var(--text-2)' : 'var(--text-1)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <div className="coming-soon-card" style={{ margin: 0 }}>
                    <span className="coming-soon-icon">⚡</span>
                    <div className="coming-soon-title">Full Module Coming Soon</div>
                    <p className="coming-soon-desc">AI focus timer, task AI prioritization, and deep work analytics are in development.</p>
                </div>
            </div>
        </div>
    );
}
