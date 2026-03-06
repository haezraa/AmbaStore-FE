import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Receipt, Trophy, X, ChevronDown, LogOut, Settings, LayoutDashboard, Coins, CheckCircle2 } from 'lucide-react';
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

  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
    { name: 'Transaksi', path: '/invoice', icon: <Receipt className="w-6 h-6" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-6 h-6" /> },
  ];

  const dashboardTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Transaksi', path: '/dashboard/transactions', icon: <Receipt className="w-4 h-4" /> },
    { name: 'Pengaturan', path: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const today = new Date().toLocaleDateString('en-CA'); 
      const lastClaim = parsedUser.last_claim_date ? parsedUser.last_claim_date.substring(0, 10) : null;
      
      if (lastClaim !== today) {
        setShowDailyPopup(true);
      }
    }

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
    if (showDailyPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showDailyPopup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
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
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const filteredGames = games.filter(game =>
    game.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimCoin = async () => {
    setIsClaiming(true);
    try {
      const response = await api.post('/claim-coin');
      if (response.data.sukses) {
        const updatedUser = { 
            ...user, 
            amba_coin: response.data.data.total_koin,
            login_streak: response.data.data.streak_hari_ke,
            last_claim_date: new Date().toISOString()
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setShowDailyPopup(false);
        alert(`Berhasil! Kamu dapat ${response.data.data.koin_didapat} Amba Coin.`);
      }
    } catch (error: any) {
      alert(error.response?.data?.pesan || "Gagal klaim coin, coba lagi nanti.");
      setShowDailyPopup(false);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gelap text-terang font-sans selection:bg-emas selection:text-gelap flex flex-col md:flex-row relative overflow-x-hidden">

      <nav className="fixed top-0 left-0 w-full h-20 border-b border-gray-800 bg-abu z-50 flex items-center justify-between shadow-md transition-all">
        <Link to="/" className="flex items-center flex-shrink-0 ml-14 md:ml-40 lg:ml-48">
          <img src="/images/ambatukam.jpg" alt="Logo AmbaStore" className="h-10 md:h-12 object-contain hover:scale-105 transition-transform" />
        </Link>

        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          <input
            type="text"
            placeholder="Cari game..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-gelap border border-gray-700 rounded-full py-2.5 px-5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emas/30 focus:border-emas text-terang placeholder:text-gray-500 transition-all font-medium shadow-inner"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emas transition-colors duration-300" />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}

          {isDropdownOpen && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gelap border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-96 overflow-y-auto animate-fade-in">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <Link key={game.id} to={`/topup/${game.id}`} onClick={() => { setIsDropdownOpen(false); setSearchQuery(""); }} className="flex items-center gap-4 p-3 hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0">
                    <img src={game.gambar} alt={game.nama} className="w-12 h-12 rounded-lg object-cover border border-gray-700" />
                    <div>
                      <h4 className="font-bold text-terang text-sm">{game.nama}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{game.publisher}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">Game tidak ditemukan.</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-5 mr-4 md:mr-8 relative" ref={profileRef}>
          {user ? (
            <>
               <div className="hidden sm:flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700 mr-1 shadow-sm h-10">
                 <Coins className="w-5 h-5 text-emas" />
                 <span className="text-sm font-bold text-emas">{user.amba_coin || 0}</span>
                 <span className="text-xs text-gray-400 font-medium">Amba Coin</span>
               </div>

              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 hover:bg-gray-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-700 h-10">
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
                  <Link to="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-emas transition-colors">
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
              <Link to="/login" className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-emas transition-colors">Masuk</Link>
              <Link to="/register" className="bg-emas hover:bg-yellow-500 text-gelap px-5 py-2 md:py-2.5 rounded-full text-sm font-bold shadow-lg transition-all">Daftar</Link>
            </>
          )}
        </div>
      </nav>

      <aside className="fixed top-20 left-0 w-20 lg:w-24 h-[calc(100vh-5rem)] bg-abu border-r border-gray-800 z-40 hidden md:flex flex-col items-center py-4 gap-2 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          return (
            <Link key={item.name} to={item.path} className={`relative flex flex-col items-center justify-center w-full py-4 transition-all group ${isActive ? 'text-emas' : 'text-gray-400 hover:text-terang hover:bg-gray-800/30'}`}>
              {item.icon}
              <span className="text-xs font-bold mt-1.5">{item.name}</span>
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-emas rounded-t-md" />}
            </Link>
          );
        })}
      </aside>

      <main className="flex-1 w-full mt-20 md:ml-20 lg:ml-24 min-h-[calc(100vh-5rem)] flex flex-col relative z-10">
        {path.startsWith('/dashboard') && (
          <div className="sticky top-20 z-40 bg-abu/95 backdrop-blur-md border-b border-gray-800 px-4 md:px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar shadow-sm">
            {dashboardTabs.map((tab) => {
              const isActive = path === tab.path || (tab.path !== '/dashboard' && path.startsWith(tab.path));
              return (
                <Link key={tab.name} to={tab.path} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive ? 'bg-emas/10 text-emas border border-emas/30' : 'text-gray-400 hover:text-terang hover:bg-gray-800 border border-transparent'}`}>
                  {tab.icon} {tab.name}
                </Link>
              );
            })}
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-12 flex-1">
          <Outlet />
        </div>

        <footer className="w-full text-center p-8 border-t border-gray-800 text-gray-500 text-sm mt-auto bg-gelap/30 backdrop-blur-sm relative z-10 mb-16 md:mb-0">
          &copy; 2026 <span className="text-emas font-bold">AmbaStore</span>. Hak Cipta Dilindungi.
        </footer>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-abu border-t border-gray-800 z-[60]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
            return (
              <Link key={item.name} to={item.path} className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${isActive ? 'text-emas' : 'text-gray-400 hover:text-terang'}`}>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-emas rounded-b-full" />}
                <div className="relative z-10 flex flex-col items-center justify-center mt-1">
                  {item.icon}
                  <span className="text-[10px] font-bold mt-1">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* daily reward */}
      {showDailyPopup && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-gradient-to-b from-gray-800 to-gelap w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden border border-emas/30 relative">
                
                <button onClick={() => setShowDailyPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center relative overflow-hidden">
                    <h2 className="text-3xl font-black text-terang mb-2 relative z-10">Daily <span className="text-emas">Reward</span></h2>
                    <p className="text-gray-400 text-sm mb-8 relative z-10">Login setiap hari untuk mendapatkan Amba Coin gratis. Jangan sampai terlewat atau ngulang dari awal!</p>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                            const targetHari = (user.login_streak || 0) + 1;
                            const isToday = day === (targetHari > 7 ? 1 : targetHari);
                            const isPassed = day < (targetHari > 7 ? 1 : targetHari);
                            const isDay7 = day === 7;

                            return (
                                <div key={day} className={`
                                    relative flex flex-col items-center justify-center py-4 rounded-2xl border transition-all
                                    ${isDay7 ? 'col-span-2' : 'col-span-1'}
                                    ${isPassed ? 'bg-emas/20 border-emas/50' : isToday ? 'bg-emas border-emas shadow-[0_0_20px_rgba(234,179,8,0.6)] transform scale-105 z-10' : 'bg-gray-800/50 border-gray-700'}
                                `}>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isPassed ? 'text-emas' : isToday ? 'text-gelap' : 'text-gray-500'}`}>
                                        Hari {day}
                                    </span>
                                    <Coins className={`w-8 h-8 ${isPassed ? 'text-emas opacity-50' : isToday ? 'text-gelap' : 'text-gray-600'}`} />
                                    <span className={`font-black mt-1 ${isPassed ? 'text-emas' : isToday ? 'text-gelap' : 'text-gray-500'}`}>
                                        +{isDay7 ? 2 : 1}
                                    </span>
                                    
                                    {isPassed && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-[1px]">
                                            <CheckCircle2 className="w-6 h-6 text-emas" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <button 
                        onClick={handleClaimCoin}
                        disabled={isClaiming}
                        className="w-full bg-emas hover:bg-yellow-500 disabled:opacity-50 text-gelap font-black py-4 rounded-2xl mt-6 text-lg shadow-[0_10px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_10px_25px_rgba(234,179,8,0.5)] transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                        {isClaiming ? 'MEMPROSES...' : 'KLAIM SEKARANG'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}