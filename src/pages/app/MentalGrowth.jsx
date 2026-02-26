import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSun, FiPlus, FiTrash2, FiEdit3, FiSave, FiZap, FiRotateCcw,
    FiHeart, FiBarChart2, FiBookOpen, FiSmile, FiStar, FiTarget,
    FiClock, FiTrendingUp, FiX,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TABS = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 size={14} /> },
    { id: 'journal', label: 'Journal', icon: <FiBookOpen size={14} /> },
    { id: 'mood', label: 'Mood Tracker', icon: <FiSmile size={14} /> },
    { id: 'gratitude', label: 'Gratitude', icon: <FiHeart size={14} /> },
    { id: 'ai', label: 'AI Guide', icon: <FiZap size={14} /> },
];

const moods = [
    { emoji: '😁', label: 'Amazing', value: 5, color: '#10b981' },
    { emoji: '🙂', label: 'Good', value: 4, color: '#00f5ff' },
    { emoji: '😐', label: 'Neutral', value: 3, color: '#f59e0b' },
    { emoji: '😔', label: 'Low', value: 2, color: '#f97316' },
    { emoji: '😢', label: 'Tough', value: 1, color: '#ef4444' },
];

const initMoodLog = [
    { date: 'Feb 26', mood: 4, note: 'Productive morning, good workout' },
    { date: 'Feb 25', mood: 5, note: 'Shipped big feature, feeling great' },
    { date: 'Feb 24', mood: 3, note: 'Bit stressed about deadline' },
    { date: 'Feb 23', mood: 4, note: 'Nice walk, read for an hour' },
    { date: 'Feb 22', mood: 2, note: 'Poor sleep, low energy' },
    { date: 'Feb 21', mood: 4, note: 'Great focus session' },
    { date: 'Feb 20', mood: 5, note: 'Team celebration, feeling motivated' },
];

const initJournals = [
    { id: 'j1', title: 'Reflections on Growth Mindset', body: 'Today I caught myself in a fixed mindset pattern — avoiding a challenging task because I feared failure. I reframed it: "I\'m not failing, I\'m collecting data." This shift helped me tackle the API refactor I\'d been avoiding for weeks.\n\nKey insight: discomfort is the compass pointing toward growth.', date: 'Feb 26', mood: '🧠', color: '#7c3aed' },
    { id: 'j2', title: 'Morning Pages — Clarity Session', body: 'Woke up with racing thoughts about the project timeline. Writing them down helped separate real concerns from imagined ones.\n\nReal: need to finish auth by Friday\nImagined: everything will fall apart\n\nAction: blocked 2h deep work today for auth.', date: 'Feb 25', mood: '☀️', color: '#f59e0b' },
    { id: 'j3', title: 'What I Learned This Week', body: '1. Consistency > intensity — small daily efforts compound\n2. Saying no is a superpower — declined 2 meetings that weren\'t essential\n3. Sleep is non-negotiable — my best work days follow 7.5h+ sleep\n4. Gratitude practice genuinely shifts perspective', date: 'Feb 23', mood: '📚', color: '#00f5ff' },
];

const initGratitude = [
    { id: 'gr1', items: ['My health and energy today', 'The mentorship from my lead', 'A quiet morning with coffee'], date: 'Feb 26' },
    { id: 'gr2', items: ['Shipped a feature I\'m proud of', 'A great conversation with a friend', 'The sunset on my evening walk'], date: 'Feb 25' },
    { id: 'gr3', items: ['Access to learning resources', 'My consistent workout streak', 'Supportive team at work'], date: 'Feb 24' },
];

const practices = [
    { name: 'Journaling', icon: '📝', streak: 31, done: true, color: '#7c3aed' },
    { name: 'Meditation', icon: '🧘', streak: 8, done: true, color: '#00f5ff' },
    { name: 'Gratitude', icon: '🙏', streak: 23, done: true, color: '#f59e0b' },
    { name: 'Reading', icon: '📖', streak: 15, done: false, color: '#10b981' },
    { name: 'Digital Detox', icon: '📵', streak: 5, done: false, color: '#ec4899' },
    { name: 'Breathwork', icon: '🌬️', streak: 12, done: false, color: '#f97316' },
];

