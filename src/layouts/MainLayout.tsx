import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Home, Receipt, Trophy, X } from 'lucide-react';
import api from '../services/api';
import type { Game } from '../types';

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  // state buat search bar
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
    { name: 'Transaksi', path: '/invoice', icon: <Receipt className="w-6 h-6" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-6 h-6" /> },
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data.data);
      } catch (error) {
        console.error("Gagal memuat data game untuk pencarian:", error);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="flex items-center gap-3 md:gap-5 mr-4 md:mr-8">

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