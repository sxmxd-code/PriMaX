import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckSquare, FiPlus, FiTrash2, FiZap, FiRotateCcw, FiTarget, FiX, FiClock } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { callGemini, SYSTEM_PROMPTS } from '../../lib/aiService';

const COLS = [
    { id: 'todo', label: 'To Do', color: '#5a5a80' },
    { id: 'inprogress', label: 'In Progress', color: '#7c3aed' },
    { id: 'done', label: 'Done', color: '#10b981' },
];
const PRIORITIES = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 16, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 18, ...style }}>{children}</div>
);
const Spinner = () => (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-flex' }}>
        <FiRotateCcw size={13} />
    </motion.div>
);
const EmptyCol = ({ onAdd }) => (
    <div style={{ padding: '24px 14px', textAlign: 'center', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.07)', color: 'var(--text-3)', fontSize: 12 }}>Empty</div>
);

const TABS = [
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'focus', label: 'Focus', icon: '⏱️' },
    { id: 'habits', label: 'Habits', icon: '🔁' },
    { id: 'ai', label: 'AI Plan', icon: '🤖' },
];

export default function Productivity() {
    const { user } = useAuth();
    const [tab, setTab] = useState('tasks');
    return (
        <div className="page-shell">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiCheckSquare size={10} /> Productivity</div>
                <h1 className="page-title">Productivity Workspace</h1>
                <p className="page-desc">Organise tasks, track habits, enter deep work, and let AI plan your day.</p>
            </motion.div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', border: tab === t.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.id ? '#f0f0ff' : 'var(--text-3)', transition: 'all 0.2s' }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {tab === 'tasks' && <KanbanBoard userId={user.id} />}
                    {tab === 'focus' && <FocusTimer />}
                    {tab === 'habits' && <HabitTracker userId={user.id} module="productivity" />}
                    {tab === 'ai' && <AIPlanner userId={user.id} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function KanbanBoard({ userId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ title: '', priority: 'medium', due_date: '' });

    useEffect(() => {
        supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false })
            .then(({ data }) => { setTasks(data || []); setLoading(false); });
    }, [userId]);

    const addTask = async () => {
        if (!form.title.trim()) return;
        const { data, error } = await supabase.from('tasks').insert({ user_id: userId, ...form, status: 'todo' }).select().single();
        if (!error && data) setTasks(t => [data, ...t]);
        setForm({ title: '', priority: 'medium', due_date: '' }); setAdding(false);
    };

    const moveTask = async (id, status) => {
        await supabase.from('tasks').update({ status }).eq('id', id);
        setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t));
    };

    const deleteTask = async (id) => {
        await supabase.from('tasks').delete().eq('id', id);
        setTasks(ts => ts.filter(t => t.id !== id));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <FiPlus size={13} /> Add Task
                    </button>
                ) : (
                    <Card style={{ padding: 16 }}>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="What needs to be done?" autoFocus
                            style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                            </select>
                            <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', colorScheme: 'dark' }} />
                            <button onClick={addTask} style={{ padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Add</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>
            {!tasks.length && !adding && (
                <div style={{ textAlign: 'center', padding: '50px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Your workspace is clear</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Add your first task to get started.</div>
                    <button onClick={() => setAdding(true)} style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Add a Task</button>
                </div>
            )}
            {tasks.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    {COLS.map(col => {
                        const colTasks = tasks.filter(t => t.status === col.id);
                        return (
                            <div key={col.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{col.label}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 100 }}>{colTasks.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 80 }}>
                                    {colTasks.length === 0 && <EmptyCol />}
                                    {colTasks.map(t => (
                                        <motion.div key={t.id} layout>
                                            <div style={{ padding: '14px', borderRadius: 12, background: 'var(--app-surface)', border: '1px solid var(--app-border)', borderLeft: `3px solid ${PRIORITIES[t.priority] || '#5a5a80'}` }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: t.status === 'done' ? 'var(--text-3)' : 'var(--text-1)', textDecoration: t.status === 'done' ? 'line-through' : 'none', marginBottom: 8 }}>{t.title}</div>
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: `${PRIORITIES[t.priority]}15`, color: PRIORITIES[t.priority], fontWeight: 700, textTransform: 'uppercase' }}>{t.priority}</span>
                                                    {t.due_date && <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><FiClock size={9} />{t.due_date}</span>}
                                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                                                        {COLS.filter(c => c.id !== col.id).slice(0, 1).map(c => (
                                                            <button key={c.id} onClick={() => moveTask(t.id, c.id)} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{c.label}</button>
                                                        ))}
                                                        <button onClick={() => deleteTask(t.id)} style={{ padding: '2px 4px', borderRadius: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer' }}><FiTrash2 size={9} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function FocusTimer() {
    const MODES = [{ label: 'Focus', mins: 25 }, { label: 'Short Break', mins: 5 }, { label: 'Long Break', mins: 15 }];
    const [modeIdx, setModeIdx] = useState(0);
    const [secs, setSecs] = useState(MODES[0].mins * 60);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (running) intervalRef.current = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; } return s - 1; }), 1000);
        else clearInterval(intervalRef.current);
        return () => clearInterval(intervalRef.current);
    }, [running]);
    const selectMode = (i) => { setModeIdx(i); setSecs(MODES[i].mins * 60); setRunning(false); };
    const mins = String(Math.floor(secs / 60)).padStart(2, '0');
    const sec = String(secs % 60).padStart(2, '0');
    const pct = secs / (MODES[modeIdx].mins * 60);
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ maxWidth: 380, width: '100%', textAlign: 'center', padding: '40px 30px' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                    {MODES.map((m, i) => <button key={i} onClick={() => selectMode(i)} style={{ padding: '7px 15px', borderRadius: 100, background: modeIdx === i ? 'rgba(124,58,237,0.15)' : 'transparent', border: modeIdx === i ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)', color: modeIdx === i ? '#f0f0ff' : 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{m.label}</button>)}
                </div>
                <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 28px' }}>
                    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
                        <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <motion.circle cx="90" cy="90" r="80" fill="none" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 * (1 - pct)} transition={{ duration: 0.5 }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 38, fontWeight: 900, color: '#f0f0ff' }}>{mins}:{sec}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{MODES[modeIdx].label}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setRunning(r => !r)} style={{ padding: '14px 36px', borderRadius: 14, background: running ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        {running ? '⏸ Pause' : '▶ Start'}
                    </motion.button>
                    <button onClick={() => { setSecs(MODES[modeIdx].mins * 60); setRunning(false); }} style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiRotateCcw size={16} /></button>
                </div>
            </Card>
        </div>
    );
}

export function HabitTracker({ userId, module = 'productivity' }) {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newHabit, setNewHabit] = useState('');
    const today = new Date().toISOString().split('T')[0];
    useEffect(() => {
        supabase.from('habits').select('*').eq('user_id', userId).eq('module', module).order('created_at')
            .then(({ data }) => { setHabits(data || []); setLoading(false); });
    }, [userId, module]);
    const addHabit = async () => {
        if (!newHabit.trim()) return;
        const { data, error } = await supabase.from('habits').insert({ user_id: userId, name: newHabit.trim(), module }).select().single();
        if (!error && data) setHabits(h => [...h, data]);
        setNewHabit('');
    };
    const toggleHabit = async (habit) => {
        const isChecked = (habit.completions || []).includes(today);
        const newCompletions = isChecked ? habit.completions.filter(d => d !== today) : [...(habit.completions || []), today];
        const sorted = [...newCompletions].sort((a, b) => new Date(b) - new Date(a));
        let streak = 0; let d = new Date();
        for (const ds of sorted) { const diff = Math.round((d - new Date(ds)) / 86400000); if (diff > 1) break; streak++; d = new Date(ds); }
        await supabase.from('habits').update({ completions: newCompletions, streak }).eq('id', habit.id);
        setHabits(hs => hs.map(h => h.id === habit.id ? { ...h, completions: newCompletions, streak } : h));
    };
    const deleteHabit = async (id) => {
        await supabase.from('habits').delete().eq('id', id);
        setHabits(hs => hs.filter(h => h.id !== id));
    };
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} placeholder="Add a new habit..."
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                <button onClick={addHabit} style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiPlus /></button>
            </div>
            {!habits.length ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔁</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>No habits tracked yet</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Build consistency with daily habits.</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {habits.map(h => {
                        const done = (h.completions || []).includes(today);
                        return (
                            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: done ? 'rgba(16,185,129,0.06)' : 'var(--app-surface)', border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'var(--app-border)'}`, transition: 'all 0.2s' }}>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleHabit(h)} style={{ width: 28, height: 28, borderRadius: 8, background: done ? '#10b981' : 'rgba(255,255,255,0.05)', border: `2px solid ${done ? '#10b981' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                    {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><FiTarget size={12} color="white" /></motion.div>}
                                </motion.button>
                                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: done ? 'var(--text-2)' : 'var(--text-1)', textDecoration: done ? 'line-through' : 'none' }}>{h.name}</span>
                                {h.streak > 0 && <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>🔥 {h.streak}d</span>}
                                <button onClick={() => deleteHabit(h.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}><FiTrash2 size={12} /></button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AIPlanner({ userId }) {
    const [q, setQ] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const generate = async () => {
        if (!q.trim()) return;
        setLoading(true); setPlan('');
        const { data: tasks } = await supabase.from('tasks').select('title,priority,status').eq('user_id', userId).neq('status', 'done').limit(10);
        const ctx = tasks?.length ? `Open tasks: ${tasks.map(t => `"${t.title}" (${t.priority})`).join(', ')}.` : 'No open tasks.';
        const { text, error } = await callGemini(`${ctx}\n\nUser: "${q}"`, SYSTEM_PROMPTS.productivity);
        setPlan(error ? `⚠️ ${error}` : text); setLoading(false);
    };
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🤖</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Daily Planner</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 }}>Tell me what you want to accomplish. I'll use your real open tasks as context.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Plan a focused day to finish my API..." rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading || !q.trim()}
                    style={{ padding: '12px', width: '100%', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><Spinner /> Planning...</> : <><FiZap /> Plan My Day</>}
                </motion.button>
            </Card>
            <Card>
                {plan ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>⚡ Your Plan</div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{plan}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 44, marginBottom: 14 }}>📅</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your plan will appear here</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
