import { motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';

const stats = [
    { label: 'Career Score', value: '78', color: '#f59e0b' },
    { label: 'Skills Tracked', value: '14', color: '#7c3aed' },
    { label: 'Network Contacts', value: '312', color: '#00f5ff' },
    { label: 'Applications', value: '5', color: '#10b981' },
];

const milestones = [
    { text: 'Complete AWS Certification', pct: 65, color: '#f59e0b' },
    { text: 'Grow LinkedIn to 1000 connections', pct: 31, color: '#7c3aed' },
    { text: 'Ship side project v1.0', pct: 80, color: '#00f5ff' },
];

export default function Career() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiBriefcase size={10} /> Career</div>
                <h1 className="page-title">Career Development</h1>
                <p className="page-desc">Map your career trajectory, track skills, and let AI guide your professional growth strategy.</p>
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
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>🎯 Active Career Milestones</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {milestones.map((m, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                                <span style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 500 }}>{m.text}</span>
                                <span style={{ fontSize: 13, color: m.color, fontWeight: 700 }}>{m.pct}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                                    style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${m.color}, #7c3aed)` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
            <div className="coming-soon-card">
                <span className="coming-soon-icon">💼</span>
                <div className="coming-soon-title">Career AI Engine — Coming Soon</div>
                <p className="coming-soon-desc">Job market intelligence, skills gap analysis, and AI-crafted career roadmaps.</p>
            </div>
        </div>
    );
}
