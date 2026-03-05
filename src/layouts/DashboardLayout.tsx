import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings } from 'lucide-react';

export default function DashboardLayout() {
    const location = useLocation();
    const path = location.pathname;

    const dashboardTabs = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Transaksi', path: '/dashboard/transactions', icon: <Receipt className="w-4 h-4" /> },
        { name: 'Pengaturan', path: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <div className="w-full flex flex-col animate-fade-in">

            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 bg-gray-900/50 p-1.5 rounded-xl border border-gray-800 w-fit shadow-sm">
                {dashboardTabs.map((tab) => {
                    const isActive = path === tab.path || (tab.path !== '/dashboard' && path.startsWith(tab.path));
                    return (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive
                                    ? 'bg-emas text-gelap shadow-md'
                                    : 'text-gray-400 hover:text-terang hover:bg-gray-800'
                                }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            <div className="w-full">
                <Outlet />
            </div>

        </div>
    );
}