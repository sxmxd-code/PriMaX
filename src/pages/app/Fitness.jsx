import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiPlus, FiTrash2, FiZap, FiRotateCcw, FiX } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { callGemini, SYSTEM_PROMPTS } from '../../lib/aiService';
import { HabitTracker } from './Productivity';

const Spinner = () => <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-flex' }}><FiRotateCcw size={13} /></motion.div>;
const Card = ({ children, style = {} }) => <div style={{ borderRadius: 16, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 20, ...style }}>{children}</div>;
const TABS = [
    { id: 'overview', label: 'Overview', icon: '🏋️' },
    { id: 'workouts', label: 'Workouts', icon: '💪' },
    { id: 'habits', label: 'Habits', icon: '🔁' },
    { id: 'ai', label: 'AI Coach', icon: '🤖' },
];
const WORKOUT_TYPES = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Running', 'Cycling', 'Swimming', 'Sports', 'Other'];

export default function Fitness() {
    const { user } = useAuth();
    const [tab, setTab] = useState('overview');
    return (
        <div className="page-shell">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiActivity size={10} /> Fitness</div>
                <h1 className="page-title">Fitness Hub</h1>
                <p className="page-desc">Log workouts, build habits, and get personalised coaching from your AI fitness partner.</p>
            </motion.div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', border: tab === t.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.id ? '#f0f0ff' : 'var(--text-3)', transition: 'all 0.2s' }}>{t.icon} {t.label}</button>)}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {tab === 'overview' && <FitnessOverview userId={user.id} />}
                    {tab === 'workouts' && <WorkoutLog userId={user.id} />}
                    {tab === 'habits' && <HabitTracker userId={user.id} module="fitness" />}
                    {tab === 'ai' && <AIFitnessCoach userId={user.id} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function FitnessOverview({ userId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const thisMonth = new Date(); thisMonth.setDate(1);
            const [wRes, hRes] = await Promise.all([
                supabase.from('workouts').select('*').eq('user_id', userId).gte('completed_at', thisMonth.toISOString().split('T')[0]),
                supabase.from('habits').select('completions,streak').eq('user_id', userId).eq('module', 'fitness'),
            ]);
            const workouts = wRes.data || [];
            const habits = hRes.data || [];
            const totalMins = workouts.reduce((s, w) => s + (w.duration_minutes || 0), 0);
            const maxStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0;
            const today = new Date().toISOString().split('T')[0];
            const todayDone = habits.filter(h => (h.completions || []).includes(today)).length;
            setData({ workoutCount: workouts.length, totalMins, maxStreak, todayHabits: todayDone, totalHabits: habits.length, recent: workouts.slice(0, 3) });
            setLoading(false);
        })();
    }, [userId]);
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    if (!data.workoutCount && !data.totalHabits) return (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.7 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🏋️</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Start your fitness journey</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Log your first workout or add fitness habits to get started.</div>
        </div>
    );
    const stats = [
        { label: 'Workouts This Month', value: data.workoutCount, color: '#7c3aed' },
        { label: 'Minutes Trained', value: data.totalMins, color: '#00f5ff' },
        { label: 'Top Habit Streak', value: `${data.maxStreak}d`, color: '#f59e0b' },
        { label: 'Habits Today', value: `${data.todayHabits}/${data.totalHabits}`, color: '#10b981' },
    ];
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRadius: 14, background: `${s.color}0c`, border: `1px solid ${s.color}20` }}>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>
            {data.recent.length > 0 && (
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>📋 Recent Workouts</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.recent.map(w => (
                            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💪</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{w.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{w.type} · {w.completed_at}</div>
                                </div>
                                {w.duration_minutes && <div style={{ fontSize: 13, color: '#00f5ff', fontWeight: 700 }}>{w.duration_minutes}min</div>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

function WorkoutLog({ userId }) {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'Strength', duration_minutes: '', notes: '', completed_at: new Date().toISOString().split('T')[0] });
    useEffect(() => {
        supabase.from('workouts').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(30)
            .then(({ data }) => { setWorkouts(data || []); setLoading(false); });
    }, [userId]);
    const addWorkout = async () => {
        if (!form.name.trim()) return;
        const { data, error } = await supabase.from('workouts').insert({ user_id: userId, ...form, duration_minutes: parseInt(form.duration_minutes) || null }).select().single();
        if (!error && data) setWorkouts(w => [data, ...w]);
        setForm({ name: '', type: 'Strength', duration_minutes: '', notes: '', completed_at: new Date().toISOString().split('T')[0] }); setAdding(false);
    };
    const del = async (id) => { await supabase.from('workouts').delete().eq('id', id); setWorkouts(ws => ws.filter(w => w.id !== id)); };
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    const inputStyle = { padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' };
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiPlus size={13} /> Log Workout</button>
                ) : (
                    <Card style={{ padding: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Workout name" autoFocus style={inputStyle} />
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                                {WORKOUT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                            <input value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} placeholder="Duration (mins)" type="number" style={inputStyle} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes (optional)" style={inputStyle} />
                            <input type="date" value={form.completed_at} onChange={e => setForm(f => ({ ...f, completed_at: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={addWorkout} style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>
            {!workouts.length ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>💪</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No workouts logged yet</div>
                    <button onClick={() => setAdding(true)} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Log Your First Workout</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {workouts.map(w => (
                        <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💪</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{w.name}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{w.type}</span>
                                    {w.duration_minutes && <span style={{ fontSize: 11, color: '#00f5ff', fontWeight: 600 }}>{w.duration_minutes} min</span>}
                                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{w.completed_at}</span>
                                </div>
                                {w.notes && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontStyle: 'italic' }}>{w.notes}</div>}
                            </div>
                            <button onClick={() => del(w.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><FiTrash2 size={13} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AIFitnessCoach({ userId }) {
    const [q, setQ] = useState('');
    const [res, setRes] = useState('');
    const [loading, setLoading] = useState(false);
    const generate = async () => {
        if (!q.trim()) return;
        setLoading(true); setRes('');
        const { data: recent } = await supabase.from('workouts').select('name,type,duration_minutes').eq('user_id', userId).order('completed_at', { ascending: false }).limit(5);
        const ctx = recent?.length ? `Recent workouts: ${recent.map(w => `${w.name} (${w.type}, ${w.duration_minutes}min)`).join(', ')}.` : 'No workout history yet.';
        const { text, error } = await callGemini(`${ctx}\n\nFitness question: "${q}"`, SYSTEM_PROMPTS.fitness);
        setRes(error ? `⚠️ ${error}` : text); setLoading(false);
    };
    const prompts = ['Create a 4-week beginner workout plan', 'How do I improve my running endurance?', 'Best exercises to build core strength', 'How many rest days should I take?'];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🏋️</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Fitness Coach</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 }}>Get tailored advice based on your workout history and goals.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Ask your AI coach..." rows={4} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading || !q.trim()} style={{ padding: '12px', width: '100%', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><Spinner /> Coaching...</> : <><FiZap /> Get Coaching</>}
                </motion.button>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {prompts.map((p, i) => <button key={i} onClick={() => setQ(p)} style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>💡 {p}</button>)}
                </div>
            </Card>
            <Card>
                {res ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>💪 Coaching Advice</div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{res}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 44, marginBottom: 14 }}>🏃</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your coaching advice will appear here</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
