import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiSearch, FiBell, FiSun, FiMoon, FiUser,
    FiSettings, FiLogOut, FiHelpCircle, FiCommand,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../app.css';

const notifications = [
    { id: 1, icon: '🎯', title: 'Goal milestone reached!', desc: 'You completed 75% of "Launch Startup"', time: '2m ago', color: '#7c3aed', unread: true },
    { id: 2, icon: '🔥', title: '47-day streak!', desc: 'Keep going — you\'re on fire', time: '1h ago', color: '#f59e0b', unread: true },
    { id: 3, icon: '🤖', title: 'AI Coach insight ready', desc: 'New analysis of your week available', time: '3h ago', color: '#00f5ff', unread: true },
    { id: 4, icon: '📈', title: 'Weekly report is in', desc: 'Your growth score increased by 24 pts', time: 'Yesterday', color: '#10b981', unread: false },
];

const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.12 } },
};

export default function TopBar({ collapsed }) {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifs, setNotifs] = useState(notifications);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Click outside to close
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const unreadCount = notifs.filter(n => n.unread).length;
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Growth Pioneer';
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const userEmail = user?.email || 'dev@primaxhub.ai';

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className={`topbar${collapsed ? ' collapsed' : ''}`}>
            {/* Search / Command */}
            <div className="search-bar">
                <FiSearch size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                <input placeholder="Search anything or press ⌘K..." />
                <span className="search-shortcut">⌘K</span>
            </div>

            {/* Actions */}
            <div className="topbar-actions">
                {/* Theme toggle */}
                <motion.button
                    className="icon-btn"
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={theme}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>

                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <motion.button
                        className="icon-btn"
                        onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Notifications"
                    >
                        <FiBell size={17} />
                        {unreadCount > 0 && <span className="notif-badge" />}
                    </motion.button>

                    <AnimatePresence>
                        {showNotif && (
                            <motion.div className="notif-panel" variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="notif-header">
                                    <h4>Notifications {unreadCount > 0 && <span style={{ color: '#ec4899', fontSize: 13 }}>({unreadCount})</span>}</h4>
                                    <button className="notif-clear" onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>
                                        Mark all read
                                    </button>
                                </div>
                                {notifs.map((n) => (
                                    <div key={n.id} className="notif-item" onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${n.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                                {n.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{n.title}</span>
                                                    {n.unread && <div className="notif-dot" style={{ background: n.color }} />}
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-2)', margin: '2px 0 4px', lineHeight: 1.5 }}>{n.desc}</p>
                                                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{n.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                                    <button style={{ fontSize: 13, color: '#00f5ff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                        View all notifications →
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: 'var(--app-border)' }} />

                {/* User avatar / profile */}
                <div ref={profileRef} style={{ position: 'relative' }}>
                    <motion.button
                        className="avatar-btn"
                        onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        title="Profile menu"
                    >
                        {userInitials}
                    </motion.button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div className="dropdown" style={{ minWidth: 240 }} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="dropdown-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                                            {userInitials}
                                        </div>
                                        <div>
                                            <div className="dropdown-name">{userName}</div>
                                            <div className="dropdown-email">{userEmail}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 10px', borderRadius: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                        <span style={{ fontSize: 12 }}>🔥</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>47-day streak</span>
                                        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>Pro Plan</span>
                                    </div>
                                </div>

                                <button className="dropdown-item" onClick={() => { navigate('/app/settings'); setShowProfile(false); }}>
                                    <FiUser size={15} /> My Profile
                                </button>
                                <button className="dropdown-item" onClick={() => { navigate('/app/settings'); setShowProfile(false); }}>
                                    <FiSettings size={15} /> Settings
                                </button>
                                <button className="dropdown-item">
                                    <FiCommand size={15} /> Keyboard Shortcuts
                                </button>
                                <button className="dropdown-item">
                                    <FiHelpCircle size={15} /> Help & Feedback
                                </button>
                                <div className="dropdown-separator" />
                                <button className="dropdown-item danger" onClick={handleSignOut}>
                                    <FiLogOut size={15} /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
