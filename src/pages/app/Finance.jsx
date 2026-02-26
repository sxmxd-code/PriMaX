import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiPlus, FiTrash2, FiTrendingUp, FiTrendingDown,
    FiTarget, FiClock, FiArrowUp, FiArrowDown, FiCheckCircle,
    FiX, FiZap, FiRotateCcw, FiBarChart2, FiCreditCard,
    FiPieChart, FiCalendar, FiAlertCircle, FiChevronRight,
    FiEdit3, FiRepeat, FiShield,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

/* ─── Tabs ────────────────────────────────────────────── */
const TABS = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 size={14} /> },
    { id: 'txn', label: 'Transactions', icon: <FiCreditCard size={14} /> },
    { id: 'budget', label: 'Budgets', icon: <FiPieChart size={14} /> },
    { id: 'savings', label: 'Savings Goals', icon: <FiTarget size={14} /> },
    { id: 'subs', label: 'Subscriptions', icon: <FiRepeat size={14} /> },
    { id: 'ai', label: 'AI Advisor', icon: <FiZap size={14} /> },
];

/* ─── Data ────────────────────────────────────────────── */
const initTxns = [
    { id: 1, desc: 'Salary — TechCo', amount: 8500, type: 'income', cat: 'Salary', date: 'Feb 25', icon: '💼' },
    { id: 2, desc: 'Rent payment', amount: -1800, type: 'expense', cat: 'Housing', date: 'Feb 24', icon: '🏠' },
    { id: 3, desc: 'AWS certification exam', amount: -300, type: 'expense', cat: 'Education', date: 'Feb 22', icon: '📚' },
    { id: 4, desc: 'Freelance — Logo design', amount: 450, type: 'income', cat: 'Freelance', date: 'Feb 20', icon: '🎨' },
    { id: 5, desc: 'Grocery — Whole Foods', amount: -185, type: 'expense', cat: 'Food', date: 'Feb 19', icon: '🛒' },
    { id: 6, desc: 'Gym membership', amount: -49, type: 'expense', cat: 'Health', date: 'Feb 18', icon: '💪' },
    { id: 7, desc: 'Uber rides', amount: -62, type: 'expense', cat: 'Transport', date: 'Feb 17', icon: '🚗' },
    { id: 8, desc: 'Side project revenue', amount: 320, type: 'income', cat: 'Business', date: 'Feb 15', icon: '💻' },
    { id: 9, desc: 'Electric bill', amount: -95, type: 'expense', cat: 'Utilities', date: 'Feb 14', icon: '⚡' },
    { id: 10, desc: 'Restaurant dinner', amount: -78, type: 'expense', cat: 'Food', date: 'Feb 13', icon: '🍽️' },
];

const initBudgets = [
    { id: 'b1', name: 'Housing', limit: 2000, spent: 1800, color: '#7c3aed', icon: '🏠' },
    { id: 'b2', name: 'Food', limit: 600, spent: 263, color: '#10b981', icon: '🛒' },
    { id: 'b3', name: 'Transport', limit: 300, spent: 62, color: '#00f5ff', icon: '🚗' },
    { id: 'b4', name: 'Education', limit: 500, spent: 300, color: '#f59e0b', icon: '📚' },
    { id: 'b5', name: 'Health', limit: 200, spent: 49, color: '#ec4899', icon: '💪' },
    { id: 'b6', name: 'Entertainment', limit: 250, spent: 78, color: '#f97316', icon: '🎬' },
];

const initGoals = [
    { id: 'g1', name: 'Emergency Fund', target: 15000, saved: 11200, color: '#10b981', icon: '🛡️', deadline: 'Jun 2026' },
    { id: 'g2', name: 'New MacBook Pro', target: 3500, saved: 2100, color: '#7c3aed', icon: '💻', deadline: 'Apr 2026' },
    { id: 'g3', name: 'Vacation — Japan', target: 5000, saved: 1800, color: '#00f5ff', icon: '✈️', deadline: 'Sep 2026' },
    { id: 'g4', name: 'Investment Fund', target: 25000, saved: 8400, color: '#f59e0b', icon: '📈', deadline: 'Dec 2026' },
];

