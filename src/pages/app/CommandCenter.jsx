import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiTarget, FiTrendingUp, FiClock, FiStar,
    FiCheckCircle, FiCircle, FiArrowRight, FiArrowUp,
    FiActivity, FiSun, FiMoon, FiCalendar, FiChevronRight,
    FiDollarSign, FiHeart, FiBriefcase, FiBarChart2,
    FiMessageCircle, FiAlertCircle, FiAward,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* ─── Static layout data ──────────────────────────────── */
const weeklyScores = [72, 78, 65, 88, 82, 91, 88];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const lifeDimensions = [
    { label: 'Mind', pct: 92, color: '#7c3aed', icon: '🧠' },
    { label: 'Body', pct: 78, color: '#10b981', icon: '💪' },
    { label: 'Career', pct: 85, color: '#00f5ff', icon: '💼' },
    { label: 'Wealth', pct: 71, color: '#f59e0b', icon: '💰' },
    { label: 'Social', pct: 80, color: '#ec4899', icon: '👥' },
    { label: 'Spirit', pct: 88, color: '#f97316', icon: '✨' },
];

const aiInsights = [
    {
        emoji: '🎯',
        title: 'Start with your highest priority task',
        body: 'Research shows starting the day tackling your most important task leads to 38% better productivity. Check your task list and pick your #1 item.',
        color: '#7c3aed',
        action: 'View Tasks',
    },
    {
        emoji: '💸',
        title: 'Review your financial health',
        body: 'Regular spending reviews help identify savings opportunities. Head to Finance to track your income, expenses, and savings goals.',
        color: '#f59e0b',
        action: 'Review Finance',
    },
    {
        emoji: '🔥',
        title: 'Don\'t break your streak',
        body: 'Consistency is the key to mastery. Log today\'s habits and workouts to keep your momentum going.',
        color: '#ec4899',
        action: 'Log Habits',
    },
];

/* ─── Animation variants ──────────────────────────────── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
});

const stagger = {
    animate: { transition: { staggerChildren: 0.07 } },
};

/* ─── Sub-components ──────────────────────────────────── */
function Card({ children, style = {}, ...rest }) {
    return (
        <div style={{
            borderRadius: 20,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            backdropFilter: 'blur(12px)',
            padding: 24,
            ...style,
        }} {...rest}>
            {children}
        </div>
    );
}

function SectionTitle({ children, icon, action }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                <span style={{ color: '#7c3aed' }}>{icon}</span>{children}
            </h3>
            {action && (
                <Link to={action.to} style={{ fontSize: 12, color: '#00f5ff', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {action.label} <FiChevronRight size={12} />
                </Link>
            )}
        </div>
    );
}

/* ─── Growth Score Ring ───────────────────────────────── */
function GrowthRing({ score = 847 }) {
    const max = 1000;
    const pct = score / max;
    const r = 52;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct;

    return (
        <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle
                    cx="70" cy="70" r={r} fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - dash }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#00f5ff" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                    {score}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.08em' }}>/ 1000</span>
            </div>
        </div>
    );
}

