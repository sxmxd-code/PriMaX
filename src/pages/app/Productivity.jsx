import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiPlus, FiCheck, FiTrash2, FiClock, FiPause, FiPlay,
    FiRotateCcw, FiEdit3, FiTarget, FiCheckCircle, FiCircle,
    FiX, FiChevronRight, FiStar, FiAlertCircle, FiTrendingUp,
    FiBookOpen, FiActivity, FiSave, FiMessageCircle,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

/* ─── Tabs ────────────────────────────────────────────── */
const TABS = [
    { id: 'tasks', label: 'Tasks', icon: <FiTarget size={14} /> },
    { id: 'focus', label: 'Focus Mode', icon: <FiClock size={14} /> },
    { id: 'notes', label: 'Quick Notes', icon: <FiEdit3 size={14} /> },
    { id: 'habits', label: 'Habits', icon: <FiActivity size={14} /> },
    { id: 'ai', label: 'AI Planner', icon: <FiMessageCircle size={14} /> },
];

/* ─── Seed data ────────────────────────────────────────── */
const initialColumns = {
    backlog: {
        title: 'Backlog', color: '#5a5a80',
        tasks: [
            { id: 't1', text: 'Research competitor pricing', priority: 'low', tag: 'Career' },
            { id: 't2', text: 'Automate weekly report email', priority: 'med', tag: 'Career' },
        ],
    },
    todo: {
        title: 'To Do', color: '#f59e0b',
        tasks: [
            { id: 't3', text: 'Complete AWS cert module 7', priority: 'high', tag: 'Career' },
            { id: 't4', text: 'Review Q1 revenue projections', priority: 'high', tag: 'Finance' },
            { id: 't5', text: 'Write blog post draft', priority: 'med', tag: 'Career' },
        ],
    },
    doing: {
        title: 'In Progress', color: '#7c3aed',
        tasks: [
            { id: 't6', text: 'Deep work block — API refactor', priority: 'high', tag: 'Productivity' },
        ],
    },
    done: {
        title: 'Done', color: '#10b981',
        tasks: [
            { id: 't7', text: 'Morning 5km run', priority: 'med', tag: 'Fitness' },
            { id: 't8', text: '10-min meditation', priority: 'low', tag: 'Mental' },
        ],
    },
};

const initialHabits = [
    { id: 'h1', name: 'Morning run', icon: '🏃', streak: 12, weekDone: [1, 1, 1, 1, 1, 1, 0], color: '#ec4899' },
    { id: 'h2', name: 'Read 30 min', icon: '📖', streak: 23, weekDone: [1, 1, 1, 1, 1, 0, 0], color: '#7c3aed' },
    { id: 'h3', name: 'Meditate', icon: '🧘', streak: 8, weekDone: [1, 1, 0, 1, 1, 1, 0], color: '#f97316' },
    { id: 'h4', name: 'No social media', icon: '📵', streak: 5, weekDone: [1, 1, 1, 0, 1, 0, 0], color: '#00f5ff' },
    { id: 'h5', name: '8 glasses water', icon: '💧', streak: 17, weekDone: [1, 1, 1, 1, 1, 1, 0], color: '#10b981' },
    { id: 'h6', name: 'Journal', icon: '📝', streak: 31, weekDone: [1, 1, 1, 1, 1, 1, 0], color: '#f59e0b' },
];