const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function MentalGrowth() {
    const [tab, setTab] = useState('overview');
    const stats = [
        { label: 'Mindset Score', value: '88', delta: '+5 pts', color: '#7c3aed', icon: <FiSun /> },
        { label: 'Journal Streak', value: '31d', delta: 'Personal best!', color: '#f59e0b', icon: <FiBookOpen /> },
        { label: 'Avg Mood', value: '4.1', delta: '↑ 0.3 this week', color: '#10b981', icon: <FiSmile /> },
        { label: 'Practices', value: '3/6', delta: '50% today', color: '#ec4899', icon: <FiHeart /> },
    ];

    return (
        <div className="page-shell">
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiSun size={10} /> Mental Growth</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Mental Growth Studio</h1>
                <p className="page-desc">Cultivate clarity, resilience, and inner strength — your AI-powered mindset laboratory.</p>
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
                    {tab === 'overview' && <MentalOverview />}
                    {tab === 'journal' && <Journal />}
                    {tab === 'mood' && <MoodTracker />}
                    {tab === 'gratitude' && <Gratitude />}
                    {tab === 'ai' && <AIGuide />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function MentalOverview() {
    const avgMood = (initMoodLog.reduce((s, m) => s + m.mood, 0) / initMoodLog.length).toFixed(1);
    const moodInfo = moods.find(m => m.value === Math.round(parseFloat(avgMood)));
    const donePractices = practices.filter(p => p.done).length;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Mood trend */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>😊 7-Day Mood Trend</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80, marginBottom: 12 }}>
                        {initMoodLog.slice().reverse().map((m, i) => {
                            const moodData = moods.find(x => x.value === m.mood);
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 16 }}>{moodData?.emoji}</span>
                                    <div style={{ width: '100%', height: 50, display: 'flex', alignItems: 'flex-end', borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                                        <motion.div initial={{ height: 0 }} animate={{ height: `${(m.mood / 5) * 50}px` }}
                                            transition={{ duration: 0.8, delay: i * 0.06 }}
                                            style={{ width: '100%', borderRadius: 6, background: moodData?.color || '#7c3aed' }} />
                                    </div>
                                    <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{m.date.split(' ')[1]}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: `${moodInfo?.color}10`, border: `1px solid ${moodInfo?.color}25`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Weekly average</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: moodInfo?.color }}>{moodInfo?.emoji} {avgMood} — {moodInfo?.label}</span>
                    </div>
                </Card>

                {/* Daily practices */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✨ Today's Practices — {donePractices}/{practices.length}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {practices.map((p, i) => (
                            <div key={i} style={{ padding: '12px', borderRadius: 12, background: p.done ? `${p.color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${p.done ? p.color + '30' : 'rgba(255,255,255,0.06)'}`, textAlign: 'center', transition: 'all 0.2s' }}>
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: p.done ? p.color : 'var(--text-2)' }}>{p.name}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>🔥 {p.streak}d</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Recent journal */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📝 Latest Journal</div>
                    <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{initJournals[0].title}</div>
                        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{initJournals[0].body}</p>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>{initJournals[0].date}</div>
                    </div>
                </Card>

                {/* Gratitude today */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🙏 Today's Gratitude</div>
                    {initGratitude[0].items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <span style={{ fontSize: 14 }}>💛</span>
                            <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{item}</span>
                        </div>
                    ))}
                </Card>

                {/* AI insight */}
                <Card style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(124,58,237,0.06))', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 28 }}>🧠</span>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', marginBottom: 4 }}>AI INSIGHT</div>
                            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>Your mood dips correlate with days you skip meditation. On meditation days, your average mood is <strong style={{ color: '#10b981' }}>4.3 vs 2.8</strong>. A 5-minute breathwork session before work could stabilise your baseline mood.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Journal() {
    const [entries, setEntries] = useState(initJournals);
    const [active, setActive] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const colors = ['#7c3aed', '#00f5ff', '#f59e0b', '#ec4899', '#10b981', '#f97316'];
    const moodIcons = ['🧠', '☀️', '📚', '🌙', '💡', '🔥'];

    const addEntry = () => {
        if (!newTitle.trim()) return;
        const e = { id: `j${Date.now()}`, title: newTitle, body: newBody, date: 'Today', mood: moodIcons[entries.length % moodIcons.length], color: colors[entries.length % colors.length] };
        setEntries(es => [e, ...es]); setActive(e.id); setNewTitle(''); setNewBody('');
    };

    const activeEntry = entries.find(e => e.id === active);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, minHeight: 420 }}>
            <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--app-border)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
                <button onClick={() => { setActive(null); setNewTitle(''); setNewBody(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
                    <FiPlus size={13} /> New Entry
                </button>
                {entries.map(e => (
                    <div key={e.id} onClick={() => setActive(e.id)}
                        style={{ padding: '11px 12px', borderRadius: 10, background: active === e.id ? 'rgba(124,58,237,0.12)' : 'transparent', border: active === e.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ fontSize: 14 }}>{e.mood}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, marginLeft: 21 }}>{e.date}</div>
                    </div>
                ))}
            </div>

            <Card>
                {activeEntry ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 18 }}>{activeEntry.mood}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{activeEntry.date}</span>
                            </div>
                            <button onClick={() => { setEntries(es => es.filter(e => e.id !== active)); setActive(null); }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><FiTrash2 size={14} /></button>
                        </div>
                        <input value={activeEntry.title} onChange={e => setEntries(es => es.map(en => en.id === active ? { ...en, title: e.target.value } : en))}
                            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text-1)', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 14 }} />
                        <textarea value={activeEntry.body} onChange={e => setEntries(es => es.map(en => en.id === active ? { ...en, body: e.target.value } : en))}
                            style={{ width: '100%', minHeight: 250, background: 'none', border: 'none', outline: 'none', color: 'var(--text-2)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.8, resize: 'vertical' }} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>✍️ New Journal Entry</span>
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title your reflection..."
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-1)', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                        <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write freely — thoughts, reflections, lessons learned..."
                            rows={8} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-2)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.8, resize: 'vertical', outline: 'none' }} />
                        <button onClick={addEntry}
                            style={{ alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#f97316)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiSave size={13} /> Save Entry
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}

function MoodTracker() {
    const [log, setLog] = useState(initMoodLog);
    const [selMood, setSelMood] = useState(null);
    const [note, setNote] = useState('');

    const logMood = () => {
        if (selMood === null) return;
        setLog(l => [{ date: 'Today', mood: selMood, note }, ...l]);
        setSelMood(null); setNote('');
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Log mood */}
            <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06),rgba(249,115,22,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How are you feeling right now?</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                    {moods.map(m => (
                        <motion.button key={m.value} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => setSelMood(m.value)}
                            style={{ width: 56, height: 56, borderRadius: 16, background: selMood === m.value ? `${m.color}25` : 'rgba(255,255,255,0.04)', border: `2px solid ${selMood === m.value ? m.color : 'rgba(255,255,255,0.08)'}`, fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: selMood === m.value ? `0 0 16px ${m.color}40` : 'none' }}>
                            {m.emoji}
                        </motion.button>
                    ))}
                </div>
                {selMood && <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: moods.find(m => m.value === selMood)?.color, marginBottom: 14 }}>{moods.find(m => m.value === selMood)?.label}</div>}
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What's on your mind? (optional)"
                    rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '10px 14px', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'none', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={logMood} disabled={!selMood}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#f97316)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: selMood ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', opacity: selMood ? 1 : 0.5 }}>
                    Log Mood
                </motion.button>
            </Card>

            {/* Mood history */}
            <Card>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📋 Mood History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {log.map((entry, i) => {
                        const moodData = moods.find(m => m.value === entry.mood);
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: `${moodData?.color}08`, border: `1px solid ${moodData?.color}15` }}>
                                <span style={{ fontSize: 22 }}>{moodData?.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: moodData?.color }}>{moodData?.label}</div>
                                    {entry.note && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{entry.note}</div>}
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{entry.date}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

