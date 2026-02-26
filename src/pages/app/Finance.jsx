import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const stats = [
    { label: 'Net Worth', value: '$42K', color: '#10b981' },
    { label: 'Monthly Savings', value: '$1.2K', color: '#7c3aed' },
    { label: 'Investments', value: '$18K', color: '#00f5ff' },
    { label: 'Debt Remaining', value: '$6.4K', color: '#f59e0b' },
];

const transactions = [
    { name: 'Salary Deposit', amount: '+$4,800', type: 'income', date: 'Feb 25' },
    { name: 'Rent Payment', amount: '-$1,200', type: 'expense', date: 'Feb 24' },
    { name: 'ETF Investment', amount: '-$500', type: 'invest', date: 'Feb 23' },
    { name: 'Freelance Client', amount: '+$850', type: 'income', date: 'Feb 22' },
];

export default function Finance() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiDollarSign size={10} /> Finance</div>
                <h1 className="page-title">Financial Intelligence</h1>
                <p className="page-desc">AI-driven wealth building, spending analysis, and investment tracking for financial freedom.</p>
            </div>
            <div className="stat-grid">
                {stats.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, #7c3aed)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 18 }}>📋 Recent Transactions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {transactions.map((t, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === 'income' ? 'rgba(16,185,129,0.15)' : t.type === 'invest' ? 'rgba(124,58,237,0.15)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {t.type === 'income' ? <FiTrendingUp size={15} style={{ color: '#10b981' }} /> : <FiTrendingDown size={15} style={{ color: t.type === 'invest' ? '#7c3aed' : '#f87171' }} />}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{t.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.date}</div>
                                </div>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 15, color: t.type === 'income' ? '#10b981' : t.type === 'invest' ? '#7c3aed' : '#f87171' }}>{t.amount}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
            <div className="coming-soon-card">
                <span className="coming-soon-icon">💰</span>
                <div className="coming-soon-title">AI Finance Engine — Coming Soon</div>
                <p className="coming-soon-desc">Automated budgeting, investment suggestions, and AI-powered wealth forecasting.</p>
            </div>
        </div>
    );
}