/* ─── Weekly bar chart ────────────────────────────────── */
function WeeklyChart() {
    const todayIdx = 6; // Sun = latest
    return (
        <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
                {weeklyScores.map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 10, color: i === todayIdx ? '#00f5ff' : 'var(--text-3)', fontWeight: 700 }}>{h}</span>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 56, borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(h / 100) * 56}px` }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    width: '100%',
                                    borderRadius: 6,
                                    background: i === todayIdx
                                        ? 'linear-gradient(to top, #7c3aed, #00f5ff)'
                                        : i === todayIdx - 1
                                            ? 'rgba(124,58,237,0.5)'
                                            : 'rgba(124,58,237,0.2)',
                                    alignSelf: 'flex-end',
                                }}
                            />
                        </div>
                        <span style={{ fontSize: 10, color: i === todayIdx ? '#00f5ff' : 'var(--text-3)', fontWeight: i === todayIdx ? 700 : 400 }}>{weekDays[i]}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, padding: '10px 12px', borderRadius: 12, background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.12)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Weekly average</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                    {Math.round(weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length)} pts
                    <span style={{ color: '#10b981', marginLeft: 6 }}>↑ +8 vs last week</span>
                </span>
            </div>
        </div>
    );
}

/* ─── Current time highlight for agenda ──────────────── */
function nowHour() {
    return new Date().getHours();
}

/* ─── Main Component ──────────────────────────────────── */
export default function CommandCenter() {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [insightIdx, setInsightIdx] = useState(0);
    // Real data from Supabase
    const [tasks, setTasks] = useState([]);
    const [moduleStats, setModuleStats] = useState({});
    const overviewStats = [
        { label: 'Open Tasks', value: moduleStats.openTasks ?? '–', delta: 'from Productivity', color: '#7c3aed', icon: <FiTarget />, bg: 'rgba(124,58,237,0.12)' },
        { label: 'Habit Streak', value: moduleStats.streak ?? '–', delta: 'days in a row', color: '#f59e0b', icon: <FiZap />, bg: 'rgba(245,158,11,0.1)' },
        { label: 'Savings Goals', value: moduleStats.goals ?? '–', delta: 'active goals', color: '#00f5ff', icon: <FiActivity />, bg: 'rgba(0,245,255,0.08)' },
        { label: 'Net Balance', value: moduleStats.net ?? '–', delta: 'income – expenses', color: '#10b981', icon: <FiStar />, bg: 'rgba(16,185,129,0.1)' },
    ];
    const moduleActivity = [
        { icon: <FiZap />, label: 'Productivity', value: `${moduleStats.openTasks ?? 0} tasks open`, change: 'Tap to manage', color: '#7c3aed', path: '/app/productivity' },
        { icon: <FiBriefcase />, label: 'Career', value: moduleStats.careerRole ?? 'Set up profile', change: 'View roadmap', color: '#00f5ff', path: '/app/career' },
        { icon: <FiDollarSign />, label: 'Finance', value: moduleStats.net ?? 'No data', change: 'Track spending', color: '#f59e0b', path: '/app/finance' },
        { icon: <FiHeart />, label: 'Fitness', value: `${moduleStats.workouts ?? 0} workouts`, change: `${moduleStats.streak ?? 0}d streak`, color: '#ec4899', path: '/app/fitness' },
        { icon: <FiSun />, label: 'Mental', value: `${moduleStats.journals ?? 0} entries`, change: 'Journal & Mood', color: '#f97316', path: '/app/mental' },
        { icon: <FiBarChart2 />, label: 'Analytics', value: 'View insights', change: 'Cross-domain trends', color: '#10b981', path: '/app/analytics' },
    ];

    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setInsightIdx(i => (i + 1) % aiInsights.length), 6000);
        return () => clearInterval(t);
    }, []);

    // Fetch real data
    useEffect(() => {
        if (!user) return;
        (async () => {
            const today = new Date().toISOString().split('T')[0];
            const thisMonth = today.substring(0, 7);
            const [taskRes, habitRes, goalRes, txRes, workoutRes, journalRes, careerRes] = await Promise.all([
                supabase.from('tasks').select('status').eq('user_id', user.id).neq('status', 'done').limit(5),
                supabase.from('habits').select('streak,completions').eq('user_id', user.id),
                supabase.from('savings_goals').select('id').eq('user_id', user.id),
                supabase.from('transactions').select('amount,type').eq('user_id', user.id),
                supabase.from('workouts').select('id').eq('user_id', user.id).gte('completed_at', thisMonth + '-01'),
                supabase.from('journal_entries').select('id').eq('user_id', user.id),
                supabase.from('career_profiles').select('target_role').eq('user_id', user.id).maybeSingle(),
            ]);
            const openTasks = (taskRes.data || []).length;
            const habits = habitRes.data || [];
            const maxStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0;
            const txs = txRes.data || [];
            const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
            const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
            const net = income - expense;
            // Latest tasks as priority items
            const { data: latestTasks } = await supabase.from('tasks').select('*').eq('user_id', user.id).neq('status', 'done').order('created_at', { ascending: false }).limit(6);
            setTasks((latestTasks || []).map(t => ({ id: t.id, text: t.title, module: 'Productivity', color: '#7c3aed', urgent: t.priority === 'high', done: false, raw: t })));
            setModuleStats({
                openTasks,
                streak: maxStreak,
                goals: (goalRes.data || []).length,
                net: net !== 0 ? `${net >= 0 ? '+' : ''}$${Math.abs(net).toFixed(0)}` : '$0',
                workouts: (workoutRes.data || []).length,
                journals: (journalRes.data || []).length,
                careerRole: careerRes.data?.target_role || null,
            });
        })();
    }, [user]);

    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greetEmoji = hour < 12 ? '☀️' : hour < 17 ? '⚡' : '🌙';
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Growth Pioneer';

    const doneCount = tasks.filter(t => t.done).length;
    const dayPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

    const toggleTask = (i) =>
        setTasks(ts => ts.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));

    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="page-shell">

            {/* ── HERO HEADER ─────────────────────────────────── */}
            <motion.div {...fadeUp(0)} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 22 }}>{greetEmoji}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{formattedDate} · {formattedTime}</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                            {greeting}, <span style={{ background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{userName}</span> 👋
                        </h1>
                        <p style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.6 }}>
                            {tasks.length > 0 ? <><strong style={{ color: '#10b981' }}>{doneCount} of {tasks.length}</strong> priority tasks done today. {dayPct >= 50 ? "You're crushing it!" : "Let's make today count."}</> : 'Add tasks in Productivity to track your daily progress.'}
                        </p>
                    </div>

                    {/* Day progress pill */}
                    <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 16, background: 'var(--app-surface)', border: '1px solid var(--app-border)', backdropFilter: 'blur(12px)' }}>
                        <div style={{ position: 'relative', width: 52, height: 52 }}>
                            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                                <motion.circle cx="26" cy="26" r="22" fill="none" stroke="url(#dayGrad)" strokeWidth="5"
                                    strokeLinecap="round" strokeDasharray={138}
                                    initial={{ strokeDashoffset: 138 }}
                                    animate={{ strokeDashoffset: 138 - (138 * dayPct / 100) }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
                                <defs>
                                    <linearGradient id="dayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#00f5ff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#10b981' }}>{dayPct}%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Day Progress</div>
                            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{doneCount}/{tasks.length} tasks done</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── OVERVIEW STATS ──────────────────────────────── */}
            <motion.div variants={stagger} initial="initial" animate="animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
                {overviewStats.map((s, i) => (
                    <motion.div key={i} {...fadeUp(i * 0.06)} whileHover={{ scale: 1.02, y: -2 }}
                        style={{ padding: '20px 22px', borderRadius: 18, background: s.bg, border: `1px solid ${s.color}25`, transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 16 }}>
                                {s.icon}
                            </div>
                            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 100 }}>{s.delta}</span>
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── MAIN GRID ───────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, alignItems: 'start' }}>

                {/* ── LEFT COLUMN (8 cols) ── */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* AI Insights Panel */}
                    <motion.div {...fadeUp(0.15)}>
                        <Card style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,245,255,0.05))', border: '1px solid rgba(124,58,237,0.25)', position: 'relative', overflow: 'hidden' }}>
                            {/* animated background blob */}
                            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: `${aiInsights[insightIdx].color}18`, filter: 'blur(40px)', transition: 'background 0.6s', pointerEvents: 'none' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
                                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00f5ff' }}>AI Coach Insight</span>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    {aiInsights.map((_, i) => (
                                        <button key={i} onClick={() => setInsightIdx(i)}
                                            style={{ width: i === insightIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === insightIdx ? '#7c3aed' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
                                    ))}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={insightIdx}
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.35 }}>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 32, flexShrink: 0 }}>{aiInsights[insightIdx].emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{aiInsights[insightIdx].title}</h4>
                                            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 14 }}>{aiInsights[insightIdx].body}</p>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <Link to="/app/ai">
                                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                        style={{ padding: '8px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {aiInsights[insightIdx].action} <FiArrowRight size={12} />
                                                    </motion.button>
                                                </Link>
                                                <button style={{ padding: '8px 14px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(0,245,255,0.2)', color: 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </Card>
                    </motion.div>

                    {/* Priority Tasks */}
                    <motion.div {...fadeUp(0.2)}>
                        <Card>
                            <SectionTitle icon={<FiTarget size={14} />} action={{ label: 'View all goals', to: '/app/productivity' }}>
                                Priority Tasks
                            </SectionTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {tasks.length === 0 ? (
                                    <Link to="/app/productivity" style={{ textAlign: 'center', padding: '24px', display: 'block', borderRadius: 14, border: '1px dashed rgba(124,58,237,0.2)', color: 'var(--text-3)', fontSize: 13, textDecoration: 'none' }}>No open tasks — go add some in Productivity ✅</Link>
                                ) : tasks.map((task, i) => (
                                    <motion.div key={task.id ?? i}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.05 }}
                                        whileHover={{ x: 3 }}
                                        onClick={() => toggleTask(i)}
                                        style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: task.done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${task.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <div style={{ color: task.done ? '#10b981' : 'var(--text-3)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                            {task.done ? <FiCheckCircle size={17} /> : <FiCircle size={17} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: 14, color: task.done ? 'var(--text-3)' : 'var(--text-1)', fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none' }}>
                                                {task.text}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {task.urgent && !task.done && (
                                                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 700 }}>HIGH</span>
                                            )}
                                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${task.color}15`, border: `1px solid ${task.color}25`, color: task.color, fontWeight: 600 }}>
                                                {task.module}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Module Activity Summaries */}
                    <motion.div {...fadeUp(0.25)}>
                        <Card>
                            <SectionTitle icon={<FiActivity size={14} />} action={{ label: 'Analytics', to: '/app/analytics' }}>
                                Module Snapshot
                            </SectionTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                {moduleActivity.map((m, i) => (
                                    <Link key={i} to={m.path} style={{ textDecoration: 'none' }}>
                                        <motion.div whileHover={{ scale: 1.03, y: -2 }}
                                            style={{ padding: '14px', borderRadius: 14, background: `${m.color}08`, border: `1px solid ${m.color}20`, cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, fontSize: 13 }}>{m.icon}</div>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</span>
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 800, color: m.color, marginBottom: 3 }}>{m.value}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.change}</div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                </div>

                {/* ── RIGHT COLUMN (4 cols) ── */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Growth Score */}
                    <motion.div {...fadeUp(0.1)}>
                        <Card>
                            <SectionTitle icon={<FiAward size={14} />} action={{ label: 'Full analytics', to: '/app/analytics' }}>
                                Growth Score
                            </SectionTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                <GrowthRing score={847} />
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {lifeDimensions.map((d, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                                <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <span style={{ fontSize: 13 }}>{d.icon}</span> {d.label}
                                                </span>
                                                <span style={{ fontSize: 12, color: d.color, fontWeight: 700 }}>{d.pct}%</span>
                                            </div>
                                            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${d.pct}%` }}
                                                    transition={{ duration: 1.2, delay: 0.3 + i * 0.07 }}
                                                    style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>vs last week</span>
                                    <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><FiArrowUp size={12} /> +24 pts</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Weekly Performance */}
                    <motion.div {...fadeUp(0.18)}>
                        <Card>
                            <SectionTitle icon={<FiBarChart2 size={14} />} action={{ label: 'View trends', to: '/app/analytics' }}>
                                Weekly Performance
                            </SectionTitle>
                            <WeeklyChart />
                        </Card>
                    </motion.div>

                    {/* Today's Agenda */}
                    <motion.div {...fadeUp(0.22)}>
                        <Card>
                            <SectionTitle icon={<FiCalendar size={14} />}>Today's Agenda</SectionTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                                {/* vertical timeline line */}
                                <div style={{ position: 'absolute', left: 27, top: 8, bottom: 8, width: 1, background: 'rgba(255,255,255,0.06)' }} />

                                {tasks.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0', opacity: 0.6 }}>
                                        <span style={{ fontSize: 32 }}>📅</span>
                                        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Add tasks in Productivity to build your daily agenda.</span>
                                    </div>
                                ) : tasks.slice(0, 6).map((item, i) => (
                                    <motion.div key={item.id ?? i}
                                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 6px', borderRadius: 10, marginBottom: 2 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.done ? '#10b981' : 'rgba(255,255,255,0.15)', border: `2px solid ${item.done ? '#10b981' : 'rgba(255,255,255,0.1)'}`, flexShrink: 0, zIndex: 1 }} />
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: 12, color: item.done ? 'var(--text-3)' : 'var(--text-2)', textDecoration: item.done ? 'line-through' : 'none' }}>
                                                    {item.text}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 10, color: item.color, background: `${item.color}15`, padding: '2px 6px', borderRadius: 5, fontWeight: 600 }}>{item.module}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>

            {/* ── RESPONSIVE: stack on small screens ─────────── */}
            <style>{`
        @media (max-width: 900px) {
          .cc-main-grid > div:first-child { grid-column: span 12 !important; }
          .cc-main-grid > div:last-child  { grid-column: span 12 !important; }
        }
      `}</style>
        </div>
    );
}