function Gratitude() {
    const [entries, setEntries] = useState(initGratitude);
    const [items, setItems] = useState(['', '', '']);

    const save = () => {
        const filled = items.filter(i => i.trim());
        if (filled.length === 0) return;
        setEntries(es => [{ id: `gr${Date.now()}`, items: filled, date: 'Today' }, ...es]);
        setItems(['', '', '']);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(249,115,22,0.04))', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>🙏</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>Daily Gratitude</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 18 }}>Name 3 things you're grateful for today. This simple practice is shown to increase happiness by 25% over 10 weeks.</p>
                {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 16 }}>💛</span>
                        <input value={item} onChange={e => setItems(its => its.map((it, idx) => idx === i ? e.target.value : it))}
                            placeholder={`Gratitude ${i + 1}...`}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    </div>
                ))}
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={save}
                    style={{ width: '100%', padding: '12px', marginTop: 8, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#f97316)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <FiSave size={13} style={{ marginRight: 6 }} /> Save Gratitude
                </motion.button>
            </Card>

            <Card>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📖 Gratitude Journal</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {entries.map(e => (
                        <div key={e.id} style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, fontWeight: 600 }}>{e.date}</div>
                            {e.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
                                    <span style={{ fontSize: 12 }}>💛</span>
                                    <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function AIGuide() {
    const [q, setQ] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const ask = async () => {
        if (!q.trim()) return;
        setLoading(true); setAdvice('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(`You are PriMaX Hub's AI Mindset Coach — trained on psychology, neuroscience, meditation, stoic philosophy, and personal development. The user asks: "${q}"\n\nContext: They journal daily (31-day streak), meditate, practice gratitude, and have an avg mood of 4.1/5.\n\nProvide:\n1. Empathetic and thoughtful analysis\n2. Specific practices or exercises\n3. Science-backed reasoning\n4. A "Try Right Now" micro-practice (under 5 minutes)\n\nBe warm, wise, and grounding. Use headers, bullets, emojis. Keep under 350 words.`);
            setAdvice(result.response.text());
        } catch { setAdvice('⚠️ Could not connect. Try again.'); }
        setLoading(false);
    };
    const prompts = ['Help me build unshakeable mental resilience', 'How to handle imposter syndrome as an engineer', 'Design a morning mindfulness routine for focus', 'How to process and release negative emotions'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(124,58,237,0.06))', border: '1px solid rgba(249,115,22,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>🧠</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Mindset Guide</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>Ask about mindfulness, emotional intelligence, resilience, or any aspect of inner development. Grounded in psychology and neuroscience.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="What's on your mind?" rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={ask} disabled={loading || !q.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#f97316,#7c3aed)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Reflecting...</> : <><FiZap size={14} /> Get Guidance</>}
                </motion.button>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Explore:</span>
                    {prompts.map((p, i) => (
                        <button key={i} onClick={() => setQ(p)} style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>🧘 {p}</button>
                    ))}
                </div>
            </Card>
            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {advice ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#f97316,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧠</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mindset Guidance</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{advice}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>🌱</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your guidance will appear here</div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>A safe space for growth and reflection.</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
