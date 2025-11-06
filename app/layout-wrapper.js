'use client';

import { usePathname } from 'next/navigation';
import SideMenu from './components/SideMenu/SideMenu';
import Header from './components/header/Header';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    if (!pathname) return null;

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="layout-wrapper">
            <SideMenu />
            <div className="layout-content">
                <Header />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
