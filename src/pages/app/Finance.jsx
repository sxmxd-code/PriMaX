import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiPlus, FiTrash2, FiZap, FiRotateCcw, FiX } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { callGemini, SYSTEM_PROMPTS } from '../../lib/aiService';

const Spinner = () => <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-flex' }}><FiRotateCcw size={13} /></motion.div>;
const Card = ({ children, style = {} }) => <div style={{ borderRadius: 16, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 20, ...style }}>{children}</div>;
const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'budgets', label: 'Budget', icon: '🎯' },
    { id: 'savings', label: 'Savings Goals', icon: '🏦' },
    { id: 'ai', label: 'AI Advice', icon: '🤖' },
];
const CATEGORIES = ['Food & Drink', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other'];
const CAT_COLORS = { 'Food & Drink': '#f59e0b', 'Transport': '#00f5ff', 'Housing': '#7c3aed', 'Entertainment': '#ec4899', 'Health': '#10b981', 'Shopping': '#f97316', 'Utilities': '#6366f1', 'Other': '#64748b' };

export default function Finance() {
    const { user } = useAuth();
    const [tab, setTab] = useState('overview');
    return (
        <div className="page-shell">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiDollarSign size={10} /> Finance</div>
                <h1 className="page-title">Financial Dashboard</h1>
                <p className="page-desc">Track income, spending, and savings. Get AI-powered financial insights.</p>
            </motion.div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', border: tab === t.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.id ? '#f0f0ff' : 'var(--text-3)', transition: 'all 0.2s' }}>{t.icon} {t.label}</button>)}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {tab === 'overview' && <FinanceOverview userId={user.id} />}
                    {tab === 'transactions' && <Transactions userId={user.id} />}
                    {tab === 'budgets' && <Budgets userId={user.id} />}
                    {tab === 'savings' && <SavingsGoals userId={user.id} />}
                    {tab === 'ai' && <AIFinanceAdvisor userId={user.id} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function FinanceOverview({ userId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const [txRes, goalRes] = await Promise.all([
                supabase.from('transactions').select('amount,type,category').eq('user_id', userId),
                supabase.from('savings_goals').select('*').eq('user_id', userId),
            ]);
            const txs = txRes.data || [];
            const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
            const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
            setData({ income, expense, net: income - expense, goals: goalRes.data || [], txCount: txs.length });
            setLoading(false);
        })();
    }, [userId]);
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    if (!data.txCount && !data.goals.length) return (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.7 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>💰</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Your financial dashboard is empty</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Add your first transaction or savings goal to get started.</div>
        </div>
    );
    const stats = [
        { label: 'Total Income', value: `$${data.income.toFixed(0)}`, color: '#10b981' },
        { label: 'Total Expenses', value: `$${data.expense.toFixed(0)}`, color: '#ef4444' },
        { label: 'Net Balance', value: `$${data.net.toFixed(0)}`, color: data.net >= 0 ? '#00f5ff' : '#f59e0b' },
        { label: 'Savings Goals', value: data.goals.length, color: '#7c3aed' },
    ];
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRadius: 14, background: `${s.color}0c`, border: `1px solid ${s.color}20` }}>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>
            {data.goals.length > 0 && (
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>🏦 Savings Goals</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {data.goals.map(g => {
                            const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
                            return (
                                <div key={g.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{g.icon} {g.name}</span>
                                        <span style={{ fontSize: 13, color: g.color, fontWeight: 700 }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${g.color},${g.color}88)` }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>${Number(g.current_amount).toFixed(0)} of ${Number(g.target_amount).toFixed(0)}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
}

function Transactions({ userId }) {
    const [txs, setTxs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ description: '', amount: '', type: 'expense', category: 'Other', date: new Date().toISOString().split('T')[0] });
    useEffect(() => {
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(50)
            .then(({ data }) => { setTxs(data || []); setLoading(false); });
    }, [userId]);
    const addTx = async () => {
        if (!form.description.trim() || !form.amount) return;
        const { data, error } = await supabase.from('transactions').insert({ user_id: userId, ...form, amount: parseFloat(form.amount) }).select().single();
        if (!error && data) setTxs(t => [data, ...t]);
        setForm({ description: '', amount: '', type: 'expense', category: 'Other', date: new Date().toISOString().split('T')[0] }); setAdding(false);
    };
    const delTx = async (id) => { await supabase.from('transactions').delete().eq('id', id); setTxs(ts => ts.filter(t => t.id !== id)); };
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    const inputStyle = { padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' };
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <FiPlus size={13} /> Add Transaction
                    </button>
                ) : (
                    <Card style={{ padding: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" style={inputStyle} />
                            <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Amount" type="number" style={inputStyle} />
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                                <option value="expense">Expense</option><option value="income">Income</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={addTx} style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>
            {!txs.length ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>💳</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No transactions yet</div>
                    <button onClick={() => setAdding(true)} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Record Your First Transaction</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {txs.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CAT_COLORS[t.category] || '#5a5a80'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{t.type === 'income' ? '📈' : '📉'}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{t.description}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.category} · {t.date}</div>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444' }}>{t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}</div>
                            <button onClick={() => delTx(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}><FiTrash2 size={13} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Budgets({ userId }) {
    const [budgets, setBudgets] = useState([]);
    const [spending, setSpending] = useState({});
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ category: 'Food & Drink', limit_amount: '' });
    useEffect(() => {
        (async () => {
            const now = new Date(); const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            const [bRes, tRes] = await Promise.all([
                supabase.from('budgets').select('*').eq('user_id', userId),
                supabase.from('transactions').select('amount,category').eq('user_id', userId).eq('type', 'expense').gte('date', firstDay),
            ]);
            const sp = {};
            (tRes.data || []).forEach(t => { sp[t.category] = (sp[t.category] || 0) + Number(t.amount); });
            setBudgets(bRes.data || []); setSpending(sp); setLoading(false);
        })();
    }, [userId]);
    const addBudget = async () => {
        if (!form.limit_amount) return;
        const color = CAT_COLORS[form.category] || '#7c3aed';
        const { data, error } = await supabase.from('budgets').insert({ user_id: userId, ...form, limit_amount: parseFloat(form.limit_amount), color }).select().single();
        if (!error && data) setBudgets(b => [...b, data]);
        setForm({ category: 'Food & Drink', limit_amount: '' }); setAdding(false);
    };
    const delBudget = async (id) => { await supabase.from('budgets').delete().eq('id', id); setBudgets(bs => bs.filter(b => b.id !== id)); };
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiPlus size={13} /> Add Budget Limit</button>
                ) : (
                    <Card style={{ padding: 16 }}>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ flex: 1, padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input value={form.limit_amount} onChange={e => setForm(f => ({ ...f, limit_amount: e.target.value }))} placeholder="Monthly limit $" type="number" style={{ flex: 1, padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={addBudget} style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>
            {!budgets.length ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🎯</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No budget limits set</div>
                    <button onClick={() => setAdding(true)} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Set Your First Budget</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {budgets.map(b => {
                        const spent = spending[b.category] || 0;
                        const pct = Math.min(100, Math.round((spent / Number(b.limit_amount)) * 100));
                        const over = pct >= 100;
                        return (
                            <Card key={b.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{b.category}</div><div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>${spent.toFixed(0)} / ${Number(b.limit_amount).toFixed(0)} spent this month</div></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: over ? '#ef4444' : b.color }}>{pct}%</span>
                                        <button onClick={() => delBudget(b.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><FiTrash2 size={13} /></button>
                                    </div>
                                </div>
                                <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 4, background: over ? '#ef4444' : `linear-gradient(90deg,${b.color},${b.color}88)` }} />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SavingsGoals({ userId }) {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deposit, setDeposit] = useState({});
    const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', icon: '🎯', target_date: '' });
    const ICONS = ['🎯', '🏠', '✈️', '💻', '🎓', '🚗', '💍', '🏋️'];
    useEffect(() => {
        supabase.from('savings_goals').select('*').eq('user_id', userId).order('created_at')
            .then(({ data }) => { setGoals(data || []); setLoading(false); });
    }, [userId]);
    const addGoal = async () => {
        if (!form.name.trim() || !form.target_amount) return;
        const { data, error } = await supabase.from('savings_goals').insert({ user_id: userId, ...form, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount || 0), color: '#10b981' }).select().single();
        if (!error && data) setGoals(g => [...g, data]);
        setForm({ name: '', target_amount: '', current_amount: '0', icon: '🎯', target_date: '' }); setAdding(false);
    };
    const addDeposit = async (goal) => {
        const amt = parseFloat(deposit[goal.id] || 0);
        if (!amt) return;
        const newAmt = Math.min(Number(goal.target_amount), Number(goal.current_amount) + amt);
        await supabase.from('savings_goals').update({ current_amount: newAmt }).eq('id', goal.id);
        setGoals(gs => gs.map(g => g.id === goal.id ? { ...g, current_amount: newAmt } : g));
        setDeposit(d => ({ ...d, [goal.id]: '' }));
    };
    const delGoal = async (id) => { await supabase.from('savings_goals').delete().eq('id', id); setGoals(gs => gs.filter(g => g.id !== id)); };
    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spinner /></div>;
    const inputStyle = { padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' };
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiPlus size={13} /> New Savings Goal</button>
                ) : (
                    <Card style={{ padding: 16 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                            {ICONS.map(i => <button key={i} onClick={() => setForm(f => ({ ...f, icon: i }))} style={{ width: 36, height: 36, borderRadius: 8, background: form.icon === i ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', border: form.icon === i ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--app-border)', cursor: 'pointer', fontSize: 18 }}>{i}</button>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Goal name" style={inputStyle} />
                            <input value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} placeholder="Target $" type="number" style={inputStyle} />
                            <input value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))} placeholder="Already saved $" type="number" style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={addGoal} style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>
            {!goals.length ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', opacity: 0.7 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🏦</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No savings goals yet</div>
                    <button onClick={() => setAdding(true)} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Create a Goal</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                    {goals.map(g => {
                        const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
                        return (
                            <Card key={g.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{g.icon}</div>
                                        <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{g.name}</div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Target: ${Number(g.target_amount).toFixed(0)}</div></div>
                                    </div>
                                    <button onClick={() => delGoal(g.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', alignSelf: 'flex-start' }}><FiTrash2 size={13} /></button>
                                </div>
                                <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 6 }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#10b981,#00f5ff)' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
                                    <span>${Number(g.current_amount).toFixed(0)} saved</span><span style={{ color: '#10b981', fontWeight: 700 }}>{pct}%</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input value={deposit[g.id] || ''} onChange={e => setDeposit(d => ({ ...d, [g.id]: e.target.value }))} placeholder="Add $" type="number" style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                                    <button onClick={() => addDeposit(g)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Add</button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AIFinanceAdvisor({ userId }) {
    const [q, setQ] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const generate = async () => {
        if (!q.trim()) return;
        setLoading(true); setAdvice('');
        const { data: txs } = await supabase.from('transactions').select('amount,type,category').eq('user_id', userId).limit(20);
        const income = (txs || []).filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
        const expense = (txs || []).filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
        const ctx = txs?.length ? `Financial snapshot: $${income.toFixed(0)} income, $${expense.toFixed(0)} expenses, net $${(income - expense).toFixed(0)}.` : 'No transaction data yet.';
        const { text, error } = await callGemini(`${ctx}\n\nQuestion: "${q}"`, SYSTEM_PROMPTS.finance);
        setAdvice(error ? `⚠️ ${error}` : text); setLoading(false);
    };
    const prompts = ['How should I build an emergency fund?', 'Help me create a savings plan', 'Am I spending too much?', 'Best ways to reduce monthly expenses'];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
                <div style={{ fontSize: 28, marginBottom: 12 }}>💰</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Financial Advisor</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 }}>Get personalised financial advice based on your real spending and savings data.</p>
                <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Ask a financial question..." rows={4} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading || !q.trim()} style={{ padding: '12px', width: '100%', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: q.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading || !q.trim() ? 0.6 : 1 }}>
                    {loading ? <><Spinner /> Analysing...</> : <><FiZap /> Get Advice</>}
                </motion.button>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {prompts.map((p, i) => <button key={i} onClick={() => setQ(p)} style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>💡 {p}</button>)}
                </div>
            </Card>
            <Card>
                {advice ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🤖 Financial Advice</div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{advice}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 44, marginBottom: 14 }}>📊</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your advice will appear here</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
