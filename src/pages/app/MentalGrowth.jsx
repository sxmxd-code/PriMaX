import { motion } from 'framer-motion';
import { FiSun } from 'react-icons/fi';

const dimensions = [
    { label: 'Mindset Score', value: '88%', color: '#f97316' },
    { label: 'Meditation Days', value: '23', color: '#7c3aed' },
    { label: 'Journal Entries', value: '47', color: '#ec4899' },
    { label: 'Resilience Score', value: '91', color: '#00f5ff' },
];

const practices = [
    { name: '10-min Morning Meditation', streak: '23 days', color: '#f97316' },
    { name: 'Gratitude Journal', streak: '15 days', color: '#ec4899' },
    { name: 'Evening Reflection', streak: '8 days', color: '#7c3aed' },
    { name: 'Affirmation Practice', streak: '5 days', color: '#00f5ff' },
];

export default function MentalGrowth() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiSun size={10} /> Mental Growth</div>
                <h1 className="page-title">Mental Growth & Mindset</h1>
                <p className="page-desc">Build an unshakeable mindset with AI-guided meditation, CBT journaling, and resilience training.</p>
            </div>
            <div className="stat-grid">
                {dimensions.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #7c3aed)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18 }}>🌱 Active Mindset Practices</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {practices.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: `${p.color}08`, border: `1px solid ${p.color}25` }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{p.name}</span>
                            <span style={{ fontSize: 12, color: p.color, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: `${p.color}15` }}>🔥 {p.streak}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
            <div className="coming-soon-card">
                <span className="coming-soon-icon">🌤️</span>
                <div className="coming-soon-title">AI Mindset Engine — Coming Soon</div>
                <p className="coming-soon-desc">Guided meditation, AI-powered CBT journaling, and emotional intelligence training.</p>
            </div>
        </div>
    );
}
