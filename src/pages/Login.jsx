import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import '../app.css';

export default function Login() {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        const { error: err } = await signIn(form.email, form.password);
        setLoading(false);
        if (err) { setError(err.message); return; }
        navigate('/app');
    };

    const handleGoogle = async () => {
        setLoading(true);
        await signInWithGoogle();
        setLoading(false);
    };

    // DEV bypass — navigate directly
    const devBypass = () => navigate('/app');

    return (
        <div className="auth-page">
            {/* Decorative orbs */}
            <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#7c3aed', filter: 'blur(100px)', opacity: 0.1, top: '-10%', left: '-10%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#00f5ff', filter: 'blur(100px)', opacity: 0.07, bottom: '-10%', right: '-5%', pointerEvents: 'none' }} />

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">⚡</div>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 18, fontWeight: 700, color: '#f0f0ff' }}>
                        PriMaX<span style={{ color: '#00f5ff' }}>Hub</span>
                    </span>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue your growth journey</p>

                {/* Google OAuth */}
                <button className="btn-google" onClick={handleGoogle} disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="divider">or sign in with email</div>

                {/* Error */}
                {error && (
                    <motion.div className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 16 }}>
                        <FiAlertCircle size={14} /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#5a5a80' }} />
                            <input
                                className="form-input"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                style={{ paddingLeft: 40 }}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <a href="#" style={{ fontSize: 12, color: '#00f5ff', textDecoration: 'none' }}>Forgot password?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#5a5a80' }} />
                            <input
                                className="form-input"
                                name="password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                style={{ paddingLeft: 40, paddingRight: 44 }}
                                autoComplete="current-password"
                            />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a5a80', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button className="btn-auth" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Dev bypass */}
                <button onClick={devBypass} style={{ width: '100%', marginTop: 10, padding: '10px', borderRadius: 10, background: 'rgba(0,245,255,0.06)', border: '1px dashed rgba(0,245,255,0.2)', color: '#00f5ff', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                    🔧 Dev Mode — Enter App (Skip Auth)
                </button>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Create one free</Link>
                </p>
            </motion.div>
        </div>
    );
}
