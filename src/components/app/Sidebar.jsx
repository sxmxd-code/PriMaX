import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiZap, FiBriefcase, FiDollarSign,
    FiHeart, FiSun, FiBarChart2, FiMessageCircle,
    FiSettings, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import '../../app.css';

const navSections = [
    {
        label: 'Overview',
        items: [
            { to: '/app', icon: <FiGrid />, label: 'Command Center', exact: true },
        ],
    },
    {
        label: 'Growth Modules',
        items: [
            { to: '/app/productivity', icon: <FiZap />, label: 'Productivity' },
            { to: '/app/career', icon: <FiBriefcase />, label: 'Career' },
            { to: '/app/finance', icon: <FiDollarSign />, label: 'Finance' },
            { to: '/app/fitness', icon: <FiHeart />, label: 'Fitness' },
            { to: '/app/mental', icon: <FiSun />, label: 'Mental Growth' },
        ],
    },
    {
        label: 'Intelligence',
        items: [
            { to: '/app/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
            { to: '/app/ai', icon: <FiMessageCircle />, label: 'AI Assistant' },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/app/settings', icon: <FiSettings />, label: 'Settings' },
        ],
    },
];

const moduleColors = {
    '/app': '#7c3aed',
    '/app/productivity': '#00f5ff',
    '/app/career': '#f59e0b',
    '/app/finance': '#10b981',
    '/app/fitness': '#ec4899',
    '/app/mental': '#f97316',
    '/app/analytics': '#7c3aed',
    '/app/ai': '#00f5ff',
    '/app/settings': '#9898c0',
};

export default function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();

    return (
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">⚡</div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            className="sidebar-brand"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            PriMaX<span>Hub</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    className="sidebar-section-label"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {section.label}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {section.items.map((item) => {
                            const isActive = item.exact
                                ? location.pathname === item.to
                                : location.pathname.startsWith(item.to) && item.to !== '/app';
                            const exactActive = location.pathname === item.to;
                            const active = item.exact ? exactActive : isActive || exactActive;
                            const color = moduleColors[item.to] || '#7c3aed';

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.exact}
                                    className={({ isActive: ia }) => `nav-item${ia ? ' active' : ''}`}
                                    title={collapsed ? item.label : ''}
                                    style={({ isActive: ia }) => ia ? { color: color } : {}}
                                >
                                    <span className="nav-icon" style={{ color: active ? color : undefined }}>
                                        {item.icon}
                                    </span>
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                className="nav-label"
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer — collapse toggle */}
            <div className="sidebar-footer">
                <button className="collapse-btn" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                    <span className="nav-icon">
                        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </span>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ fontSize: 13, whiteSpace: 'nowrap' }}
                            >
                                Collapse sidebar
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </aside>
    );
}
