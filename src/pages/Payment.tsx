import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
    CheckCircle2, Clock, Download, ChevronLeft, 
    ShieldCheck, AlertCircle, Home 
} from 'lucide-react';
import api from '../services/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dataTransaksi = location.state; 

  const [status, setStatus] = useState(dataTransaksi?.status || 'pending');
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (!dataTransaksi) {
        navigate('/');
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const checkInterval = setInterval(async () => {
        if (status === 'paid') return;

        try {
            const response = await api.get(`/transaction/${dataTransaksi.invoice}`);
            const serverStatus = response.data.data.status;
            
            if (serverStatus.toUpperCase() === 'PAID' || serverStatus.toUpperCase() === 'SUKSES') {
                setStatus('paid');
                clearInterval(checkInterval);
            }
        } catch (error) {
            console.error("Gagal cek status:", error);
        }
    }, 3000);

    return () => {
        clearInterval(timer);
        clearInterval(checkInterval);
    };
  }, [dataTransaksi, navigate, status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!dataTransaksi) return null;

  // tampilan sukses
  if (status === 'paid') {
      return (
        <div className="min-h-screen bg-gelap flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-abu border border-gray-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl animate-scale-up">
                
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h2>
                    <p className="text-gray-400 text-sm mb-8">Pesanan kamu sedang diproses sistem.</p>

                    <div className="bg-gelap/50 rounded-2xl p-6 border border-gray-700/50 text-left mb-8 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Invoice</span>
                            <span className="text-white font-mono font-bold">#{dataTransaksi.invoice}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src={dataTransaksi.item_image} alt="Item" className="w-12 h-12 rounded-md object-cover border border-gray-700" />
                            <div>
                                <p className="text-gray-400 text-xs mb-1">Item</p>
                                <p className="text-white font-bold">{dataTransaksi.item_name}</p>
                                <p className="text-emas text-xs">{dataTransaksi.game_name}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Total Bayar</p>
                            <p className="text-xl font-black text-white">Rp {dataTransaksi.total_price.toLocaleString()}</p>
                        </div>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-400 text-xs">Metode</span>
                            <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded text-xs">{dataTransaksi.payment_method}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-emas hover:bg-yellow-600 text-gelap font-semibold py-3 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Beli Item Lain
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // tampilan pending
  return (
    <div className="min-h-screen bg-gelap pb-20 pt-6 px-4">
       <div className="max-w-xl mx-auto">
          
          <div className="flex items-center gap-4 mb-6">
             <Link to="/" className="p-2 bg-abu rounded-full hover:bg-gray-700 transition-colors">
                <ChevronLeft className="text-white w-6 h-6" />
             </Link>
             <h1 className="text-xl font-bold text-white">Selesaikan Pembayaran</h1>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl flex items-start gap-3 mb-6 animate-pulse">
             <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />
             <p className="text-yellow-200/80 text-sm leading-relaxed">
                Scan QR di bawah ini. Halaman ini akan <b>otomatis update</b> jika pembayaran berhasil.
             </p>
          </div>

          <div className="bg-abu border border-gray-700 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emas/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

              <div className="p-6 relative z-10">
                  
                  <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                      <div>
                          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Batas Waktu</p>
                          <div className="text-emas font-black text-2xl font-mono flex items-center gap-2">
                              <Clock className="w-5 h-5 animate-spin-slow" />
                              {formatTime(timeLeft)}
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Invoice</p>
                          <p className="text-white font-bold font-mono">#{dataTransaksi.invoice}</p>
                      </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] max-w-[280px] mx-auto">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" className="h-6" />
                          <span className="text-[10px] text-gray-500 font-bold">NMID: ID12345678</span>
                      </div>
                      
                      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=AMBASTORE-${dataTransaksi.invoice}`} 
                            alt="QR Code" 
                            className="w-full h-full object-contain p-2" 
                          />
                      </div>
                  </div>

                  <div className="text-center mb-8">
                         <p className="text-white font-bold text-lg">{dataTransaksi.game_name}</p>
                         <p className="text-gray-400 text-sm">{dataTransaksi.item_name}</p>
                  </div>

                  <div className="bg-gelap rounded-xl p-4 border border-gray-600 mb-6 text-center">
                      <p className="text-gray-400 text-xs mb-1">Total Pembayaran</p>
                      <p className="text-3xl font-black text-white">Rp {dataTransaksi.total_price.toLocaleString()}</p>
                  </div>

                  <div className="space-y-3">
                      <button className="w-full bg-gelap border border-gray-600 text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Simpan QR Code
                      </button>
                  </div>

              </div>
              
              <div className="bg-gray-800/50 p-4 border-t border-gray-700 text-center">
                  <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Menunggu Pembayaran...
                  </p>
              </div>
          </div>

          <div className="mt-8">
              <h3 className="text-white font-bold mb-4 ml-1">Cara Pembayaran</h3>
              <div className="space-y-2">
                  {[1, 2, 3].map((step) => (
                      <div key={step} className="bg-abu border border-gray-700 rounded-xl p-4 flex gap-4 items-center">
                          <div className="bg-emas/10 text-emas font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-emas/20">
                              {step}
                          </div>
                          <p className="text-gray-300 text-sm">
                              {step === 1 && "Buka aplikasi E-Wallet (Gopay, OVO, Dana, dll) atau M-Banking."}
                              {step === 2 && "Scan QR Code yang ada di atas."}
                              {step === 3 && "Cek detail pembayaran dan selesaikan transaksi."}
                          </p>
                      </div>
                  ))}
              </div>
          </div>

       </div>
    </div>
  );
}