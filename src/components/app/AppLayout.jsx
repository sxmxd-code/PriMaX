import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlobalAI from './GlobalAI';
import '../../app.css';

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
            <TopBar collapsed={collapsed} />
            <motion.main
                className={`main-content${collapsed ? ' collapsed' : ''}`}
                layout
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                <Outlet />
            </motion.main>
            <GlobalAI />
        </div>
    );
}
