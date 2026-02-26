import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBriefcase, FiPlus, FiCheck, FiTrash2, FiTarget, FiCheckCircle,
    FiCircle, FiX, FiChevronRight, FiStar, FiTrendingUp, FiMap,
    FiFileText, FiSearch, FiMessageCircle, FiAward, FiClock,
    FiExternalLink, FiEdit3, FiZap, FiArrowRight, FiRotateCcw,
    FiBookOpen, FiUsers, FiBarChart2, FiMapPin,
} from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

/* ─── Tabs ────────────────────────────────────────────── */
const TABS = [
    { id: 'roadmap', label: 'Career Roadmap', icon: <FiMap size={14} /> },
    { id: 'skills', label: 'Skills', icon: <FiBarChart2 size={14} /> },
    { id: 'jobs', label: 'Job Tracker', icon: <FiSearch size={14} /> },
    { id: 'resume', label: 'Resume Builder', icon: <FiFileText size={14} /> },
    { id: 'interview', label: 'Interview Prep', icon: <FiMessageCircle size={14} /> },
    { id: 'ai', label: 'AI Coach', icon: <FiZap size={14} /> },
];

/* ─── Data ─────────────────────────────────────────────── */
const initialMilestones = [
    { id: 'm1', title: 'Complete AWS Solutions Architect Cert', deadline: 'Mar 2026', status: 'active', pct: 68, color: '#f59e0b' },
    { id: 'm2', title: 'Ship SaaS MVP and get 50 beta users', deadline: 'Apr 2026', status: 'active', pct: 42, color: '#7c3aed' },
    { id: 'm3', title: 'Reach Senior Engineer level', deadline: 'Jun 2026', status: 'upcoming', pct: 25, color: '#00f5ff' },
    { id: 'm4', title: 'Build personal brand — 5K followers', deadline: 'Aug 2026', status: 'upcoming', pct: 12, color: '#ec4899' },
    { id: 'm5', title: 'Complete ML specialization course', deadline: 'Oct 2026', status: 'upcoming', pct: 0, color: '#10b981' },
];

const initialSkills = [
    { name: 'React / Next.js', level: 92, target: 95, category: 'Frontend', color: '#00f5ff' },
    { name: 'Node.js / Express', level: 85, target: 90, category: 'Backend', color: '#10b981' },
    { name: 'AWS / Cloud', level: 68, target: 85, category: 'DevOps', color: '#f59e0b' },
    { name: 'System Design', level: 72, target: 90, category: 'Architecture', color: '#7c3aed' },
    { name: 'Python / ML', level: 45, target: 75, category: 'AI/ML', color: '#ec4899' },
    { name: 'TypeScript', level: 88, target: 95, category: 'Language', color: '#f97316' },
    { name: 'SQL / PostgreSQL', level: 80, target: 85, category: 'Database', color: '#00f5ff' },
    { name: 'Leadership', level: 60, target: 80, category: 'Soft Skill', color: '#f59e0b' },
];

const initialJobs = [
    { id: 'j1', company: 'Stripe', role: 'Senior Full-Stack Engineer', status: 'Interview', date: 'Feb 20', salary: '$185K', color: '#7c3aed', notes: 'Tech screen scheduled Feb 28' },
    { id: 'j2', company: 'Vercel', role: 'Staff Frontend Engineer', status: 'Applied', date: 'Feb 18', salary: '$195K', color: '#00f5ff', notes: 'Referred by @sarah_dev' },
    { id: 'j3', company: 'Notion', role: 'Product Engineer', status: 'Screening', date: 'Feb 15', salary: '$175K', color: '#10b981', notes: 'Recruiter call done' },
    { id: 'j4', company: 'Linear', role: 'Full-Stack Engineer', status: 'Applied', date: 'Feb 14', salary: '$170K', color: '#f59e0b', notes: '' },
    { id: 'j5', company: 'Figma', role: 'Frontend Engineer', status: 'Offer', date: 'Feb 10', salary: '$190K', color: '#ec4899', notes: 'Offer expires Mar 5!' },
];

const statusColors = { Applied: '#5a5a80', Screening: '#f59e0b', Interview: '#7c3aed', Offer: '#10b981', Rejected: '#ef4444' };

