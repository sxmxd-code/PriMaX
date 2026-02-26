import { motion } from 'framer-motion';
import { FiGrid, FiZap, FiArrowRight, FiStar, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const quickStats = [
    { label: 'Growth Score', value: '847', change: '+24 pts', color: '#7c3aed' },
    { label: 'Active Goals', value: '12', change: '3 due soon', color: '#00f5ff' },
    { label: 'Day Streak', value: '47', change: 'Personal best!', color: '#f59e0b' },
    { label: 'Tasks Today', value: '8/11', change: '72% done', color: '#10b981' },
];

const recentActivity = [
    { icon: '🎯', text: 'Completed "Morning Workout" habit', time: '10m ago', color: '#10b981' },
    { icon: '📝', text: 'Updated Career goal milestones', time: '1h ago', color: '#7c3aed' },
    { icon: '🤖', text: 'AI Coach session: Focus strategy', time: '2h ago', color: '#00f5ff' },
    { icon: '📈', text: 'Finance snapshot updated', time: '4h ago', color: '#f59e0b' },
    { icon: '🏆', text: 'Achievement unlocked: 45-Day Streak', time: 'Yesterday', color: '#ec4899' },
];

const modules = [
    { label: 'Productivity', icon: '⚡', path: '/app/productivity', color: '#00f5ff' },
    { label: 'Career', icon: '💼', path: '/app/career', color: '#f59e0b' },
    { label: 'Finance', icon: '💰', path: '/app/finance', color: '#10b981' },
    { label: 'Fitness', icon: '❤️', path: '/app/fitness', color: '#ec4899' },
    { label: 'Mental Growth', icon: '🌤️', path: '/app/mental', color: '#f97316' },
    { label: 'Analytics', icon: '📊', path: '/app/analytics', color: '#7c3aed' },
];

export default function CommandCenter() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="page-shell">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div className="page-tag"><FiGrid size={10} /> Command Center</div>
                    <h1 className="page-title">{greeting}, Growth Pioneer 👋</h1>
                    <p className="page-desc">Here's your daily briefing — AI-curated insights and priorities.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', border: 'none', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif' }}
                >
                    <FiZap size={15} /> Start Focus Session
                </motion.button>
            </div>

            {/* Stats row */}
            <div className="stat-grid">
                {quickStats.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <div className="stat-label" style={{ marginBottom: 6 }}>{s.label}</div>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #00f5ff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: s.color, marginTop: 4, fontWeight: 600 }}>{s.change}</div>
                    </motion.div>
                ))}
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
                {/* Quick access modules */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ padding: 24, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiStar size={16} /> Growth Modules
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {modules.map((m, i) => (
                            <motion.a key={i} href={m.path} whileHover={{ scale: 1.03, y: -2 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 12, background: `${m.color}10`, border: `1px solid ${m.color}25`, textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <span style={{ fontSize: 20 }}>{m.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{m.label}</span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ padding: 24, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiTrendingUp size={16} /> Recent Activity
                        </h3>
                        <button style={{ fontSize: 12, color: '#00f5ff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            View all →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recentActivity.map((a, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
                                style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                                    {a.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{a.text}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.time}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insight of the day */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,245,255,0.06))', border: '1px solid rgba(124,58,237,0.25)', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🤖</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Insight of the Day</span>
                            </div>
                            <p style={{ color: 'var(--text-1)', fontSize: 15, lineHeight: 1.7, marginBottom: 14 }}>
                                Based on your last 7 days, your peak focus window is <strong style={{ color: '#00f5ff' }}>9–11 AM</strong>. Schedule your highest-leverage tasks then. Your habit consistency score is up <strong style={{ color: '#10b981' }}>18%</strong> — you're in a growth momentum window. Protect it.
                            </p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    Apply to schedule <FiArrowRight size={13} />
                                </motion.button>
                                <button style={{ padding: '9px 18px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                    Read full analysis
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
