import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlobalAI from './GlobalAI';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import '../../app.css';

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', user.id)
                .maybeSingle(); // maybeSingle returns null (not error) when no row exists
            // Only redirect if we got a row back AND onboarding is not completed
            if (!error && data && data.onboarding_completed === false) {
                navigate('/app/onboarding', { replace: true });
            }
            // If error or no row (migration not run yet) → let user into the app
        })();
    }, [user, navigate]);

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