const resumeSections = [
    { id: 'summary', title: '📋 Professional Summary', content: 'Full-stack engineer with 5+ years of experience building scalable SaaS products. Passionate about developer tools, AI/ML integration, and high-performance web applications. Led teams of 5–8 engineers, shipped products to 50K+ users.' },
    { id: 'experience', title: '💼 Experience', content: 'Senior Engineer at TechCo (2023–Present)\n• Led migration to microservices architecture, reducing latency by 40%\n• Built real-time analytics dashboard serving 10K daily users\n• Mentored 3 junior engineers to mid-level promotions\n\nFull-Stack Developer at StartupXYZ (2021–2023)\n• Led frontend rebuild in React/Next.js — 60% faster page loads\n• Designed and implemented REST + GraphQL APIs\n• Shipped payment integration processing $2M+ monthly' },
    { id: 'education', title: '🎓 Education', content: 'B.S. Computer Science — State University (2020)\n• GPA: 3.8/4.0, Dean\'s List\n• Senior project: ML-powered recommendation engine' },
    { id: 'skills_sec', title: '🛠️ Technical Skills', content: 'Languages: JavaScript, TypeScript, Python, SQL\nFrontend: React, Next.js, Tailwind, Framer Motion\nBackend: Node.js, Express, PostgreSQL, Redis\nCloud: AWS (EC2, S3, Lambda, RDS), Vercel, Docker\nTools: Git, CI/CD, Figma, Linear, DataDog' },
];

const interviewQs = [
    { q: 'Tell me about a time you led a challenging project.', category: 'Behavioral', difficulty: 'Medium' },
    { q: 'Design a URL shortener like bit.ly at scale.', category: 'System Design', difficulty: 'Hard' },
    { q: 'Explain the difference between useMemo and useCallback.', category: 'Technical', difficulty: 'Easy' },
    { q: 'How would you handle a disagreement with your manager?', category: 'Behavioral', difficulty: 'Medium' },
    { q: 'Design a rate limiter for an API gateway.', category: 'System Design', difficulty: 'Hard' },
    { q: 'What is your greatest professional weakness?', category: 'Behavioral', difficulty: 'Easy' },
];
const diffColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const catColors = { Behavioral: '#7c3aed', 'System Design': '#00f5ff', Technical: '#f59e0b' };

