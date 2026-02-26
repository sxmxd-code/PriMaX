import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHeart, FiPlus, FiTrash2, FiTarget, FiCheckCircle, FiCircle,
    FiX, FiZap, FiRotateCcw, FiBarChart2, FiClock, FiTrendingUp,
    FiActivity, FiCalendar, FiChevronRight, FiAward,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TABS = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 size={14} /> },
    { id: 'workouts', label: 'Workouts', icon: <FiActivity size={14} /> },
    { id: 'habits', label: 'Health Habits', icon: <FiHeart size={14} /> },
    { id: 'goals', label: 'Goals', icon: <FiTarget size={14} /> },
    { id: 'ai', label: 'AI Coach', icon: <FiZap size={14} /> },
];

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const initWorkouts = [
    { id: 'w1', name: 'Push Day — Chest & Triceps', exercises: ['Bench Press 4×8', 'Incline DB 3×10', 'Cable Flyes 3×12', 'Tricep Dips 3×12', 'Overhead Ext 3×15'], duration: '55 min', day: 'Mon', done: true, color: '#7c3aed' },
    { id: 'w2', name: 'Pull Day — Back & Biceps', exercises: ['Deadlift 4×6', 'Pull-ups 4×8', 'Cable Rows 3×12', 'Face Pulls 3×15', 'Barbell Curl 3×10'], duration: '50 min', day: 'Tue', done: true, color: '#00f5ff' },
    { id: 'w3', name: 'Legs & Core', exercises: ['Squats 4×8', 'Leg Press 3×12', 'RDL 3×10', 'Leg Curl 3×12', 'Planks 3×60s'], duration: '60 min', day: 'Wed', done: false, color: '#10b981' },
    { id: 'w4', name: 'Upper Body Power', exercises: ['OHP 4×6', 'Weighted Pull-ups 4×6', 'Dumbbell Rows 3×10', 'Lateral Raises 3×15'], duration: '45 min', day: 'Thu', done: false, color: '#f59e0b' },
    { id: 'w5', name: 'HIIT + Cardio', exercises: ['Sprint Intervals 8×30s', 'Jump Rope 3×2min', 'Burpees 3×15', 'Mountain Climbers 3×20'], duration: '35 min', day: 'Fri', done: false, color: '#ec4899' },
    { id: 'w6', name: 'Active Recovery', exercises: ['Yoga Flow 20min', 'Foam Rolling 15min', 'Stretching 15min'], duration: '50 min', day: 'Sat', done: false, color: '#f97316' },
];

const initHabits = [
    { id: 'h1', name: 'Drink 8 glasses water', icon: '💧', streak: 17, week: [1, 1, 1, 1, 1, 1, 0], color: '#00f5ff' },
    { id: 'h2', name: '7+ hours sleep', icon: '😴', streak: 12, week: [1, 1, 0, 1, 1, 1, 0], color: '#7c3aed' },
    { id: 'h3', name: '10K steps', icon: '🚶', streak: 8, week: [1, 1, 1, 0, 1, 0, 0], color: '#10b981' },
    { id: 'h4', name: 'Protein goal (150g)', icon: '🥩', streak: 23, week: [1, 1, 1, 1, 1, 1, 0], color: '#f59e0b' },
    { id: 'h5', name: 'No junk food', icon: '🥗', streak: 5, week: [1, 1, 1, 0, 1, 0, 0], color: '#ec4899' },
    { id: 'h6', name: 'Morning stretch', icon: '🧘', streak: 31, week: [1, 1, 1, 1, 1, 1, 0], color: '#f97316' },
];

const initGoals = [
    { id: 'g1', name: 'Bench Press 225 lbs', current: 195, target: 225, unit: 'lbs', color: '#7c3aed', icon: '🏋️' },
    { id: 'g2', name: 'Run 5K under 22 min', current: 23.5, target: 22, unit: 'min', color: '#ec4899', icon: '🏃', invert: true },
    { id: 'g3', name: 'Body fat to 14%', current: 17, target: 14, unit: '%', color: '#10b981', icon: '📉', invert: true },
    { id: 'g4', name: '30-day workout streak', current: 12, target: 30, unit: 'days', color: '#f59e0b', icon: '🔥' },
];

const weeklyVolume = [12, 14, 11, 16, 13, 15, 10];

