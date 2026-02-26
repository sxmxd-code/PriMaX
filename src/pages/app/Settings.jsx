import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUser, FiBell, FiShield, FiMonitor, FiSave, FiCheck } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <FiMonitor size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={14} /> },
    { id: 'security', label: 'Security', icon: <FiShield size={14} /> },
];

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const userName = user?.user_metadata?.full_name || 'Growth Pioneer';
    const userEmail = user?.email || 'dev@primaxhub.ai';

    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-tag"><FiSettings size={10} /> Settings</div>
                <h1 className="page-title">Settings</h1>
                <p className="page-desc">Customize your PriMaX Hub experience, manage your account, and configure integrations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                {/* Tab sidebar */}
                <div style={{ padding: 16, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)', height: 'fit-content' }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, width: '100%', background: activeTab === t.id ? 'rgba(124,58,237,0.15)' : 'transparent', border: activeTab === t.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent', color: activeTab === t.id ? '#f0f0ff' : 'var(--text-2)', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 4, textAlign: 'left', transition: 'all 0.2s' }}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
                    style={{ padding: 28, borderRadius: 20, background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                    {activeTab === 'profile' && (
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Profile Settings</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', borderRadius: 16, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                                    {userName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>{userName}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{userEmail}</div>
                                    <button style={{ marginTop: 10, padding: '7px 14px', borderRadius: 8, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        Change avatar
                                    </button>
                                </div>
                            </div>
                            {[['Full Name', userName, 'text'], ['Email Address', userEmail, 'email'], ['Username', '@growthpioneer', 'text'], ['Bio', 'Building my best self with AI', 'text']].map(([label, val, type], i) => (
                                <div key={i} className="form-group">
                                    <label className="form-label">{label}</label>
                                    <input className="form-input" type={type} defaultValue={val} />
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'appearance' && (
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Appearance</h3>
                            <div style={{ marginBottom: 24 }}>
                                <div className="form-label">Theme</div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                    {[{ label: '🌙 Dark', val: 'dark' }, { label: '☀️ Light', val: 'light' }].map(opt => (
                                        <button key={opt.val} onClick={() => theme !== opt.val && toggleTheme()}
                                            style={{ flex: 1, padding: '14px', borderRadius: 12, background: theme === opt.val ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${theme === opt.val ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`, color: 'var(--text-1)', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="form-label">Accent Color</div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                    {['#7c3aed', '#00f5ff', '#ec4899', '#10b981', '#f59e0b', '#f97316'].map(c => (
                                        <button key={c} style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.15)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notifications' && (
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Notification Preferences</h3>
                            {[
                                ['Daily AI Briefing', 'Morning digest of insights and priorities', true],
                                ['Goal Milestones', 'Celebrate when you hit key milestones', true],
                                ['Habit Reminders', 'Timely nudges for your daily habits', true],
                                ['Streak Alerts', 'Warnings when your streak is at risk', true],
                                ['Weekly Reports', 'Sunday summary of your growth progress', false],
                                ['AI Coach Insights', 'When your coach has new analysis', true],
                            ].map(([title, desc, defaultOn], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--app-border)' }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{desc}</div>
                                    </div>
                                    <div style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, background: defaultOn ? 'linear-gradient(135deg, #7c3aed, #00f5ff)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', flexShrink: 0 }}>
                                        <div style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: defaultOn ? 23 : 3 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Security & Privacy</h3>
                            <div style={{ padding: '20px', borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                                <FiShield size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>Your account is secure. Last login: Today at 2:33 PM</span>
                            </div>
                            {[['Change Password', 'Update your account password'], ['Two-Factor Authentication', 'Add an extra layer of security'], ['Connected Apps', 'Manage OAuth connections'], ['Export My Data', 'Download all your growth data'], ['Delete Account', 'Permanently remove your account']].map(([label, desc], i) => (
                                <button key={i} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--app-border)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: i === 4 ? '#f87171' : 'var(--text-1)', textAlign: 'left' }}>{label}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, textAlign: 'left' }}>{desc}</div>
                                    </div>
                                    <span style={{ color: 'var(--text-3)', fontSize: 18 }}>›</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Save button */}
                    {activeTab !== 'security' && (
                        <div style={{ marginTop: 28, borderTop: '1px solid var(--app-border)', paddingTop: 20 }}>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
                                style={{ padding: '12px 28px', borderRadius: 12, background: saved ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #00f5ff)', border: 'none', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.3s' }}>
                                {saved ? <><FiCheck size={15} /> Saved!</> : <><FiSave size={15} /> Save Changes</>}
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
