import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Settings, Phone } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    coin: 0,
    total_transaksi: 0,
    total_penjualan: 0,
    menunggu: 0,
    proses: 0,
    sukses: 0,
    gagal: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard-stats');
        if (response.data.sukses) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data statistik dari server.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-emas border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emas font-bold animate-pulse">Memuat data dasbor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#303030] rounded-2xl p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-inner">
                {user ? getInitials(user.name) : 'US'}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg capitalize">{user?.name || 'Pengguna'}</h3>
                <span className="bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-md font-semibold mt-1 inline-block">
                  Member
                </span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors" title="Pengaturan Akun">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-8 flex items-center gap-2 text-gray-300 text-sm font-medium">
            <Phone className="w-4 h-4" />
            {user?.whatsapp || 'Nomor tidak tersedia'}
          </div>
        </div>

        <div className="bg-[#303030] rounded-2xl p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                <span className="text-black font-bold text-xs">C</span>
              </div>
              <span className="text-white font-bold">Oura Coin</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-[#A58B61] hover:bg-[#856942] text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-md">Top Up</button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-md">Redeem</button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-black text-white">
              {stats.coin.toLocaleString('id-ID')} <span className="text-3xl font-bold">Oura Coin</span>
            </h2>
          </div>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-4">Transaksi Hari Ini</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 bg-[#424750] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">{stats.total_transaksi.toLocaleString('id-ID')}</h4>
          <p className="text-gray-300 text-sm font-medium">Total Transaksi</p>
        </div>
        
        <div className="col-span-2 bg-[#424750] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">Rp {stats.total_penjualan.toLocaleString('id-ID')}</h4>
          <p className="text-gray-300 text-sm font-medium">Total Pembelanjaan</p>
        </div>

        <div className="bg-[#b89b3a] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">{stats.menunggu.toLocaleString('id-ID')}</h4>
          <p className="text-white text-sm font-medium">Menunggu</p>
        </div>

        <div className="bg-[#2f5c96] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">{stats.proses.toLocaleString('id-ID')}</h4>
          <p className="text-white text-sm font-medium">Dalam Proses</p>
        </div>

        <div className="bg-[#2c7844] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">{stats.sukses.toLocaleString('id-ID')}</h4>
          <p className="text-white text-sm font-medium">Sukses</p>
        </div>

        <div className="bg-[#822a2a] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">{stats.gagal.toLocaleString('id-ID')}</h4>
          <p className="text-white text-sm font-medium">Gagal</p>
        </div>
      </div>

    </div>
  );
}