const initSubs = [
    { id: 's1', name: 'AWS', cost: 45, cycle: 'Monthly', nextBill: 'Mar 1', status: 'active', color: '#f59e0b', icon: '☁️' },
    { id: 's2', name: 'Spotify', cost: 9.99, cycle: 'Monthly', nextBill: 'Mar 5', status: 'active', color: '#10b981', icon: '🎵' },
    { id: 's3', name: 'ChatGPT Plus', cost: 20, cycle: 'Monthly', nextBill: 'Mar 8', status: 'active', color: '#7c3aed', icon: '🤖' },
    { id: 's4', name: 'Netflix', cost: 15.49, cycle: 'Monthly', nextBill: 'Mar 12', status: 'active', color: '#ef4444', icon: '🎬' },
    { id: 's5', name: 'GitHub Pro', cost: 4, cycle: 'Monthly', nextBill: 'Mar 15', status: 'active', color: '#5a5a80', icon: '🐙' },
    { id: 's6', name: 'Figma', cost: 12, cycle: 'Monthly', nextBill: 'Mar 20', status: 'paused', color: '#ec4899', icon: '🎨' },
    { id: 's7', name: 'Domain renewal', cost: 14, cycle: 'Yearly', nextBill: 'Nov 2026', status: 'active', color: '#00f5ff', icon: '🌐' },
];

const monthlySpend = [3200, 2800, 3500, 2950, 3100, 2650, 2800];
const monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

