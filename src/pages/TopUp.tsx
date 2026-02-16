import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, X, Mail, Phone, TicketPercent, 
  Gamepad2, Wallet, User 
} from 'lucide-react';
import api from '../services/api';
import type { Game, Nominal, PaymentMethod } from '../types';

export default function TopUp() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState<Game | null>(null);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [serverId, setServerId] = useState("");
  const [nominalPilihan, setNominalPilihan] = useState<Nominal | null>(null);
  const [paymentPilihan, setPaymentPilihan] = useState<PaymentMethod | null>(null);

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [showModal, setShowModal] = useState(false);

  const servers = [
    { value: "asia", label: "Asia" },
    { value: "america", label: "America" },
    { value: "europe", label: "Europe" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, paymentRes] = await Promise.all([
          api.get(`/games/${id}`),
          api.get('/payments')
        ]);
        setGame(gameRes.data.data);
        setPayments(paymentRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
       <div className="w-12 h-12 border-4 border-emas border-t-transparent rounded-full animate-spin"></div>
       <p className="text-emas font-bold animate-pulse">Sedang memuat data...</p>
    </div>
  );
  
  if (!game) return <div className="text-center py-20 text-white">Game tidak ditemukan!</div>;

  const hargaAsli = nominalPilihan ? nominalPilihan.harga : 0;
  const pajak = hargaAsli * 0.11;
  const totalBayar = hargaAsli + pajak;
  
  const categories = Array.from(new Set(game.nominals.map(n => n.kategori)));

  const handleBeliSekarang = () => {
    if (!userId || 
       (!zoneId && game.input_type === 'id_zone') || 
       (!serverId && game.input_type === 'server_id') ||
       !nominalPilihan ||
       !paymentPilihan ||
       !email || !whatsapp
    ) {
        alert("Mohon dilengkapi semua data sebelum melanjutkan.");
        return;
    }
    setShowModal(true);
  }

  const handleFinalConfirm = async () => {
    const payload = {
        game_name: game?.nama,
        game_publisher: game?.publisher,
        item_name: nominalPilihan?.jumlah,
        user_id: userId,
        zone_id: zoneId,
        server_id: serverId,
        payment_method: paymentPilihan?.nama,
        price: hargaAsli,
        tax: pajak,
        total_price: totalBayar,
        email: email,
        whatsapp: whatsapp
    };

    try {
        const response = await api.post('/transaction', payload);
        if (response.data.sukses) {
            setShowModal(false);
            alert(`Invoice berhasil dibuat: ${response.data.data.invoice_code}`);
            navigate('/'); 
        }
    } catch (error) {
        console.error("Gagal transaksi:", error);
        alert("Transaksi gagal.");
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6">
      
      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-emas transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* kolum kiri */}
        <div className="lg:col-span-4">
            <div className="bg-abu/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-700/50 shadow-2xl sticky top-24 lg:text-left text-center">
                <div className="relative inline-block mb-4">
                    <img src={game.gambar} alt={game.nama} className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-2xl mx-auto shadow-lg ring-4 ring-emas/20" />
                    <div className="absolute -bottom-2 -right-2 bg-emas text-gelap font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                        Resmi
                    </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">{game.nama}</h2>
                <p className="text-emas font-medium text-sm mb-6">{game.publisher}</p>
                
                <div className="border-t border-gray-700 pt-4 space-y-3 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span>Jaminan Layanan 24 Jam</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        <span>Pembayaran Aman & Instan</span>
                    </div>
                </div>
            </div>
        </div>

        {/* kolum kanan */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* data akun */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg group hover:border-emas/30 transition-colors">
            <div className="bg-gelap/50 p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">1</div>
               <h3 className="text-lg font-bold text-white">Masukkan Data Akun</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">User ID</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Ketikan User ID" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)} 
                        />
                    </div>
                </div>

                {game.input_type === 'id_zone' && (
                     <div className="relative">
                        <label className="text-xs text-gray-400 mb-1 block ml-1">Zone ID</label>
                        <div className="relative">
                            <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Ketikan Zone ID" 
                                className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                                value={zoneId} 
                                onChange={(e) => setZoneId(e.target.value)} 
                            />
                        </div>
                    </div>
                )}
                
                {game.input_type === 'server_id' && (
                    <div className="relative">
                         <label className="text-xs text-gray-400 mb-1 block ml-1">Server</label>
                        <select 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 px-4 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none appearance-none font-medium" 
                            value={serverId} 
                            onChange={(e) => setServerId(e.target.value)}
                        >
                            <option value="">Pilih Server</option>
                            {servers.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                )}
                <p className="col-span-1 md:col-span-2 text-xs text-gray-500 italic mt-1">*Pastikan ID yang dimasukkan benar agar tidak salah kirim.</p>
            </div>
          </div>

          {/* pilih item */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg group hover:border-emas/30 transition-colors">
            <div className="bg-gelap/50 p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">2</div>
               <h3 className="text-lg font-bold text-white">Pilih Nominal</h3>
            </div>

            <div className="p-6">
                {categories.map((kategori) => (
                <div key={kategori} className="mb-8 last:mb-0">
                    <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emas"></span>
                        {kategori}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {game.nominals.filter(n => n.kategori === kategori).map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setNominalPilihan(item)}
                            className={`
                                relative p-4 rounded-2xl border text-left transition-all duration-300 group/btn overflow-hidden
                                ${nominalPilihan?.id === item.id 
                                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-emas shadow-[0_0_15px_rgba(234,179,8,0.3)] transform -translate-y-1' 
                                    : 'bg-gelap border-gray-700 hover:border-gray-500 hover:bg-gray-800'}
                            `}
                        >
                            <div className="font-black text-white text-sm md:text-base mb-2 z-10 relative">{item.jumlah}</div>
                            <div className="text-emas font-medium text-sm z-10 relative">Rp {item.harga.toLocaleString()}</div>
                            
                            <img src={game.gambar} className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10 grayscale group-hover/btn:grayscale-0 transition-all rotate-12" />
                            
                            {nominalPilihan?.id === item.id && (
                                <div className="absolute top-0 right-0 bg-emas text-gelap p-1 rounded-bl-xl shadow-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    ))}
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* pilih bayar */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg group hover:border-emas/30 transition-colors">
            <div className="bg-gelap/50 p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">3</div>
               <h3 className="text-lg font-bold text-white">Metode Pembayaran</h3>
            </div>
            
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {payments.map((pay) => (
                    <button 
                        key={pay.id}
                        onClick={() => setPaymentPilihan(pay)}
                        className={`
                            relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 h-28 bg-white
                            ${paymentPilihan?.id === pay.id 
                                ? 'border-emas ring-4 ring-emas/30 grayscale-0 transform scale-105 z-10' 
                                : 'border-gray-600 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 hover:scale-105 hover:shadow-lg'}
                        `}
                    >
                        <img src={pay.gambar} alt={pay.nama} className="h-8 object-contain" />
                        <div className="w-full border-t border-gray-200 mt-1"></div>
                        <span className="text-[10px] font-bold text-gray-800 text-center uppercase tracking-wide">{pay.nama}</span>
                        
                        {paymentPilihan?.id === pay.id && (
                            <div className="absolute top-2 right-2 text-green-600 animate-bounce">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
          </div>

          {/* detail kontak */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg group hover:border-emas/30 transition-colors">
            <div className="bg-gelap/50 p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">4</div>
               <h3 className="text-lg font-bold text-white">Detail Kontak</h3>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email Kamu" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block ml-1">WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="tel" 
                            placeholder="08xxxxxxxx" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* kode promo */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
             <div className="bg-gelap/50 p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">5</div>
               <h3 className="text-lg font-bold text-white">Kode Promo</h3>
            </div>
            <div className="p-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Masukkan Kode" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-white focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none uppercase tracking-wider font-bold"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                    </div>
                    <button className="bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white font-bold px-8 rounded-xl hover:from-emas hover:to-yellow-600 hover:text-gelap hover:border-emas transition-all">
                        Gunakan
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* float pay  */}
      {nominalPilihan && paymentPilihan && (
          <div className="fixed bottom-0 left-0 w-full bg-abu/90 backdrop-blur-md border-t border-gray-700 p-4 z-50 animate-slide-up shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:block bg-gelap p-3 rounded-xl border border-gray-700">
                        <Wallet className="w-6 h-6 text-emas" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Total Pembayaran</p>
                        <div className="text-3xl font-black text-emas drop-shadow-md">Rp {totalBayar.toLocaleString()}</div>
                        <p className="text-gray-500 text-xs">{nominalPilihan.jumlah} via {paymentPilihan.nama}</p>
                    </div>
                </div>
                <button 
                    onClick={handleBeliSekarang}
                    className="w-full md:w-auto bg-gradient-to-r from-emas to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gelap font-black py-4 px-12 rounded-xl text-lg shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <Wallet className="w-5 h-5" />
                    BELI SEKARANG
                </button>
            </div>
          </div>
      )}

      {/* modal konfirm */}
      {showModal && nominalPilihan && paymentPilihan && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-abu w-full max-w-md rounded-3xl border border-gray-600 shadow-2xl overflow-hidden animate-scale-up flex flex-col relative">
                  
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-emas" /> Konfirmasi Top Up
                      </h3>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white bg-gray-700 hover:bg-red-500 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="p-6 space-y-5">
                      <div className="flex items-center gap-4 bg-gelap p-4 rounded-2xl border border-gray-700">
                          <img src={game.gambar} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                          <div>
                              <div className="font-black text-white text-lg">{nominalPilihan.jumlah}</div>
                              <div className="text-sm text-gray-400">{game.nama} - {game.publisher}</div>
                          </div>
                      </div>

                      <div className="space-y-3 text-sm bg-gelap/30 p-4 rounded-xl border border-gray-700/50">
                          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                              <span className="text-gray-400">ID Akun</span>
                              <span className="font-bold text-white tracking-wide">{userId} {zoneId ? `(${zoneId})` : ''}</span>
                          </div>
                           <div className="flex justify-between items-start border-b border-gray-700 pb-2">
                              <span className="text-gray-400">Kontak</span>
                              <div className="text-right">
                                  <span className="font-bold text-white block">{email}</span>
                                  <span className="text-gray-400 text-xs">{whatsapp}</span>
                              </div>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-gray-400">Metode Bayar</span>
                              <span className="font-bold text-white bg-white/10 px-2 py-1 rounded text-xs">{paymentPilihan.nama}</span>
                          </div>
                      </div>

                      <div className="bg-gelap p-4 rounded-xl border border-dashed border-gray-600">
                          <div className="flex justify-between mb-1">
                              <span className="text-gray-400">Harga Item</span>
                              <span className="font-medium text-white">Rp {hargaAsli.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-3">
                              <span className="text-gray-400">Pajak (11%)</span>
                              <span className="font-medium text-white">Rp {pajak.toLocaleString()}</span>
                          </div>
                          <div className="border-t border-gray-600 pt-3 flex justify-between items-center">
                              <span className="text-gray-300 font-bold">Total Bayar</span>
                              <span className="text-xl font-black text-emas">Rp {totalBayar.toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  <div className="p-5 border-t border-gray-700 bg-gelap">
                      <button 
                        onClick={handleFinalConfirm}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform active:scale-95 transition-all flex justify-center items-center gap-2"                    >
                          Konfirmasi
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  );
}