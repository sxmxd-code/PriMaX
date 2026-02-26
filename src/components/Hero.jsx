import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiPlay, FiZap } from 'react-icons/fi';
import ParticleBackground from './ParticleBackground';

const floatingBadges = [
    { icon: '🧠', label: 'AI-Powered Growth', x: '8%', y: '25%', delay: 0 },
    { icon: '📈', label: '+340% Productivity', x: '75%', y: '18%', delay: 0.4 },
    { icon: '✨', label: '10M+ Goals Achieved', x: '80%', y: '68%', delay: 0.8 },
    { icon: '🎯', label: '98% Success Rate', x: '6%', y: '70%', delay: 0.6 },
];

export default function Hero() {
    const ref = useRef(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 600], [0, -120]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <section
            ref={ref}
            id="hero"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--gradient-hero)',
            }}
        >
            {/* Particle Background */}
            <ParticleBackground />

            {/* Glow Orbs */}
            <div className="glow-orb" style={{ width: 600, height: 600, background: '#7c3aed', top: '-10%', left: '-15%', opacity: 0.12 }} />
            <div className="glow-orb" style={{ width: 500, height: 500, background: '#00f5ff', bottom: '-10%', right: '-10%', opacity: 0.1 }} />
            <div className="glow-orb" style={{ width: 300, height: 300, background: '#ec4899', top: '40%', left: '40%', opacity: 0.08 }} />

            {/* Grid */}
            <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            {/* Scan line */}
            <motion.div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
                animate={{ top: ['-5%', '110%'] }}
                transition={{ duration: 6, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
            />

            {/* Floating Badges */}
            {floatingBadges.map((b, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + b.delay, duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        left: b.x,
                        top: b.y,
                        zIndex: 2,
                    }}
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4 + i, ease: 'easeInOut', repeat: Infinity, delay: i * 0.5 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 14px',
                            background: 'rgba(12,12,40,0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(0,245,255,0.2)',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#f0f0ff',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                    </motion.div>
                </motion.div>
            ))}

            {/* Main content */}
            <motion.div
                style={{ y, opacity, position: 'relative', zIndex: 2, width: '100%' }}
            >
                <div className="container" style={{ textAlign: 'center' }}>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ marginBottom: 28 }}
                    >
                        <span className="section-tag">
                            <FiZap size={12} />
                            Next-Gen AI Personal Growth Platform
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{
                            fontSize: 'clamp(40px, 7vw, 88px)',
                            fontWeight: 900,
                            marginBottom: 28,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.05,
                        }}
                    >
                        Unlock Your{' '}
                        <span
                            className="gradient-text"
                            style={{
                                fontFamily: 'Orbitron, monospace',
                                display: 'block',
                            }}
                        >
                            Maximum Potential
                        </span>
                        <span style={{ color: '#9898c0', fontSize: '0.6em', fontWeight: 300 }}>
                            with Artificial Intelligence
                        </span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        style={{
                            fontSize: 'clamp(16px, 2.5vw, 20px)',
                            color: '#9898c0',
                            maxWidth: 640,
                            margin: '0 auto 48px',
                            lineHeight: 1.8,
                        }}
                    >
                        PriMaX Hub fuses cutting-edge AI with neuroscience-backed growth frameworks to help you build habits, crush goals, and evolve — every single day.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}
                    >
                        <motion.a
                            href="/signup"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            style={{ fontSize: 16, padding: '16px 36px' }}
                        >
                            Start Growing Free <FiArrowRight />
                        </motion.a>
                        <motion.a
                            href="#preview"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            style={{ fontSize: 16, padding: '16px 36px' }}
                        >
                            <FiPlay size={16} /> Watch Demo
                        </motion.a>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {['👤', '👤', '👤', '👤', '👤'].map((e, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: `linear-gradient(135deg, hsl(${i * 60 + 260},70%,50%), hsl(${i * 60 + 300},70%,60%))`,
                                        border: '2px solid var(--bg-primary)',
                                        marginLeft: i === 0 ? 0 : -8,
                                        fontSize: 14,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    {e}
                                </div>
                            ))}
                        </div>
                        <div style={{ color: '#9898c0', fontSize: 14 }}>
                            <span style={{ color: '#00f5ff', fontWeight: 700 }}>50,000+</span> growth pioneers already onboard
                        </div>
                        <div style={{ display: 'flex', gap: 4, color: '#f59e0b' }}>
                            {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                            <span style={{ color: '#9898c0', marginLeft: 4 }}>4.9/5</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: 2,
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span style={{ fontSize: 11, color: '#5a5a80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
                <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(0,245,255,0.6), transparent)' }} />
            </motion.div>
        </section>
    );
}