const initialNotes = [
    { id: 'n1', title: 'API Architecture Ideas', body: 'Consider microservices with event-driven architecture. Use Kafka for inter-service comms...', ts: '2h ago', color: '#7c3aed' },
    { id: 'n2', title: 'Book: Atomic Habits', body: 'Key takeaway — habit stacking. Pair new habit with existing trigger.', ts: '5h ago', color: '#f59e0b' },
    { id: 'n3', title: 'Meeting Notes — Sprint 14', body: 'Blockers: payment gateway migration. Action: schedule pair-programming session.', ts: 'Yesterday', color: '#00f5ff' },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const priColors = { high: '#ef4444', med: '#f59e0b', low: '#10b981' };

/* ─── Helpers ──────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

/* ═══════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                        */
/* ═══════════════════════════════════════════════════════ */
export default function Productivity() {
    const [tab, setTab] = useState('tasks');

    /* ── Overview stats ── */
    const stats = [
        { label: 'Tasks Done', value: '23', delta: '+5 today', color: '#10b981', icon: <FiCheckCircle /> },
        { label: 'Focus Hours', value: '4.2h', delta: '↑ 1.1h avg', color: '#7c3aed', icon: <FiClock /> },
        { label: 'Streak', value: '12d', delta: 'Best: 18d', color: '#f59e0b', icon: <FiZap /> },
        { label: 'Habits', value: '5/6', delta: '83% today', color: '#ec4899', icon: <FiActivity /> },
    ];

    return (
        <div className="page-shell">
            {/* Header */}
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiZap size={10} /> Productivity</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Productivity Workspace</h1>
                <p className="page-desc">Plan, execute, and iterate — your AI-powered command center for deep work.</p>
            </motion.div>

            {/* Stats row */}
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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 22, overflowX: 'auto', paddingBottom: 4 }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', border: tab === t.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.id ? '#f0f0ff' : 'var(--text-3)', transition: 'all 0.2s' }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    {tab === 'tasks' && <TaskBoard />}
                    {tab === 'focus' && <FocusMode />}
                    {tab === 'notes' && <QuickNotes />}
                    {tab === 'habits' && <HabitTracker />}
                    {tab === 'ai' && <AIPlanner />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  KANBAN TASK BOARD                                      */
/* ═══════════════════════════════════════════════════════ */
function TaskBoard() {
    const [columns, setColumns] = useState(initialColumns);
    const [adding, setAdding] = useState(null);         // col key
    const [newText, setNewText] = useState('');
    const [newPri, setNewPri] = useState('med');
    const inputRef = useRef(null);

    useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

    const addTask = (colKey) => {
        if (!newText.trim()) return;
        const t = { id: `t${Date.now()}`, text: newText.trim(), priority: newPri, tag: 'Productivity' };
        setColumns(c => ({ ...c, [colKey]: { ...c[colKey], tasks: [...c[colKey].tasks, t] } }));
        setNewText(''); setNewPri('med'); setAdding(null);
    };

    const moveTask = (fromCol, taskId, toCol) => {
        setColumns(c => {
            const task = c[fromCol].tasks.find(t => t.id === taskId);
            if (!task) return c;
            return {
                ...c,
                [fromCol]: { ...c[fromCol], tasks: c[fromCol].tasks.filter(t => t.id !== taskId) },
                [toCol]: { ...c[toCol], tasks: [...c[toCol].tasks, task] },
            };
        });
    };

    const deleteTask = (colKey, taskId) => {
        setColumns(c => ({ ...c, [colKey]: { ...c[colKey], tasks: c[colKey].tasks.filter(t => t.id !== taskId) } }));
    };

    const colKeys = Object.keys(columns);
    const totalDone = columns.done.tasks.length;
    const totalAll = colKeys.reduce((s, k) => s + columns[k].tasks.length, 0);

    return (
        <div>
            {/* Progress bar */}
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${totalAll ? (totalDone / totalAll) * 100 : 0}%` }}
                        transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>{totalDone}/{totalAll} done</span>
            </div>

            {/* Board */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colKeys.length}, 1fr)`, gap: 14 }}>
                {colKeys.map(key => {
                    const col = columns[key];
                    return (
                        <div key={key} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--app-border)', padding: 14, minHeight: 240 }}>
                            {/* Column header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</span>
                                    <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 100, fontWeight: 600 }}>{col.tasks.length}</span>
                                </div>
                                {key !== 'done' && (
                                    <button onClick={() => setAdding(key)}
                                        style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', cursor: 'pointer' }}>
                                        <FiPlus size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Tasks */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {col.tasks.map(task => (
                                    <motion.div key={task.id} layout whileHover={{ scale: 1.01 }}
                                        style={{ padding: '12px 13px', borderRadius: 12, background: 'var(--app-surface)', border: `1px solid ${col.color}20`, cursor: 'default' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                            <span style={{ fontSize: 13, color: key === 'done' ? 'var(--text-3)' : 'var(--text-1)', fontWeight: 500, textDecoration: key === 'done' ? 'line-through' : 'none', flex: 1, lineHeight: 1.5 }}>{task.text}</span>
                                            <button onClick={() => deleteTask(key, task.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 2, opacity: 0.6 }}>
                                                <FiTrash2 size={11} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 100, background: `${priColors[task.priority]}18`, color: priColors[task.priority], fontWeight: 700, textTransform: 'uppercase' }}>{task.priority}</span>
                                                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)' }}>{task.tag}</span>
                                            </div>
                                            {/* Move arrows */}
                                            <div style={{ display: 'flex', gap: 3 }}>
                                                {colKeys.filter(k => k !== key).slice(-1).map(k => (
                                                    <button key={k} onClick={() => moveTask(key, task.id, colKeys[Math.min(colKeys.indexOf(key) + 1, colKeys.length - 1)])}
                                                        style={{ background: 'none', border: 'none', color: col.color, cursor: 'pointer', padding: 2, display: 'flex' }}>
                                                        <FiChevronRight size={13} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Add form */}
                                {adding === key && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        style={{ padding: 12, borderRadius: 12, background: 'var(--app-surface)', border: '1px solid rgba(124,58,237,0.3)' }}>
                                        <input ref={inputRef} value={newText} onChange={e => setNewText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addTask(key)}
                                            placeholder="Task name..."
                                            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 8 }} />
                                        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                                            {Object.keys(priColors).map(p => (
                                                <button key={p} onClick={() => setNewPri(p)}
                                                    style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: newPri === p ? `${priColors[p]}25` : 'transparent', border: `1px solid ${newPri === p ? priColors[p] : 'rgba(255,255,255,0.08)'}`, color: priColors[p], fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => addTask(key)}
                                                style={{ flex: 1, padding: '7px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                                Add
                                            </button>
                                            <button onClick={() => { setAdding(null); setNewText(''); }}
                                                style={{ padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  FOCUS MODE (Pomodoro)                                  */
/* ═══════════════════════════════════════════════════════ */
function FocusMode() {
    const [mode, setMode] = useState('focus');      // focus | short | long
    const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    const [time, setTime] = useState(durations.focus);
    const [running, setRunning] = useState(false);
    const [sessions, setSessions] = useState(3);
    const timerRef = useRef(null);

    useEffect(() => {
        if (running && time > 0) {
            timerRef.current = setInterval(() => setTime(t => t - 1), 1000);
            return () => clearInterval(timerRef.current);
        }
        if (time === 0) { setRunning(false); if (mode === 'focus') setSessions(s => s + 1); }
        return () => clearInterval(timerRef.current);
    }, [running, time, mode]);

    const switchMode = (m) => { setMode(m); setTime(durations[m]); setRunning(false); };
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    const pct = ((durations[mode] - time) / durations[mode]) * 100;
    const r = 90; const circ = 2 * Math.PI * r;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                {/* Mode tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
                    {[['focus', '🎯 Focus'], ['short', '☕ Short Break'], ['long', '🌿 Long Break']].map(([m, l]) => (
                        <button key={m} onClick={() => switchMode(m)}
                            style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', background: mode === m ? 'rgba(124,58,237,0.15)' : 'transparent', border: mode === m ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', color: mode === m ? '#f0f0ff' : 'var(--text-3)' }}>
                            {l}
                        </button>
                    ))}
                </div>

                {/* Timer ring */}
                <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 28 }}>
                    <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                        <motion.circle cx="110" cy="110" r={r} fill="none"
                            stroke={mode === 'focus' ? 'url(#focusGrad)' : '#10b981'}
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={circ}
                            animate={{ strokeDashoffset: circ - (circ * pct / 100) }}
                            transition={{ duration: 0.5 }} />
                        <defs>
                            <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#00f5ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 48, fontWeight: 900, color: 'var(--text-1)', lineHeight: 1 }}>
                            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.1em' }}>{mode === 'focus' ? 'Deep Work' : 'Break'}</span>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setRunning(!running)}
                        style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        {running ? <FiPause size={22} color="white" /> : <FiPlay size={22} color="white" style={{ marginLeft: 2 }} />}
                    </motion.button>
                    <button onClick={() => switchMode(mode)}
                        style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', cursor: 'pointer', alignSelf: 'center' }}>
                        <FiRotateCcw size={16} />
                    </button>
                </div>
            </Card>

            {/* Side panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Session Stats</div>
                    {[['Sessions today', sessions, '#7c3aed'], ['Focus time', `${(sessions * 25)}m`, '#00f5ff'], ['Best streak', '6 sessions', '#f59e0b']].map(([l, v, c], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{l}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</span>
                        </div>
                    ))}
                </Card>
                <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,245,255,0.05))', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>🤖</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>AI Focus Tip</div>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
                        Your peak focus window is 9–11 AM. You're 34% more productive when starting deep work in this window. Try blocking distractions and working in 50-min sprints.
                    </p>
                </Card>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  QUICK NOTES                                            */
/* ═══════════════════════════════════════════════════════ */
function QuickNotes() {
    const [notes, setNotes] = useState(initialNotes);
    const [active, setActive] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');

    const addNote = () => {
        if (!newTitle.trim()) return;
        const colors = ['#7c3aed', '#00f5ff', '#f59e0b', '#ec4899', '#10b981'];
        const n = { id: `n${Date.now()}`, title: newTitle, body: newBody, ts: 'Just now', color: colors[notes.length % colors.length] };
        setNotes(ns => [n, ...ns]);
        setNewTitle(''); setNewBody(''); setActive(n.id);
    };

    const deleteNote = (id) => { setNotes(ns => ns.filter(n => n.id !== id)); if (active === id) setActive(null); };

    const activeNote = notes.find(n => n.id === active);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, minHeight: 420 }}>
            {/* Sidebar */}
            <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--app-border)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
                <button onClick={() => { setActive(null); setNewTitle(''); setNewBody(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
                    <FiPlus size={13} /> New Note
                </button>
                {notes.map(n => (
                    <div key={n.id} onClick={() => setActive(n.id)}
                        style={{ padding: '11px 12px', borderRadius: 10, background: active === n.id ? 'rgba(124,58,237,0.12)' : 'transparent', border: active === n.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, marginLeft: 13 }}>{n.ts}</div>
                    </div>
                ))}
            </div>

            {/* Editor */}
            <Card>
                {activeNote ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: activeNote.color }} />
                                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{activeNote.ts}</span>
                            </div>
                            <button onClick={() => deleteNote(activeNote.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><FiTrash2 size={14} /></button>
                        </div>
                        <input value={activeNote.title} onChange={e => setNotes(ns => ns.map(n => n.id === active ? { ...n, title: e.target.value } : n))}
                            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text-1)', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 14 }} />
                        <textarea value={activeNote.body} onChange={e => setNotes(ns => ns.map(n => n.id === active ? { ...n, body: e.target.value } : n))}
                            style={{ width: '100%', minHeight: 220, background: 'none', border: 'none', outline: 'none', color: 'var(--text-2)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.8, resize: 'vertical' }} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>✍️ New Note</span>
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title..."
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-1)', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                        <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Start typing..."
                            rows={8}
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-2)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.8, resize: 'vertical', outline: 'none' }} />
                        <button onClick={addNote}
                            style={{ alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiSave size={13} /> Save Note
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  HABIT TRACKER                                          */
/* ═══════════════════════════════════════════════════════ */
function HabitTracker() {
    const [habits, setHabits] = useState(initialHabits);

    const toggleDay = (hId, dIdx) => {
        setHabits(hs => hs.map(h => {
            if (h.id !== hId) return h;
            const w = [...h.weekDone];
            w[dIdx] = w[dIdx] ? 0 : 1;
            return { ...h, weekDone: w };
        }));
    };

    const totalToday = habits.reduce((s, h) => s + (h.weekDone[6] || 0), 0);
    const pct = Math.round((totalToday / habits.length) * 100);

    return (
        <div>
            {/* Header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '14px 18px', borderRadius: 14, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Today's Habits</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 10 }}>{totalToday}/{habits.length} completed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 80, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#7c3aed,#10b981)', transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{pct}%</span>
                </div>
            </div>

            {/* Habit grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {habits.map(h => (
                    <Card key={h.id} style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 24 }}>{h.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{h.name}</div>
                                <div style={{ fontSize: 11, color: h.color, fontWeight: 700, marginTop: 2 }}>🔥 {h.streak}-day streak</div>
                            </div>
                            {/* Week dots */}
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {DAYS.map((d, di) => (
                                    <div key={di} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                        <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{d}</span>
                                        <button onClick={() => toggleDay(h.id, di)}
                                            style={{ width: 22, height: 22, borderRadius: 6, background: h.weekDone[di] ? `${h.color}30` : 'rgba(255,255,255,0.04)', border: `1px solid ${h.weekDone[di] ? h.color : 'rgba(255,255,255,0.08)'}`, color: h.weekDone[di] ? h.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, transition: 'all 0.2s' }}>
                                            {h.weekDone[di] ? <FiCheck size={11} /> : ''}
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

/* ═══════════════════════════════════════════════════════ */
/*  AI PLANNER                                             */
/* ═══════════════════════════════════════════════════════ */
function AIPlanner() {
    const [goal, setGoal] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);

    const generatePlan = async () => {
        if (!goal.trim()) return;
        setLoading(true); setPlan('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `You are PriMaX Hub's AI Productivity Coach. The user wants to achieve: "${goal}".

Create a detailed, actionable productivity plan with:
1. A clear 30/60/90 day breakdown
2. Specific daily actions and habits to adopt
3. Key milestones and how to measure progress
4. Potential blockers and how to overcome them
5. A "Quick Win" they can do in the next 15 minutes

Format with clear headers, bullet points, and emojis. Be motivating, specific, and data-driven. Keep it under 400 words.`;

            const result = await model.generateContent(prompt);
            setPlan(result.response.text());
        } catch (err) {
            setPlan('⚠️ Could not generate plan. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Input */}
            <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>🧠</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Productivity Planner</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>
                    Describe a goal, project, or challenge — your AI coach will create a personalised action plan with milestones, habits, and daily actions.
                </p>
                <textarea value={goal} onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. Launch my SaaS product in 90 days while keeping fitness and mental health on track..."
                    rows={5}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={generatePlan} disabled={loading || !goal.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: goal.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !goal.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={14} /></motion.div> Generating...</> : <><FiZap size={14} /> Generate Plan</>}
                </motion.button>

                {/* Prompt ideas */}
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Try these:</span>
                    {['Prepare for a software engineering interview in 30 days', 'Build a consistent gym and nutrition habit', 'Write and publish my first book in 6 months'].map((s, i) => (
                        <button key={i} onClick={() => setGoal(s)}
                            style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            💡 {s}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Output */}
            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {plan ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your AI Plan</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{plan}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>🗺️</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6 }}>Your plan will appear here</div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Describe your goal and let AI build a clear path forward.</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
