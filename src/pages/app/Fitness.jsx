import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const stats = [
    { label: 'Fitness Score', value: '82', color: '#ec4899' },
    { label: 'Workouts/Week', value: '5', color: '#10b981' },
    { label: 'Active Streak', value: '12d', color: '#f59e0b' },
    { label: 'Sleep Score', value: '87', color: '#7c3aed' },
];

const habits = [
    { name: 'Morning Run (5km)', done: true, color: '#ec4899' },
    { name: 'Strength Training', done: true, color: '#f59e0b' },
    { name: 'Evening Walk', done: false, color: '#10b981' },
    { name: '2L Water Intake', done: false, color: '#00f5ff' },
    { name: 'Stretch & Mobility', done: false, color: '#7c3aed' },
];

export default function Fitness() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiHeart size={10} /> Fitness</div>
                <h1 className="page-title">Fitness & Health</h1>
                <p className="page-desc">AI-personalized workout planning, recovery optimization, and body transformation tracking.</p>
            </div>
            <div className="stat-grid">
                {stats.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #7c3aed)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18 }}>❤️ Today's Fitness Habits</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {habits.map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 14px', borderRadius: 12, background: h.done ? `${h.color}08` : 'rgba(255,255,255,0.03)', border: `1px solid ${h.done ? h.color + '30' : 'rgba(255,255,255,0.06)'}` }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: h.done ? h.color : 'transparent', border: h.done ? 'none' : `2px solid var(--text-3)`, flexShrink: 0 }} />
                            <span style={{ fontSize: 14, color: h.done ? 'var(--text-2)' : 'var(--text-1)', fontWeight: 500, textDecoration: h.done ? 'line-through' : 'none' }}>{h.name}</span>
                            {h.done && <span style={{ marginLeft: 'auto', fontSize: 12, color: h.color, fontWeight: 700 }}>✓ Done</span>}
                        </div>
                    ))}
                </div>
            </motion.div>
            <div className="coming-soon-card">
                <span className="coming-soon-icon">❤️</span>
                <div className="coming-soon-title">AI Fitness Coach — Coming Soon</div>
                <p className="coming-soon-desc">Custom workout plans, biometric analysis, nutrition AI, and smart recovery scheduling.</p>
            </div>
        </div>
    );
}
