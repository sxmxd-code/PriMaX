import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBarChart2, FiTarget, FiTrendingUp, FiZap, FiAward, FiStar,
    FiMap, FiShield, FiActivity, FiBriefcase, FiDollarSign, FiHeart,
    FiSun, FiCheckCircle, FiChevronRight, FiClock,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TABS = [
    { id: 'overview', label: 'Unified Score', icon: <FiBarChart2 size={14} /> },
    { id: 'blueprint', label: 'Life Blueprint', icon: <FiMap size={14} /> },
    { id: 'gamified', label: 'Achievements', icon: <FiAward size={14} /> },
    { id: 'trends', label: 'Deep Analytics', icon: <FiTrendingUp size={14} /> },
    { id: 'ai', label: 'AI Analyst', icon: <FiZap size={14} /> },
];

const scores = {
    total: 84, delta: '+3',
    domains: [
        {
            id: 'career', name: 'Career & Growth', score: 88, target: 90, icon: <FiBriefcase />, color: '#7c3aed',
            metrics: [{ label: 'Skill Progress', val: '92%' }, { label: 'Goal Velocity', val: 'High' }]
        },
        {
            id: 'finance', name: 'Wealth & Assets', score: 82, target: 85, icon: <FiDollarSign />, color: '#10b981',
            metrics: [{ label: 'Savings Rate', val: '28%' }, { label: 'Budget Health', val: 'Good' }]
        },
        {
            id: 'fitness', name: 'Health & Fitness', score: 78, target: 80, icon: <FiHeart />, color: '#ec4899',
            metrics: [{ label: 'Workout Consistency', val: '4/wk' }, { label: 'Recovery', val: 'Fair' }]
        },
        {
            id: 'mental', name: 'Mental & Spirit', score: 88, target: 95, icon: <FiSun />, color: '#f59e0b',
            metrics: [{ label: 'Avg Mood', val: '4.1/5' }, { label: 'Practice Streak', val: '31d' }]
        },
    ]
};

const blueprint = [
    {
        id: 'vision_2030', title: 'The 2030 Master Vision', years: '4 Years Out', color: '#00f5ff',
        desc: 'Hit Staff Engineer, reach $200K net worth, establish a stable writing habit, and run a marathon.',
        milestones: [
            { name: 'Senior → Staff Promotion', done: false },
            { name: 'Max out Roth IRA annually', done: true },
            { name: '10K Newsletter Subscribers', done: false },
        ]
    },
    {
        id: 'vision_2027', title: 'The 2027 Accelerator', years: '1 Year Out', color: '#7c3aed',
        desc: 'Ship 3 SaaS MVPs, build emergency fund to 6 months, drop body fat to 14%.',
        milestones: [
            { name: 'Launch SaaS #1', done: true },
            { name: 'Save $15K Emergency', done: false },
            { name: 'Consistent PPL Split', done: true },
        ]
    }
];

const achievements = [
    { id: 'a1', name: 'Iron Will', desc: 'Workout 30 days in a row', icon: '🏋️', tier: 'Gold', locked: false, color: '#f59e0b', progress: 100 },
    { id: 'a2', name: 'Zen Master', desc: 'Log 50 meditation sessions', icon: '🧘', tier: 'Silver', locked: false, color: '#e2e8f0', progress: 100 },
    { id: 'a3', name: 'Wealth Builder', desc: 'Save $10,000', icon: '💰', tier: 'Bronze', locked: false, color: '#cd7f32', progress: 100 },
    { id: 'a4', name: 'Early Bird', desc: 'Wake up before 6AM for 14 days', icon: '🌅', tier: 'Silver', locked: true, color: '#e2e8f0', progress: 45 },
    { id: 'a5', name: 'Code Ninja', desc: 'Ship 10 side projects', icon: '💻', tier: 'Gold', locked: true, color: '#f59e0b', progress: 30 },
    { id: 'a6', name: 'Polymath', desc: 'Reach level 50 in 3 domains', icon: '🧠', tier: 'Diamond', locked: true, color: '#00f5ff', progress: 85 },
];

const heatmapData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 5)); // 12 weeks of data