/* ─── Helpers ──────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });
const fmt = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtD = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ═══════════════════════════════════════════════════════ */
/*  MAIN                                                   */
/* ═══════════════════════════════════════════════════════ */
export default function Finance() {
    const [tab, setTab] = useState('overview');

    const stats = [
        { label: 'Net Income', value: '$6,701', delta: '+12% vs Jan', color: '#10b981', icon: <FiTrendingUp /> },
        { label: 'Total Expenses', value: '$2,569', delta: '-8% vs Jan', color: '#ef4444', icon: <FiTrendingDown /> },
        { label: 'Savings Rate', value: '28%', delta: 'Best in 6mo', color: '#7c3aed', icon: <FiShield /> },
        { label: 'Financial Score', value: '82', delta: '+5 pts', color: '#00f5ff', icon: <FiBarChart2 /> },
    ];

    return (
        <div className="page-shell">
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiDollarSign size={10} /> Finance</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Financial Command Center</h1>
                <p className="page-desc">Track, plan, and grow your wealth with AI-powered financial intelligence.</p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRadius: 14, background: `${s.color}0c`, border: `1px solid ${s.color}20` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span>
                            <span style={{ fontSize: 10, color: s.label.includes('Expense') ? '#ef4444' : '#10b981', fontWeight: 700, background: s.label.includes('Expense') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: 100 }}>{s.delta}</span>
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
                    {tab === 'overview' && <Overview />}
                    {tab === 'txn' && <Transactions />}
                    {tab === 'budget' && <Budgets />}
                    {tab === 'savings' && <SavingsGoals />}
                    {tab === 'subs' && <Subscriptions />}
                    {tab === 'ai' && <AIAdvisor />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  OVERVIEW DASHBOARD                                     */
/* ═══════════════════════════════════════════════════════ */
function Overview() {
    const income = initTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = Math.abs(initTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    const saved = income - expenses;
    const totalGoalSaved = initGoals.reduce((s, g) => s + g.saved, 0);
    const totalGoalTarget = initGoals.reduce((s, g) => s + g.target, 0);
    const maxBar = Math.max(...monthlySpend);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Left: Cash flow + Spending chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Cash flow */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💰 February Cash Flow</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        {[['Income', income, '#10b981', <FiArrowUp />], ['Expenses', expenses, '#ef4444', <FiArrowDown />], ['Saved', saved, '#7c3aed', <FiShield />]].map(([l, v, c, ic], i) => (
                            <div key={i} style={{ padding: '14px', borderRadius: 14, background: `${c}0c`, border: `1px solid ${c}20`, textAlign: 'center' }}>
                                <div style={{ color: c, marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{ic}</div>
                                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 18, fontWeight: 900, color: c }}>{fmt(v)}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                    {/* Savings rate bar */}
                    <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Savings Rate</span>
                            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>{Math.round((saved / income) * 100)}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(saved / income) * 100}%` }}
                                transition={{ duration: 1 }} style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#10b981,#00f5ff)' }} />
                        </div>
                    </div>
                </Card>

                {/* Monthly spend trend */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📉 Monthly Spending Trend</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
                        {monthlySpend.map((v, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 9, color: i === 6 ? '#00f5ff' : 'var(--text-3)', fontWeight: 700 }}>{fmt(v)}</span>
                                <div style={{ width: '100%', height: 70, display: 'flex', alignItems: 'flex-end', borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${(v / maxBar) * 70}px` }}
                                        transition={{ duration: 0.8, delay: 0.1 + i * 0.06 }}
                                        style={{ width: '100%', borderRadius: 6, background: i === 6 ? 'linear-gradient(to top,#7c3aed,#00f5ff)' : 'rgba(124,58,237,0.2)' }} />
                                </div>
                                <span style={{ fontSize: 10, color: i === 6 ? '#00f5ff' : 'var(--text-3)', fontWeight: i === 6 ? 700 : 400 }}>{monthLabels[i]}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right: Budget health + Goals + AI insight */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Top budgets */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Budget Health</div>
                    {initBudgets.slice(0, 4).map((b, i) => {
                        const pct = Math.round((b.spent / b.limit) * 100);
                        return (
                            <div key={i} style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>{b.icon} {b.name}</span>
                                    <span style={{ fontSize: 11, color: pct > 90 ? '#ef4444' : 'var(--text-3)' }}>{fmt(b.spent)} / {fmt(b.limit)}</span>
                                </div>
                                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                                        transition={{ duration: 1, delay: i * 0.08 }}
                                        style={{ height: '100%', borderRadius: 3, background: pct > 90 ? '#ef4444' : `linear-gradient(90deg, ${b.color}, ${b.color}88)` }} />
                                </div>
                            </div>
                        );
                    })}
                </Card>

                {/* Goal progress */}
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎯 Savings Goals</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {initGoals.map((g, i) => {
                            const pct = Math.round((g.saved / g.target) * 100);
                            return (
                                <div key={i} style={{ padding: '14px', borderRadius: 14, background: `${g.color}08`, border: `1px solid ${g.color}20` }}>
                                    <div style={{ fontSize: 18, marginBottom: 6 }}>{g.icon}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{g.name}</div>
                                    <div style={{ fontSize: 11, color: g.color, fontWeight: 700 }}>{fmt(g.saved)} / {fmt(g.target)}</div>
                                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', marginTop: 8 }}>
                                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: g.color, transition: 'width 0.6s' }} />
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{pct}% · {g.deadline}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* AI Insight */}
                <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', marginBottom: 4 }}>AI INSIGHT</div>
                            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                                Your savings rate of <strong style={{ color: '#10b981' }}>28%</strong> is at a 6-month high. Redirecting <strong style={{ color: '#f59e0b' }}>$300</strong> to your Investment Fund goal now could compound to <strong style={{ color: '#7c3aed' }}>$4,200</strong> by year-end.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  TRANSACTIONS                                           */
/* ═══════════════════════════════════════════════════════ */
function Transactions() {
    const [txns, setTxns] = useState(initTxns);
    const [filter, setFilter] = useState('all');
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ desc: '', amount: '', type: 'expense', cat: '' });

    const addTxn = () => {
        if (!form.desc.trim() || !form.amount) return;
        const amt = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
        setTxns(t => [{ id: Date.now(), desc: form.desc, amount: amt, type: form.type, cat: form.cat || 'Other', date: 'Today', icon: form.type === 'income' ? '💰' : '💳' }, ...t]);
        setForm({ desc: '', amount: '', type: 'expense', cat: '' }); setAdding(false);
    };

    const filtered = filter === 'all' ? txns : txns.filter(t => t.type === filter);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                    {['all', 'income', 'expense'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: filter === f ? 'rgba(124,58,237,0.15)' : 'transparent', border: filter === f ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)', color: filter === f ? '#f0f0ff' : 'var(--text-3)', textTransform: 'capitalize' }}>{f}</button>
                    ))}
                </div>
                {!adding && (
                    <button onClick={() => setAdding(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <FiPlus size={12} /> Add Transaction
                    </button>
                )}
            </div>

            {/* Add form */}
            {adding && (
                <Card style={{ marginBottom: 14, padding: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <input value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Description"
                            style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                        <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Amount" type="number"
                            style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                            style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                            <option value="expense">Expense</option><option value="income">Income</option>
                        </select>
                        <input value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} placeholder="Category"
                            style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={addTxn} style={{ padding: '8px 22px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Add</button>
                        <button onClick={() => setAdding(false)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiX size={12} /></button>
                    </div>
                </Card>
            )}

            {/* Transaction list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.map(t => (
                    <motion.div key={t.id} layout whileHover={{ x: 3 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: 'var(--app-surface)', border: '1px solid var(--app-border)', cursor: 'default', transition: 'all 0.2s' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: t.amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{t.cat} · {t.date}</div>
                        </div>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, fontWeight: 800, color: t.amount > 0 ? '#10b981' : '#ef4444' }}>
                            {t.amount > 0 ? '+' : ''}{fmt(t.amount)}
                        </span>
                        <button onClick={() => setTxns(ts => ts.filter(x => x.id !== t.id))}
                            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', opacity: 0.5 }}><FiTrash2 size={12} /></button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  BUDGETS                                                */
/* ═══════════════════════════════════════════════════════ */
function Budgets() {
    const totalLimit = initBudgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = initBudgets.reduce((s, b) => s + b.spent, 0);

    return (
        <div>
            {/* Summary bar */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '16px 20px', borderRadius: 16, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Total Budget</div>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: '#7c3aed' }}>{fmt(totalLimit)}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Spent So Far</div>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: '#ef4444' }}>{fmt(totalSpent)}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Remaining</div>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: '#10b981' }}>{fmt(totalLimit - totalSpent)}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Utilisation</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{Math.round((totalSpent / totalLimit) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                        <div style={{ width: `${(totalSpent / totalLimit) * 100}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#10b981,#f59e0b)', transition: 'width 0.6s' }} />
                    </div>
                </div>
            </div>

            {/* Budget cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                {initBudgets.map((b, i) => {
                    const pct = Math.round((b.spent / b.limit) * 100);
                    const rem = b.limit - b.spent;
                    const danger = pct > 85;
                    return (
                        <motion.div key={b.id} {...fadeUp(i * 0.05)}>
                            <Card style={{ padding: '18px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{b.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{b.name}</div>
                                            <div style={{ fontSize: 11, color: danger ? '#ef4444' : 'var(--text-3)' }}>{danger ? '⚠️ Near limit' : `${fmt(rem)} left`}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 16, fontWeight: 900, color: danger ? '#ef4444' : b.color }}>{pct}%</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Spent: {fmt(b.spent)}</span>
                                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Limit: {fmt(b.limit)}</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                                        transition={{ duration: 1, delay: i * 0.08 }}
                                        style={{ height: '100%', borderRadius: 3, background: danger ? '#ef4444' : `linear-gradient(90deg, ${b.color}, ${b.color}88)` }} />
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  SAVINGS GOALS                                          */
/* ═══════════════════════════════════════════════════════ */
function SavingsGoals() {
    const [goals, setGoals] = useState(initGoals);
    const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
    const totalTarget = goals.reduce((s, g) => s + g.target, 0);

    return (
        <div>
            {/* Totals */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '18px 20px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 24, fontWeight: 900, color: '#10b981' }}>{fmt(totalSaved)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Total Saved</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 24, fontWeight: 900, color: '#7c3aed' }}>{fmt(totalTarget)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Total Target</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 24, fontWeight: 900, color: '#00f5ff' }}>{Math.round((totalSaved / totalTarget) * 100)}%</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Overall Progress</div>
                </div>
            </div>

            {/* Goal cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {goals.map((g, i) => {
                    const pct = Math.round((g.saved / g.target) * 100);
                    const r = 42; const circ = 2 * Math.PI * r;
                    return (
                        <motion.div key={g.id} {...fadeUp(i * 0.06)}>
                            <Card style={{ padding: '22px' }}>
                                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                                    {/* Ring */}
                                    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
                                        <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                                            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                                            <motion.circle cx="48" cy="48" r={r} fill="none" stroke={g.color} strokeWidth="7"
                                                strokeLinecap="round" strokeDasharray={circ}
                                                initial={{ strokeDashoffset: circ }}
                                                animate={{ strokeDashoffset: circ - (circ * pct / 100) }}
                                                transition={{ duration: 1.2, delay: 0.2 + i * 0.08 }} />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: 24 }}>{g.icon}</span>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{g.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>🗓 {g.deadline}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: g.color }}>{fmt(g.saved)}</span>
                                            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>of {fmt(g.target)}</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                                                style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }} />
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{pct}% complete · {fmt(g.target - g.saved)} to go</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  SUBSCRIPTIONS                                          */
/* ═══════════════════════════════════════════════════════ */
function Subscriptions() {
    const [subs, setSubs] = useState(initSubs);
    const activeSubs = subs.filter(s => s.status === 'active');
    const monthlyTotal = activeSubs.filter(s => s.cycle === 'Monthly').reduce((s, x) => s + x.cost, 0);
    const yearlyTotal = monthlyTotal * 12 + subs.filter(s => s.cycle === 'Yearly' && s.status === 'active').reduce((s, x) => s + x.cost, 0);

    const toggleStatus = (id) => setSubs(ss => ss.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));

    return (
        <div>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[['Monthly Cost', fmtD(monthlyTotal), '#7c3aed'], ['Yearly Cost', fmtD(yearlyTotal), '#f59e0b'], ['Active', `${activeSubs.length}/${subs.length}`, '#10b981']].map(([l, v, c], i) => (
                    <div key={i} style={{ padding: '16px', borderRadius: 14, background: `${c}0c`, border: `1px solid ${c}20`, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: c }}>{v}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{l}</div>
                    </div>
                ))}
            </div>

            {/* Sub list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subs.map(s => (
                    <Card key={s.id} style={{ padding: '14px 18px', opacity: s.status === 'paused' ? 0.55 : 1, transition: 'opacity 0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{s.name}</span>
                                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 100, background: s.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: s.status === 'active' ? '#10b981' : '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>{s.status}</span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.cycle} · Next: {s.nextBill}</div>
                            </div>
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 16, fontWeight: 900, color: s.color, marginRight: 12 }}>{fmtD(s.cost)}</div>
                            <button onClick={() => toggleStatus(s.id)}
                                style={{ fontSize: 10, padding: '5px 12px', borderRadius: 8, background: s.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${s.status === 'active' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`, color: s.status === 'active' ? '#f59e0b' : '#10b981', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                {s.status === 'active' ? 'Pause' : 'Resume'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  AI ADVISOR                                             */
/* ═══════════════════════════════════════════════════════ */
function AIAdvisor() {
    const [question, setQuestion] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    const ask = async () => {
        if (!question.trim()) return;
        setLoading(true); setAdvice('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(`You are PriMaX Hub's elite AI Financial Advisor — trained on personal finance, investing, and wealth-building strategies. The user asks: "${question}"

Context: They earn ~$9,300/mo, spend ~$2,600/mo, have a 28% savings rate, and are building an emergency fund + investment portfolio.

Provide:
1. Clear analysis of their situation
2. Actionable steps with specific numbers
3. Risk assessment
4. A "Quick Win" they can do today

Use headers, bullets, emojis. Be specific and data-driven. Keep under 350 words.`);
            setAdvice(result.response.text());
        } catch { setAdvice('⚠️ Could not generate advice. Try again.'); }
        setLoading(false);
    };

    const prompts = [
        'How should I allocate my savings between emergency fund and investments?',
        'Analyse my subscription spending — what should I cut?',
        'Build a plan to reach $50K net worth by end of year',
        'Should I invest in index funds or individual stocks?',
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>💰</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Financial Advisor</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>Ask anything about budgeting, investing, debt, or wealth-building. Get personalised advice based on your financial profile.</p>
                <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What financial question do you have?" rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={ask} disabled={loading || !question.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: question.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !question.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Analysing...</> : <><FiZap size={14} /> Get Advice</>}
                </motion.button>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular questions:</span>
                    {prompts.map((p, i) => (
                        <button key={i} onClick={() => setQuestion(p)}
                            style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>💡 {p}</button>
                    ))}
                </div>
            </Card>
            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {advice ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financial Strategy</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{advice}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>📊</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your financial advice will appear here</div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Ask anything about money, investing, or budgeting.</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