const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function Fitness() {
    const [tab, setTab] = useState('overview');
    const stats = [
        { label: 'Workouts', value: '12', delta: '2 this week', color: '#7c3aed', icon: <FiActivity /> },
        { label: 'Streak', value: '12d', delta: 'Best: 18d', color: '#f59e0b', icon: <FiZap /> },
        { label: 'Habits', value: '5/6', delta: '83% today', color: '#10b981', icon: <FiHeart /> },
        { label: 'Fitness Score', value: '78', delta: '+4 this week', color: '#ec4899', icon: <FiTrendingUp /> },
    ];

    return (
        <div className="page-shell">
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiHeart size={10} /> Fitness</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Fitness Command Center</h1>
                <p className="page-desc">Train smarter, recover better — AI-powered fitness intelligence for peak performance.</p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRadius: 14, background: `${s.color}0c`, border: `1px solid ${s.color}20` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span>
                            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: 100 }}>{s.delta}</span>
                        </div>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{s.label}</div>
                    </div>
                ))}
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
                    {tab === 'overview' && <FitOverview />}
                    {tab === 'workouts' && <Workouts />}
                    {tab === 'habits' && <HealthHabits />}
                    {tab === 'goals' && <FitGoals />}
                    {tab === 'ai' && <AIFitCoach />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function FitOverview() {
    const done = initWorkouts.filter(w => w.done).length;
    const maxV = Math.max(...weeklyVolume);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📅 This Week's Plan</div>
                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(done / initWorkouts.length) * 100}%` }} transition={{ duration: 0.8 }}
                                style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>{done}/{initWorkouts.length}</span>
                    </div>
                    {initWorkouts.map((w, i) => (
                        <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: w.done ? 'rgba(16,185,129,0.05)' : 'transparent', marginBottom: 4 }}>
                            <div style={{ color: w.done ? '#10b981' : 'var(--text-3)', display: 'flex' }}>{w.done ? <FiCheckCircle size={15} /> : <FiCircle size={15} />}</div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 13, color: w.done ? 'var(--text-3)' : 'var(--text-1)', fontWeight: 500, textDecoration: w.done ? 'line-through' : 'none' }}>{w.name}</span>
                            </div>
                            <span style={{ fontSize: 10, color: w.color, background: `${w.color}15`, padding: '2px 7px', borderRadius: 100, fontWeight: 600 }}>{w.day}</span>
                            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{w.duration}</span>
                        </div>
                    ))}
                </Card>
                <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 28 }}>🤖</span>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', marginBottom: 4 }}>AI INSIGHT</div>
                            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>Your upper body volume is <strong style={{ color: '#10b981' }}>18% higher</strong> than lower body this week. Consider adding an extra leg set on Thursday to maintain balance and reduce injury risk.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Weekly Volume (sets)</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
                        {weeklyVolume.map((v, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 10, color: i === 6 ? '#00f5ff' : 'var(--text-3)', fontWeight: 700 }}>{v}</span>
                                <div style={{ width: '100%', height: 70, display: 'flex', alignItems: 'flex-end', borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${(v / maxV) * 70}px` }}
                                        transition={{ duration: 0.8, delay: 0.1 + i * 0.06 }}
                                        style={{ width: '100%', borderRadius: 6, background: i < done ? 'linear-gradient(to top,#7c3aed,#10b981)' : 'rgba(124,58,237,0.15)' }} />
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{weekDays[i]}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎯 Active Goals</div>
                    {initGoals.map((g, i) => {
                        const pct = g.invert ? Math.round(((g.current - g.target) === 0 ? 100 : Math.max(0, (1 - (g.current - g.target) / (g.current)) * 100))) : Math.round((g.current / g.target) * 100);
                        return (
                            <div key={g.id} style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>{g.icon} {g.name}</span>
                                    <span style={{ fontSize: 11, color: g.color, fontWeight: 700 }}>{g.current}{g.unit}</span>
                                </div>
                                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                                        transition={{ duration: 1, delay: i * 0.08 }}
                                        style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }} />
                                </div>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </div>
    );
}