const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function Analytics() {
    const [tab, setTab] = useState('overview');

    return (
        <div className="page-shell">
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiBarChart2 size={10} /> Analytics & Systems</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Life Command Core</h1>
                <p className="page-desc">The ultimate unified view of your trajectory. Cross-domain insights and master planning.</p>
            </motion.div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 22, overflowX: 'auto', paddingBottom: 4 }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', border: tab === t.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.id ? '#f0f0ff' : 'var(--text-3)', transition: 'all 0.2s' }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    {tab === 'overview' && <UnifiedScore />}
                    {tab === 'blueprint' && <LifeBlueprint />}
                    {tab === 'gamified' && <Gamification />}
                    {tab === 'trends' && <DeepTrends />}
                    {tab === 'ai' && <AIAnalyst />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function UnifiedScore() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Prime Core Score */}
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, rgba(0,0,0,0) 70%)', border: '1px solid rgba(124,58,237,0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>PriMaX Prime Score</div>
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                        style={{ fontSize: 96, fontFamily: 'Orbitron, monospace', fontWeight: 900, color: '#f0f0ff', lineHeight: 1, textShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
                        {scores.total}
                    </motion.div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                        <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 100, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>{scores.delta} this month</span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Top 12% of users</span>
                    </div>
                </div>
            </Card>

            {/* Domain Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {scores.domains.map((d, i) => (
                    <motion.div key={d.id} {...fadeUp(i * 0.05)}>
                        <Card style={{ padding: '16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${d.color}15`, color: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{d.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{d.name}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 28, fontWeight: 900, color: d.color }}>{d.score}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/ {d.target} target</span>
                            </div>
                            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', marginBottom: 14 }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(d.score / 100) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                    style={{ height: '100%', borderRadius: 2, background: d.color }} />
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {d.metrics.map((m, j) => (
                                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                        <span style={{ color: 'var(--text-3)' }}>{m.label}</span>
                                        <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{m.val}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function LifeBlueprint() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Timeline */}
            <Card style={{ padding: '30px', position: 'relative' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🗺️ The Master Timeline</div>
                <div style={{ position: 'absolute', left: 45, top: 70, bottom: 30, width: 2, background: 'linear-gradient(to bottom, #7c3aed, #00f5ff)', opacity: 0.3 }} />

                {blueprint.map((b, i) => (
                    <motion.div key={b.id} {...fadeUp(i * 0.1)} style={{ position: 'relative', paddingLeft: 40, marginBottom: 32 }}>
                        <div style={{ position: 'absolute', left: 10, top: 4, width: 10, height: 10, borderRadius: '50%', background: b.color, boxShadow: `0 0 10px ${b.color}` }} />

                        <div style={{ fontSize: 11, fontWeight: 800, color: b.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{b.years}</div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8 }}>{b.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>{b.desc}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                            {b.milestones.map((m, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ color: m.done ? b.color : 'var(--text-3)' }}>{m.done ? <FiCheckCircle size={16} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--text-3)' }} />}</span>
                                    <span style={{ fontSize: 13, color: m.done ? 'var(--text-3)' : 'var(--text-1)', textDecoration: m.done ? 'line-through' : 'none' }}>{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </Card>

            {/* Goal Driven Mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card style={{ background: 'linear-gradient(135deg,rgba(0,245,255,0.08),rgba(124,58,237,0.04))', border: '1px solid rgba(0,245,255,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 24 }}>🎯</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goal-Driven Mode</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>Your system is currently optimizing for <strong>The 2027 Accelerator</strong>. Tasks aligned with this blueprint are being prioritized across all modules.</p>
                    <div style={{ padding: '10px', borderRadius: 8, background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', fontSize: 12, color: '#00f5ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiZap /> System Alignment Active
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🔔 Smart Reminders</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {['Career: Update resume with latest deploy metrics (7 days overdue)', 'Finance: Rebalance ETF portfolio (Due tomorrow)', 'Fitness: Switch to Hypertrophy block (Next week)'].map((r, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                                <span style={{ color: i === 0 ? '#ef4444' : 'var(--text-3)', marginTop: 2 }}>{i === 0 ? <FiTarget /> : <FiClock />}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>{r}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Gamification() {
    return (
        <div>
            {/* Player Status */}
            <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, background: 'linear-gradient(90deg, rgba(124,58,237,0.1) 0%, rgba(20,20,40,0) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                    <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 36} initial={{ strokeDashoffset: 2 * Math.PI * 36 }} animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - 0.75) }} transition={{ duration: 1.5, delay: 0.2 }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 700, marginTop: -4 }}>LVL</span>
                        <span style={{ fontSize: 24, fontFamily: 'Orbitron, monospace', fontWeight: 900, color: '#f0f0ff', marginTop: -4 }}>42</span>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Growth Architect</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Rank: Diamond I</h2>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>75,400 / 100,000 XP to next rank</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 20px', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>🔥</div>
                    <div style={{ fontSize: 16, fontFamily: 'Orbitron, monospace', fontWeight: 900, color: '#f59e0b', marginTop: 4 }}>114</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Day Streak</div>
                </div>
            </Card>

            {/* Badges / Achievements */}
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16 }}>🏆 Achievements Showcase</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {achievements.map((a, i) => (
                    <motion.div key={a.id} {...fadeUp(i * 0.05)}>
                        <Card style={{ padding: '18px', textAlign: 'center', opacity: a.locked ? 0.6 : 1, filter: a.locked ? 'grayscale(0.8)' : 'none', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: 42, marginBottom: 10, filter: `drop-shadow(0 0 10px ${a.color}80)` }}>{a.icon}</div>
                            <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.1)', color: a.locked ? 'var(--text-3)' : a.color, fontWeight: 700, display: 'inline-block', marginBottom: 8 }}>{a.tier}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4, height: 32 }}>{a.desc}</div>
                            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', marginTop: 14 }}>
                                <div style={{ width: `${a.progress}%`, height: '100%', borderRadius: 2, background: a.locked ? 'rgba(255,255,255,0.3)' : a.color }} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function DeepTrends() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🟩 12-Week Activity Density</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Jan - Mar 2026</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
                    {heatmapData.map((val, i) => {
                        const colors = ['rgba(255,255,255,0.03)', '#10b98130', '#10b98160', '#10b981', '#00f5ff'];
                        return (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.random() * 0.5 }}
                                style={{ width: 14, height: 14, borderRadius: 4, background: colors[val], border: '1px solid rgba(255,255,255,0.02)' }}
                                title={`Activity Level: ${val}`}
                            />
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-3)' }}>
                    Less <div style={{ display: 'flex', gap: 3 }}>{['rgba(255,255,255,0.03)', '#10b98130', '#10b98160', '#10b981', '#00f5ff'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />)}</div> More
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚖️ Domain Balance Radar</div>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                        {/* Stub for radar chart to keep it simple and native */}
                        <div style={{ width: 150, height: 150, borderRadius: '50%', border: '1px dashed rgba(124,58,237,0.5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '40%', background: 'rgba(124,58,237,0.2)', position: 'absolute', transform: 'rotate(15deg) scale(1.2, 0.9)' }} />
                            <div style={{ width: 80, height: 80, borderRadius: '40%', background: 'rgba(0,245,255,0.3)', position: 'absolute', transform: 'rotate(-45deg) scale(0.8, 1.1)' }} />
                            <span style={{ fontSize: 10, position: 'absolute', top: -20 }}>Career 88</span>
                            <span style={{ fontSize: 10, position: 'absolute', bottom: -20 }}>Mental 88</span>
                            <span style={{ fontSize: 10, position: 'absolute', left: -40 }}>Fit 78</span>
                            <span style={{ fontSize: 10, position: 'absolute', right: -45 }}>Fin 82</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚔️ Correlation Engine</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>How your domains interact based on past 90 days of data:</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['High Sleep → +15% Focus Score', 'High Stress → -10% Spending Control', 'Workout Days → +20% Mood Score'].map((t, i) => (
                            <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${['#10b981', '#ef4444', '#7c3aed'][i]}` }}>
                                <div style={{ fontSize: 12, color: 'var(--text-1)' }}>{t}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function AIAnalyst() {
    const [q, setQ] = useState('');
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);
    const ask = async () => {
        if (!q.trim()) return;
        setLoading(true); setReport('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(`You are PriMaX Hub's elite AI Data Scientist and Life Strategist. The user asks: "${q}"\n\nContext: Unified score 84/100. Career (88), Finance (82), Fitness (78), Mental (88). Working towards a 2030 Master Vision showing heavy trajectory optimization.\n\nProvide:\n1. Deep cross-domain data analysis\n2. Hidden bottlenecks\n3. Leverage points (where 20% of effort gets 80% results)\n4. Strategic recommendations\n\nUse headers, bullets, emojis. Be highly analytical and visionary. Keep under 350 words.`);
            setReport(result.response.text());
        } catch { setReport('⚠️ Could not generate analysis. Try again.'); }
        setLoading(false);
    };
    const prompts = ['Analyze my bottlenecks across all domains', 'What is the highest leverage action I can take this week?', 'Based on my data, will I hit my 2030 vision?', 'Find hidden correlations between my finance and health data'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(0,245,255,0.08),rgba(124,58,237,0.04))', border: '1px solid rgba(0,245,255,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>📈</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Systems Analyst</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>Query your entire life dataset. Discover hidden correlations, forecast trajectories, and optimize your master blueprint.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Run an analysis query..." rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={ask} disabled={loading || !q.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#00f5ff,#7c3aed)', border: 'none', color: '#000', fontSize: 14, fontWeight: 800, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Processing...</> : <><FiZap size={14} /> Run Analysis</>}
                </motion.button>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sample Queries:</span>
                    {prompts.map((p, i) => (
                        <button key={i} onClick={() => setQ(p)} style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>🔬 {p}</button>
                    ))}
                </div>
            </Card>
            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {report ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#00f5ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#000' }}>🔬</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Systems Report</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{report}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>📊</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Intelligence Brief will appear here</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
