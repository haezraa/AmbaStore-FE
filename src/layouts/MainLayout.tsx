import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Search, Gamepad2, Receipt, Trophy } from 'lucide-react';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gelap text-terang font-sans selection:bg-emas selection:text-gelap flex flex-col relative overflow-x-hidden">
      
      <nav className="fixed top-0 left-0 w-full h-20 border-b border-abu bg-abu/90 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between shadow-md transition-all">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-terang hover:text-emas transition"
          >
            <Menu className="w-7 h-7" />
          </button>
          
          {/* logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/ambatukam.jpg" 
              alt="Logo AmbaStore" 
              className="h-10 md:h-12 object-contain hover:scale-105 transition-transform" 
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input type="text" placeholder="Cari game..." className="w-full bg-gelap border border-abu rounded-full py-2 px-4 pl-11 focus:outline-none focus:border-emas text-terang" />
          <Search className="absolute left-4 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-semibold text-terang hover:text-emas">Masuk</button>
          <button className="bg-emas hover:bg-yellow-500 text-gelap px-5 py-2 rounded-full text-sm font-bold shadow-lg">Daftar</button>
        </div>
      </nav>

      {/* sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-abu border-r border-gelap z-[70] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
         <div className="p-5 border-b border-gelap flex justify-between items-center">
          <h2 className="font-bold text-lg text-emas">Menu Utama</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-terang hover:text-emas"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-4 flex flex-col gap-2 font-medium">
          <Link to="/" onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-lg hover:bg-gelap hover:text-emas flex items-center gap-3"><Gamepad2 className="w-5 h-5" /> Top Up Game</Link>
          <Link to="/invoice" onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-lg hover:bg-gelap hover:text-emas flex items-center gap-3"><Receipt className="w-5 h-5" /> Cek Transaksi</Link>
          <Link to="/leaderboard" onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-lg hover:bg-gelap hover:text-emas flex items-center gap-3"><Trophy className="w-5 h-5" /> Leaderboard Sultan</Link>
        </div>
      </aside>

      <main className="flex-1 w-full max-w-7xl mx-auto pt-24 px-4 md:px-6">
        <Outlet /> 
      </main>

      <footer className="text-center p-6 border-t border-abu text-gray-400 text-sm mt-8">
        &copy; 2026 <span className="text-emas font-bold">AmbaStore</span>. Top Up Cepat, Auto Menang.
      </footer>
    </div>
  );
}