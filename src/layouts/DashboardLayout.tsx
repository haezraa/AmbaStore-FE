import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Receipt, FileText, Megaphone, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Transaksi', path: '/dashboard/transaksi', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Mutasi', path: '/dashboard/mutasi', icon: <Receipt className="w-5 h-5" /> },
    { name: 'Laporan', path: '/dashboard/laporan', icon: <FileText className="w-5 h-5" /> },
    { name: 'Afiliasi', path: '/dashboard/afiliasi', icon: <Megaphone className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#202020] text-terang font-sans">
      
      {/* sidebar dasbor */}
      <aside className="w-64 bg-gradient-to-b from-[#2a2a2a] to-[#202020] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-emas tracking-wider">AmbaStore</Link>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = path === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                  isActive ? 'bg-gradient-to-r from-gray-700 to-transparent text-white border-l-4 border-emas' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm transition-all">
            <LogOut className="w-5 h-5" />
            Keluar
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}