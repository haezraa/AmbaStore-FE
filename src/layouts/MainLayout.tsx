import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Receipt, Trophy, X, ChevronDown, LogOut, Settings, LayoutDashboard, Coins } from 'lucide-react';
import api from '../services/api';
import type { Game } from '../types';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
    { name: 'Transaksi', path: '/invoice', icon: <Receipt className="w-6 h-6" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-6 h-6" /> },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    navigate('/'); 
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const filteredGames = games.filter(game =>
    game.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gelap text-terang font-sans selection:bg-emas selection:text-gelap flex flex-col md:flex-row relative overflow-x-hidden">

      {/* navbar */}
      <nav className="fixed top-0 left-0 w-full h-20 border-b border-gray-800 bg-abu z-50 flex items-center justify-between shadow-md transition-all">

        {/* logo */}
        <Link to="/" className="flex items-center flex-shrink-0 ml-14 md:ml-40 lg:ml-48">
          <img
            src="/images/ambatukam.jpg"
            alt="Logo AmbaStore"
            className="h-10 md:h-12 object-contain hover:scale-105 transition-transform"
          />
        </Link>

        {/* search bar */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          <input
            type="text"
            placeholder="Cari game..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-gelap border border-gray-700 rounded-full py-2.5 px-5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emas/30 focus:border-emas group-hover:border-gray-500 text-terang placeholder:text-gray-500 transition-all font-medium shadow-inner"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emas transition-colors duration-300" />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsDropdownOpen(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* hasil search */}
          {isDropdownOpen && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gelap border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-96 overflow-y-auto animate-fade-in">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <Link
                    key={game.id}
                    to={`/topup/${game.id}`}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0"
                  >
                    <img src={game.gambar} alt={game.nama} className="w-12 h-12 rounded-lg object-cover border border-gray-700" />
                    <div>
                      <h4 className="font-bold text-terang text-sm">{game.nama}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{game.publisher}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">
                  Game tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-5 mr-4 md:mr-8 relative" ref={profileRef}>
          {user ? (
            <>
               <div className="hidden sm:flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700 mr-2">
                 <Coins className="w-4 h-4 text-emas" />
                 <span className="text-xs font-bold text-emas">0</span>
                 <span className="text-[10px] text-gray-400 font-medium ml-0.5">Amba Coin</span>
               </div>

              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-gray-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emas to-yellow-600 flex items-center justify-center text-gelap font-bold text-sm shadow-md">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <span className="text-sm font-bold text-terang max-w-[100px] truncate">{user.username}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-gelap border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in flex flex-col py-2">
                  <div className="px-4 py-3 border-b border-gray-800 mb-1">
                    <p className="text-sm font-bold text-terang truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  
                  <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-emas transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-emas transition-colors">
                    <Settings className="w-4 h-4" /> Pengaturan
                  </Link>
                  
                  <div className="h-px bg-gray-800 my-1"></div>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-medium">
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-emas transition-colors">
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-emas hover:bg-yellow-500 text-gelap px-5 py-2 md:py-2.5 rounded-full text-sm font-bold shadow-lg transition-all">
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* sidebar kiri */}
      <aside className="fixed top-20 left-0 w-20 lg:w-24 h-[calc(100vh-5rem)] bg-abu border-r border-gray-800 z-40 hidden md:flex flex-col items-center py-4 gap-2 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full py-4 transition-all group ${isActive ? 'text-emas' : 'text-gray-400 hover:text-terang hover:bg-gray-800/30'
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

        <footer className="w-full text-center p-8 border-t border-gray-800 text-gray-500 text-sm mt-auto bg-gelap/30 backdrop-blur-sm relative z-10 mb-16 md:mb-0">
          &copy; 2026 <span className="text-emas font-bold">AmbaStore</span>. Hak Cipta Dilindungi.
        </footer>
      </main>

      {/* buat mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-abu border-t border-gray-800 z-[60]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${isActive ? 'text-emas' : 'text-gray-400 hover:text-terang'
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