function Workouts() {
    const [workouts, setWorkouts] = useState(initWorkouts);
    const [expanded, setExpanded] = useState(null);
    const toggle = (id) => setWorkouts(ws => ws.map(w => w.id === id ? { ...w, done: !w.done } : w));

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {workouts.map((w, i) => (
                <motion.div key={w.id} {...fadeUp(i * 0.05)}>
                    <Card style={{ padding: '18px 20px', border: `1px solid ${w.done ? 'rgba(16,185,129,0.2)' : `${w.color}20`}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <button onClick={() => toggle(w.id)} style={{ background: 'none', border: 'none', color: w.done ? '#10b981' : 'var(--text-3)', cursor: 'pointer', display: 'flex' }}>
                                    {w.done ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                                </button>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: w.done ? 'var(--text-3)' : 'var(--text-1)', textDecoration: w.done ? 'line-through' : 'none' }}>{w.name}</div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${w.color}15`, color: w.color, fontWeight: 700 }}>{w.day}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><FiClock size={9} /> {w.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setExpanded(expanded === w.id ? null : w.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', transform: expanded === w.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                        <AnimatePresence>
                            {expanded === w.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}>
                                    <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        {w.exercises.map((ex, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: j < w.exercises.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                                                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{ex}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

function HealthHabits() {
    const [habits, setHabits] = useState(initHabits);
    const toggleDay = (hId, dIdx) => setHabits(hs => hs.map(h => h.id === hId ? { ...h, week: h.week.map((v, i) => i === dIdx ? (v ? 0 : 1) : v) } : h));
    const todayDone = habits.reduce((s, h) => s + (h.week[6] || 0), 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '14px 18px', borderRadius: 14, background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>💪 Today's Health Habits — {todayDone}/{habits.length}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{Math.round((todayDone / habits.length) * 100)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {habits.map(h => (
                    <Card key={h.id} style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 24 }}>{h.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{h.name}</div>
                                <div style={{ fontSize: 11, color: h.color, fontWeight: 700, marginTop: 2 }}>🔥 {h.streak}-day streak</div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {weekDays.map((d, di) => (
                                    <div key={di} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                        <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{d}</span>
                                        <button onClick={() => toggleDay(h.id, di)}
                                            style={{ width: 22, height: 22, borderRadius: 6, background: h.week[di] ? `${h.color}30` : 'rgba(255,255,255,0.04)', border: `1px solid ${h.week[di] ? h.color : 'rgba(255,255,255,0.08)'}`, color: h.week[di] ? h.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, transition: 'all 0.2s' }}>
                                            {h.week[di] ? '✓' : ''}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function FitGoals() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {initGoals.map((g, i) => {
                const pct = g.invert ? Math.min(100, Math.round(((g.current - g.target) === 0 ? 100 : (1 - (g.current - g.target) / g.current) * 100))) : Math.round((g.current / g.target) * 100);
                const r = 42; const circ = 2 * Math.PI * r;
                return (
                    <motion.div key={g.id} {...fadeUp(i * 0.06)}>
                        <Card>
                            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
                                    <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                                        <motion.circle cx="48" cy="48" r={r} fill="none" stroke={g.color} strokeWidth="7"
                                            strokeLinecap="round" strokeDasharray={circ}
                                            initial={{ strokeDashoffset: circ }}
                                            animate={{ strokeDashoffset: circ - (circ * Math.min(pct, 100) / 100) }}
                                            transition={{ duration: 1.2, delay: 0.2 + i * 0.08 }} />
                                    </svg>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{g.icon}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{g.name}</div>
                                    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                                        <div><div style={{ fontSize: 10, color: 'var(--text-3)' }}>Current</div><div style={{ fontFamily: 'Orbitron, monospace', fontSize: 16, fontWeight: 900, color: g.color }}>{g.current}{g.unit}</div></div>
                                        <div><div style={{ fontSize: 10, color: 'var(--text-3)' }}>Target</div><div style={{ fontFamily: 'Orbitron, monospace', fontSize: 16, fontWeight: 900, color: 'var(--text-2)' }}>{g.target}{g.unit}</div></div>
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)`, transition: 'width 0.6s' }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{pct}% complete</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}

function AIFitCoach() {
    const [q, setQ] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const ask = async () => {
        if (!q.trim()) return;
        setLoading(true); setPlan('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(`You are PriMaX Hub's elite AI Fitness Coach — trained on exercise science, nutrition, and sports psychology. The user asks: "${q}"\n\nContext: They follow a Push/Pull/Legs split, currently bench 195 lbs, run 5K in 23.5 min, at 17% body fat. They train 5-6 days/week.\n\nProvide:\n1. Clear analysis\n2. Specific actionable plan with sets/reps/timing\n3. Nutrition advice if relevant\n4. A "Quick Win" for today\n\nUse headers, bullets, emojis. Be specific. Keep under 350 words.`);
            setPlan(result.response.text());
        } catch { setPlan('⚠️ Could not generate. Try again.'); }
        setLoading(false);
    };
    const prompts = ['Build a 12-week strength programme', 'How to break through my bench press plateau', 'Optimal nutrition plan for muscle gain and fat loss', 'Recovery strategies for training 6 days a week'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(236,72,153,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(236,72,153,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>💪</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Fitness Coach</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>Ask anything about training, nutrition, recovery, or performance. Get personalised advice based on your fitness profile.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="What fitness question do you have?" rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={ask} disabled={loading || !q.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#ec4899,#7c3aed)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Thinking...</> : <><FiZap size={14} /> Get Plan</>}
                </motion.button>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Try:</span>
                    {prompts.map((p, i) => (
                        <button key={i} onClick={() => setQ(p)} style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>🏋️ {p}</button>
                    ))}
                </div>
            </Card>
            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {plan ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#ec4899,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fitness Plan</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{plan}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>🏃</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your fitness plan will appear here</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
