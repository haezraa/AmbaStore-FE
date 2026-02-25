import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Home, Receipt, Trophy } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
    { name: 'Transaksi', path: '/invoice', icon: <Receipt className="w-6 h-6" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gelap text-terang font-sans selection:bg-emas selection:text-gelap flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* navbar */}
      <nav className="fixed top-0 left-0 w-full h-20 border-b border-gray-800 bg-gelap/90 backdrop-blur-md z-50 flex items-center justify-between shadow-md transition-all">
        
        {/* logo */}
        <Link to="/" className="flex items-center flex-shrink-0 ml-12 md:ml-24 lg:ml-32">
          <img 
            src="/images/ambatukam.jpg" 
            alt="Logo AmbaStore" 
            className="h-10 md:h-12 object-contain hover:scale-105 transition-transform" 
          />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Cari game..." 
            className="w-full bg-abu border border-gray-700 rounded-full py-2.5 px-4 pl-12 focus:outline-none focus:border-emas text-terang placeholder:text-gray-500 transition-all font-medium" 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        <div className="flex items-center gap-3 md:gap-5 mr-4 md:mr-8">
          <button className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-emas transition-colors">
            Masuk
          </button>
          <button className="bg-emas hover:bg-yellow-500 text-gelap px-5 py-2 md:py-2.5 rounded-full text-sm font-bold shadow-lg transition-all">
            Daftar
          </button>
        </div>
      </nav>

      {/* sidebar kiri */}
      <aside className="fixed top-20 left-0 w-20 lg:w-24 h-[calc(100vh-5rem)] bg-abu/50 border-r border-gray-800 z-40 hidden md:flex flex-col items-center py-4 gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          return (
            <Link 
              key={item.name}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full py-4 transition-all group ${
                isActive ? 'text-emas' : 'text-gray-400 hover:text-terang hover:bg-gray-800/30'
              }`}
            >
              {item.icon}
              <span className="text-xs font-bold mt-1.5">{item.name}</span>
              
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-emas rounded-t-md" />
              )}
            </Link>
          );
        })}
      </aside>

      {/* main konten */}
      <main className="flex-1 w-full mt-20 md:ml-20 lg:ml-24 min-h-[calc(100vh-5rem)] flex flex-col relative z-10">
        
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-12 flex-1">
            <Outlet /> 
        </div>

        {/* footer */}
        <footer className="w-full text-center p-8 border-t border-gray-800 text-gray-500 text-sm mt-auto bg-gelap/30 backdrop-blur-sm relative z-10 mb-16 md:mb-0">
          &copy; 2026 <span className="text-emas font-bold">AmbaStore</span>. Hak Cipta Dilindungi.
        </footer>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-abu border-t border-gray-800 z-[60]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                  isActive ? 'text-emas' : 'text-gray-400 hover:text-terang'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-emas rounded-b-full" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center mt-1">
                  {item.icon}
                  <span className="text-[10px] font-bold mt-1">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}