/* ─── Helpers ──────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
    <div style={{ borderRadius: 18, background: 'var(--app-surface)', border: '1px solid var(--app-border)', padding: 22, ...style }}>{children}</div>
);
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

/* ═══════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                        */
/* ═══════════════════════════════════════════════════════ */
export default function Career() {
    const [tab, setTab] = useState('roadmap');

    const stats = [
        { label: 'Career Score', value: '85%', delta: '+6 this month', color: '#00f5ff', icon: <FiTrendingUp /> },
        { label: 'Skills Tracked', value: '8', delta: '3 growing fast', color: '#7c3aed', icon: <FiBarChart2 /> },
        { label: 'Applications', value: '5', delta: '1 offer!', color: '#10b981', icon: <FiSearch /> },
        { label: 'Milestones', value: '2/5', delta: '68% on #1', color: '#f59e0b', icon: <FiTarget /> },
    ];

    return (
        <div className="page-shell">
            <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
                <div className="page-tag"><FiBriefcase size={10} /> Career</div>
                <h1 className="page-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Career Command Center</h1>
                <p className="page-desc">Plan, track, and accelerate your professional growth with AI-powered career intelligence.</p>
            </motion.div>

            {/* Stats */}
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

            {/* Tabs */}
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
                    {tab === 'roadmap' && <CareerRoadmap />}
                    {tab === 'skills' && <SkillTracker />}
                    {tab === 'jobs' && <JobTracker />}
                    {tab === 'resume' && <ResumeBuilder />}
                    {tab === 'interview' && <InterviewPrep />}
                    {tab === 'ai' && <AICareerCoach />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  CAREER ROADMAP                                         */
/* ═══════════════════════════════════════════════════════ */
function CareerRoadmap() {
    const [milestones, setMilestones] = useState(initialMilestones);

    return (
        <div>
            {/* Vision card */}
            <Card style={{ marginBottom: 20, background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,245,255,0.05))', border: '1px solid rgba(124,58,237,0.25)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(0,245,255,0.06)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🎯</div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Career Vision — 2026</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1.4 }}>Reach Staff Engineer level at a top-tier tech company while building a profitable side SaaS.</div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>5 milestones · 2 active · estimated timeline: 8 months</div>
                    </div>
                </div>
            </Card>

            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
                <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />

                {milestones.map((m, i) => (
                    <motion.div key={m.id} {...fadeUp(i * 0.06)} style={{ marginBottom: 18, position: 'relative' }}>
                        {/* Dot */}
                        <div style={{ position: 'absolute', left: -26, top: 18, width: 14, height: 14, borderRadius: '50%', background: m.status === 'active' ? m.color : 'rgba(255,255,255,0.1)', border: `3px solid ${m.status === 'active' ? m.color : 'rgba(255,255,255,0.15)'}`, boxShadow: m.status === 'active' ? `0 0 12px ${m.color}50` : 'none', zIndex: 1 }} />

                        <Card style={{ padding: '18px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{m.title}</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={10} /> {m.deadline}</span>
                                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: m.status === 'active' ? `${m.color}20` : 'rgba(255,255,255,0.05)', color: m.status === 'active' ? m.color : 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>{m.status}</span>
                                    </div>
                                </div>
                                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 18, fontWeight: 900, color: m.color }}>{m.pct}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                                    style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${m.color}, ${m.color}88)` }} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  SKILL TRACKER                                          */
/* ═══════════════════════════════════════════════════════ */
function SkillTracker() {
    const categories = [...new Set(initialSkills.map(s => s.category))];

    return (
        <div>
            {/* Skill radar summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Skill Levels</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {initialSkills.map((s, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{s.name}</span>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.level}%</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>→ {s.target}%</span>
                                    </div>
                                </div>
                                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 1, delay: i * 0.06 }}
                                        style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                                    <div style={{ position: 'absolute', left: `${s.target}%`, top: -2, width: 2, height: 9, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🏷️ By Category</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {categories.map((cat, i) => {
                            const skills = initialSkills.filter(s => s.category === cat);
                            const avg = Math.round(skills.reduce((a, b) => a + b.level, 0) / skills.length);
                            return (
                                <div key={i} style={{ flex: '1 1 calc(50% - 5px)', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 6 }}>{cat}</div>
                                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: skills[0].color }}>{avg}%</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{skills.length} skill{skills.length > 1 ? 's' : ''}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>🤖 AI Recommendation</div>
                        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Focus on <strong style={{ color: '#f59e0b' }}>AWS/Cloud (68%)</strong> — closing the gap to your 85% target would unlock the Senior Engineer milestone 3 months sooner.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  JOB TRACKER                                            */
/* ═══════════════════════════════════════════════════════ */
function JobTracker() {
    const [jobs, setJobs] = useState(initialJobs);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ company: '', role: '', salary: '', notes: '' });
    const stages = ['Applied', 'Screening', 'Interview', 'Offer'];

    const addJob = () => {
        if (!form.company.trim() || !form.role.trim()) return;
        setJobs(j => [{ id: `j${Date.now()}`, ...form, status: 'Applied', date: 'Today', color: '#7c3aed' }, ...j]);
        setForm({ company: '', role: '', salary: '', notes: '' }); setAdding(false);
    };

    const moveJob = (id, newStatus) => setJobs(js => js.map(j => j.id === id ? { ...j, status: newStatus } : j));
    const delJob = (id) => setJobs(js => js.filter(j => j.id !== id));

    return (
        <div>
            {/* Pipeline summary */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {stages.map(s => {
                    const count = jobs.filter(j => j.status === s).length;
                    return (
                        <div key={s} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: `${statusColors[s]}12`, border: `1px solid ${statusColors[s]}30`, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: statusColors[s] }}>{count}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s}</div>
                        </div>
                    );
                })}
            </div>

            {/* Add button */}
            <div style={{ marginBottom: 16 }}>
                {!adding ? (
                    <button onClick={() => setAdding(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))', border: '1px solid rgba(124,58,237,0.3)', color: '#f0f0ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <FiPlus size={13} /> Add Application
                    </button>
                ) : (
                    <Card style={{ padding: 18 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                            {[['Company', 'company'], ['Role', 'role'], ['Salary', 'salary'], ['Notes', 'notes']].map(([label, key]) => (
                                <input key={key} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
                                    style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={addJob} style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Add</button>
                            <button onClick={() => setAdding(false)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}><FiX size={12} /></button>
                        </div>
                    </Card>
                )}
            </div>

            {/* Job list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jobs.map(j => (
                    <motion.div key={j.id} layout>
                        <Card style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${j.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: j.color }}>{j.company.charAt(0)}</div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{j.company}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{j.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${statusColors[j.status]}20`, color: statusColors[j.status], fontWeight: 700 }}>{j.status}</span>
                                        {j.salary && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)' }}>{j.salary}</span>}
                                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{j.date}</span>
                                    </div>
                                    {j.notes && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, fontStyle: 'italic' }}>📝 {j.notes}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                    {stages.filter(s => s !== j.status).slice(0, 2).map(s => (
                                        <button key={s} onClick={() => moveJob(j.id, s)}
                                            style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: `${statusColors[s]}15`, border: `1px solid ${statusColors[s]}30`, color: statusColors[s], fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{s}</button>
                                    ))}
                                    <button onClick={() => delJob(j.id)} style={{ padding: '4px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer' }}><FiTrash2 size={10} /></button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  RESUME BUILDER                                         */
/* ═══════════════════════════════════════════════════════ */
function ResumeBuilder() {
    const [sections, setSections] = useState(resumeSections);
    const [editing, setEditing] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const enhanceWithAI = async (secId) => {
        setAiLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const sec = sections.find(s => s.id === secId);
            const result = await model.generateContent(`You are an elite career coach and resume writer. Rewrite and enhance this resume section to be more impactful, using strong action verbs, quantified achievements, and ATS-friendly keywords. Keep the same structure. Section: ${sec.title}\n\nContent:\n${sec.content}`);
            setSections(ss => ss.map(s => s.id === secId ? { ...s, content: result.response.text() } : s));
        } catch { /* ignore */ }
        setAiLoading(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✍️ Editor</span>
                </div>
                {sections.map(sec => (
                    <Card key={sec.id} style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{sec.title}</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => enhanceWithAI(sec.id)} disabled={aiLoading}
                                    style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(0,245,255,0.1))', border: '1px solid rgba(124,58,237,0.3)', color: '#00f5ff', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <FiZap size={10} /> AI Enhance
                                </button>
                                <button onClick={() => setEditing(editing === sec.id ? null : sec.id)}
                                    style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--app-border)', color: 'var(--text-3)', cursor: 'pointer' }}>
                                    <FiEdit3 size={10} />
                                </button>
                            </div>
                        </div>
                        {editing === sec.id ? (
                            <textarea value={sec.content} onChange={e => setSections(ss => ss.map(s => s.id === sec.id ? { ...s, content: e.target.value } : s))}
                                rows={6} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text-1)', fontSize: 12, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none' }} />
                        ) : (
                            <pre style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', margin: 0 }}>{sec.content}</pre>
                        )}
                    </Card>
                ))}
            </div>

            {/* Live preview */}
            <Card style={{ background: '#0e0e28', border: '1px solid rgba(124,58,237,0.2)', position: 'sticky', top: 20, alignSelf: 'start', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}><FiFileText size={12} /> Live Preview</div>
                <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#f0f0ff' }}>Growth Pioneer</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>developer@primaxhub.ai · github.com/pioneer · San Francisco, CA</div>
                </div>
                {sections.map(sec => (
                    <div key={sec.id} style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.06em', borderBottom: '1px solid rgba(124,58,237,0.2)', paddingBottom: 4 }}>{sec.title.replace(/^.{2}\s/, '')}</div>
                        <pre style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', margin: 0 }}>{sec.content}</pre>
                    </div>
                ))}
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  INTERVIEW PREP                                         */
/* ═══════════════════════════════════════════════════════ */
function InterviewPrep() {
    const [selectedQ, setSelectedQ] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');

    const getAIFeedback = async () => {
        if (!userAnswer.trim() || selectedQ === null) return;
        setLoading(true); setFeedback('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const q = interviewQs[selectedQ];
            const result = await model.generateContent(`You are a senior tech interviewer at a FAANG company. Evaluate this interview answer.

Question (${q.category}, ${q.difficulty}): "${q.q}"

Candidate's Answer: "${userAnswer}"

Provide:
1. Score out of 10
2. Strengths (2-3 bullet points)
3. Areas to improve (2-3 bullet points)
4. A model answer the candidate can learn from

Be constructive, specific, and encouraging. Use emojis. Keep under 250 words.`);
            setFeedback(result.response.text());
        } catch { setFeedback('⚠️ Could not get feedback. Try again.'); }
        setLoading(false);
    };

    const cats = ['All', ...new Set(interviewQs.map(q => q.category))];
    const filtered = filter === 'All' ? interviewQs : interviewQs.filter(q => q.category === filter);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
            {/* Question bank */}
            <div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                    {cats.map(c => (
                        <button key={c} onClick={() => setFilter(c)}
                            style={{ fontSize: 10, padding: '4px 10px', borderRadius: 100, background: filter === c ? 'rgba(124,58,237,0.15)' : 'transparent', border: filter === c ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)', color: filter === c ? '#f0f0ff' : 'var(--text-3)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{c}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.map((q, i) => {
                        const origIdx = interviewQs.indexOf(q);
                        return (
                            <motion.div key={origIdx} whileHover={{ x: 3 }}
                                onClick={() => { setSelectedQ(origIdx); setFeedback(''); setUserAnswer(''); }}
                                style={{ padding: '14px 14px', borderRadius: 12, background: selectedQ === origIdx ? 'rgba(124,58,237,0.12)' : 'var(--app-surface)', border: selectedQ === origIdx ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--app-border)', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>{q.q}</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 100, background: `${catColors[q.category]}18`, color: catColors[q.category], fontWeight: 700 }}>{q.category}</span>
                                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 100, background: `${diffColors[q.difficulty]}18`, color: diffColors[q.difficulty], fontWeight: 700 }}>{q.difficulty}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Practice area */}
            <Card>
                {selectedQ !== null ? (
                    <div>
                        <div style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 18 }}>
                            <div style={{ fontSize: 11, color: '#00f5ff', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Interview Question</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.5 }}>{interviewQs[selectedQ].q}</div>
                        </div>

                        <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type your answer here... be detailed and specific."
                            rows={6} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />

                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={getAIFeedback} disabled={loading || !userAnswer.trim()}
                            style={{ padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: userAnswer.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 7, opacity: loading || !userAnswer.trim() ? 0.5 : 1 }}>
                            {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Analysing...</> : <><FiZap size={13} /> Get AI Feedback</>}
                        </motion.button>

                        {feedback && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{ marginTop: 20, padding: '18px 20px', borderRadius: 14, background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                                    <span style={{ fontSize: 16 }}>🤖</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Interview Coach</span>
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedback}</div>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, textAlign: 'center', opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>🎤</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Select a question to practice</div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Get instant AI feedback on your answers</div>
                    </div>
                )}
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  AI CAREER COACH                                        */
/* ═══════════════════════════════════════════════════════ */
function AICareerCoach() {
    const [goal, setGoal] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!goal.trim()) return;
        setLoading(true); setPlan('');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(`You are PriMaX Hub's senior AI Career Coach — trained on career strategy from top tech leaders. The user asks: "${goal}"

Provide:
1. A clear strategic analysis
2. Step-by-step action plan with timelines
3. Skills to develop and resources
4. Potential risks and how to mitigate them
5. A "Quick Win" they can do today

Use headers, bullet points, emojis. Be specific and data-driven. Keep under 400 words.`);
            setPlan(result.response.text());
        } catch { setPlan('⚠️ Could not generate. Try again.'); }
        setLoading(false);
    };

    const prompts = [
        'How do I negotiate a 30% salary increase?',
        'Create a path from mid-level to Staff Engineer in 18 months',
        'Should I join a startup or stay at a big company?',
        'Build a personal brand as a software engineer',
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.04))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>💼</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>AI Career Strategist</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>Ask any career question — salary negotiation, career pivots, skill planning, or growth strategy. Get personalised, actionable advice.</p>
                <textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="What career challenge are you facing?" rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--app-border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-1)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: 14 }} />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generate} disabled={loading || !goal.trim()}
                    style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: goal.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8, opacity: loading || !goal.trim() ? 0.6 : 1 }}>
                    {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'flex' }}><FiRotateCcw size={13} /></motion.div> Thinking...</> : <><FiZap size={14} /> Get Strategy</>}
                </motion.button>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular questions:</span>
                    {prompts.map((p, i) => (
                        <button key={i} onClick={() => setGoal(p)}
                            style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>💡 {p}</button>
                    ))}
                </div>
            </Card>

            <Card style={{ overflowY: 'auto', maxHeight: 600 }}>
                {plan ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#00f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Career Strategy</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{plan}</div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 32, opacity: 0.5 }}>
                        <span style={{ fontSize: 48, marginBottom: 16 }}>🗺️</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)' }}>Your career strategy will appear here</div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Ask anything about your career path.</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
