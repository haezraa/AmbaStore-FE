import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, X, Mail, Phone, TicketPercent, 
  Gamepad2, Wallet, User, Zap, Search, AlertCircle
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

  const [nickname, setNickname] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = (message: string, type: "error" | "success" = "error") => {
      setToast({ show: true, message, type });
      setTimeout(() => {
          setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
  };

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
        console.error("Gagal ambil data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gelap">
       <div className="w-12 h-12 border-4 border-emas border-t-transparent rounded-full animate-spin"></div>
       <p className="text-emas font-bold animate-pulse">Sabar ya bos...</p>
    </div>
  );
  
  if (!game) return <div className="text-center py-20 text-terang">Game tidak ditemukan!</div>;

  const hargaAsli = nominalPilihan ? nominalPilihan.harga : 0;
  const pajak = hargaAsli * 0.11;
  const totalBayar = hargaAsli + pajak;
  
  const categories = Array.from(new Set(game.nominals.map(n => n.kategori)));

  const handleCekNickname = async () => {
      if (!userId) return showToast("User ID wajib diisi", "error");
      if (game?.input_type === 'id_zone' && !zoneId) return showToast("Zone ID juga wajib diisi", "error");

      setIsChecking(true);
      setNickname(""); 

      try {
          const response = await api.post('/check-nickname', {
              user_id: userId,
              zone_id: zoneId
          });

          if (response.data.sukses) {
              setNickname(response.data.nickname); 
              showToast("Nickname berhasil ditemukan!", "success");
          }
      } catch (error: any) {
          const pesanError = error.response?.data?.pesan || "Gagal cek nickname. Coba lagi ya.";
          showToast(pesanError, "error");
      } finally {
          setIsChecking(false); 
      }
  }

  const handleBeliSekarang = () => {
    if (!userId || 
       (!zoneId && game.input_type === 'id_zone') || 
       (!serverId && game.input_type === 'server_id') ||
       !nominalPilihan ||
       !paymentPilihan ||
       !email || !whatsapp
    ) {
        showToast("Lengkapi dulu data nya", "error");
        return;
    }
    
    if (!nickname && (game.input_type === 'id_zone')) {
        showToast("Cek Nickname terlebih dahulu", "error");
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
            const dataBackend = response.data.data; 
            setShowModal(false);
            
            navigate(`/payment/${dataBackend.invoice_code}`, { 
                state: {
                    invoice: dataBackend.invoice_code,
                    game_name: dataBackend.game_name,
                    item_name: dataBackend.item_name,
                    item_image: (nominalPilihan as any).image ? (nominalPilihan as any).image : game.gambar,
                    total_price: dataBackend.total_price,
                    payment_method: dataBackend.payment_method,
                    status: dataBackend.status
                } 
            });
        } else {
            showToast("Gagal membuat transaksi dari server!", "error");
        }
    } catch (error) {
        console.error("Error transaksi:", error);
        showToast("Server error.", "error");
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 pt-6 relative">
      
      {/* popup notif */}
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-out flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'} ${toast.type === 'error' ? 'bg-red-500/95 border-red-400 text-white backdrop-blur-md' : 'bg-green-600/95 border-green-400 text-white backdrop-blur-md'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-6 h-6 flex-shrink-0" /> : <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
          <span className="font-bold text-sm md:text-base">{toast.message}</span>
      </div>

      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-emas transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* kolum kiri */}
        <div className="lg:col-span-4">
            <div className="bg-abu shadow-2xl p-6 rounded-3xl border border-gray-700/50 sticky top-28 text-center lg:text-left">
                <div className="relative inline-block lg:block mb-6">
                     <img src={game.gambar} alt={game.nama} className="w-40 h-40 object-cover rounded-2xl shadow-lg ring-2 ring-emas/50 mx-auto lg:mx-0" />
                </div>
                
                <h2 className="text-3xl font-black text-terang mb-2">{game.nama}</h2>
                <p className="text-emas font-medium text-sm mb-6 uppercase tracking-wider">{game.publisher}</p>
                
                <div className="text-gray-400 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: game.deskripsi}}></div>
                
                <div className="border-t border-gray-700 pt-4 space-y-3 text-sm text-gray-300">
                     <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <Zap className="w-4 h-4 text-emas" /> Proses Detik-an
                    </div>
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Jaminan Aman 100%
                    </div>
                </div>
            </div>
        </div>

        {/* kolum kanan */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* id akun */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">1</div>
               <h3 className="text-lg font-bold text-terang">Masukkan ID Akun</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">User ID</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Contoh: 12345678" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                            value={userId} 
                            onChange={(e) => {setUserId(e.target.value); setNickname("");}} 
                        />
                    </div>
                </div>

                {game.input_type === 'id_zone' && (
                     <div className="relative">
                        <label className="text-xs text-gray-400 mb-1 block ml-1">Zone ID</label>
                        <div className="relative">
                            <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Contoh: 2024" 
                                className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                                value={zoneId} 
                                onChange={(e) => {setZoneId(e.target.value); setNickname("");}} 
                            />
                        </div>
                    </div>
                )}
                
                {/* cek nn */}
                <div className="col-span-1 md:col-span-2 mt-2 flex flex-col sm:flex-row gap-4 items-start">
                    <button 
                        onClick={handleCekNickname}
                        disabled={isChecking}
                        className="bg-gray-700 hover:bg-emas hover:text-gelap text-terang font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
                    >
                        {isChecking ? (
                            <div className="w-5 h-5 border-2 border-terang border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        {isChecking ? "Mencari..." : "Cek Nickname"}
                    </button>

                    {nickname && (
                        <div className="w-full sm:w-auto inline-flex bg-green-500/10 border border-green-500/30 rounded-xl p-3 items-center gap-3 animate-fade-in h-[52px]">
                            <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" />
                            <div className="pr-2">
                                <p className="text-gray-400 text-[10px] uppercase tracking-wider leading-tight">Nickname Ditemukan</p>
                                <p className="text-terang font-bold text-sm leading-tight">{nickname}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
          </div>

          {/* pilih item */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">2</div>
               <h3 className="text-lg font-bold text-terang">Pilih Nominal</h3>
            </div>

            <div className="p-6">
                {categories.map((kategori) => (
                <div key={kategori} className="mb-8 last:mb-0">
                    <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-emas pl-3">
                        {kategori}
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {game.nominals.filter(n => n.kategori === kategori).map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setNominalPilihan(item)}
                            className={`
                                relative flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-300 border h-full min-h-[100px] overflow-hidden group
                                ${nominalPilihan?.id === item.id 
                                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-emas shadow-lg transform -translate-y-1' 
                                    : 'bg-gelap border-gray-700 hover:border-gray-500 hover:bg-gray-800'}
                            `}
                        >
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="font-bold text-terang text-sm md:text-base leading-tight">
                                    {item.jumlah}
                                </span>
                                <img 
                                    src={(item as any).image ? (item as any).image : game.gambar} 
                                    alt="icon" 
                                    className="w-8 h-8 object-cover rounded-md flex-shrink-0" 
                                />
                            </div>

                            <div className="mt-auto pt-2 border-t border-gray-700/50">
                                <span className={`text-xs md:text-sm font-semibold ${nominalPilihan?.id === item.id ? 'text-emas' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                    Rp {item.harga.toLocaleString()}
                                </span>
                            </div>

                            {nominalPilihan?.id === item.id && (
                                <div className="absolute top-0 right-0 bg-emas w-6 h-6 rounded-bl-xl flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gelap" />
                                </div>
                            )}
                        </button>
                    ))}
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* pembayaran */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">3</div>
               <h3 className="text-lg font-bold text-terang">Metode Pembayaran</h3>
            </div>
            
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {payments.map((pay) => (
                    <button 
                        key={pay.id}
                        onClick={() => setPaymentPilihan(pay)}
                        className={`
                            relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 h-24 bg-terang overflow-hidden
                            ${paymentPilihan?.id === pay.id 
                                ? 'border-emas ring-4 ring-emas/30 transform scale-105 z-10' 
                                : 'border-gray-200 hover:scale-105 hover:shadow-lg'}
                        `}
                    >
                        <img src={pay.gambar} alt={pay.nama} className="h-8 object-contain" />
                        <span className="text-[10px] font-bold text-gray-800 text-center uppercase tracking-wide mt-1">{pay.nama}</span>
                        
                        {paymentPilihan?.id === pay.id && (
                            <div className="absolute top-0 right-0 bg-emas w-6 h-6 rounded-bl-xl flex items-center justify-center shadow-md animate-fade-in">
                                <CheckCircle2 className="w-3.5 h-3.5 text-gelap" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
          </div>

          {/* detail kontak */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">4</div>
               <h3 className="text-lg font-bold text-terang">Detail Kontak</h3>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email Kamu" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all"
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
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* kode promo */}
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
             <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">5</div>
               <h3 className="text-lg font-bold text-terang">Kode Promo</h3>
            </div>
            <div className="p-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Masukkan Kode" 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none uppercase tracking-wider font-bold"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                    </div>
                    <button className="bg-gray-700 border border-gray-600 text-white font-bold px-8 rounded-xl hover:bg-emas hover:text-gelap hover:border-emas transition-all">
                        Gunakan
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* float view */}
      {nominalPilihan && paymentPilihan && (
          <div className="fixed bottom-0 left-0 w-full bg-abu/95 backdrop-blur-xl border-t border-gray-700 p-4 z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto pl-2">
                    <div className="bg-gelap p-3 rounded-xl border border-gray-600 hidden md:block">
                        <Wallet className="w-6 h-6 text-emas" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Total Pembayaran</p>
                        <div className="text-3xl font-black text-emas drop-shadow-md">Rp {totalBayar.toLocaleString()}</div>
                        <p className="text-terang text-sm font-medium mt-1 flex items-center gap-2">
                            {nominalPilihan.jumlah} <span className="text-gray-500">|</span> {paymentPilihan.nama}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleBeliSekarang}
                    className="w-full md:w-auto bg-emas hover:bg-yellow-500 text-gelap font-black py-4 px-12 rounded-xl text-lg shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    BELI SEKARANG
                </button>
            </div>
          </div>
      )}

      {/* modal konfir */}
      {showModal && nominalPilihan && paymentPilihan && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-abu w-full max-w-md rounded-3xl border border-gray-600 shadow-2xl overflow-hidden flex flex-col relative">
                  <div className="bg-gelap p-5 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-terang">Konfirmasi Top Up</h3>
                      <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-terang" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 bg-gelap p-4 rounded-xl border border-gray-700">
                          <img src={(nominalPilihan as any).image || game.gambar} className="w-16 h-16 rounded-lg object-cover" />
                          <div>
                              <div className="font-bold text-terang text-lg">{nominalPilihan.jumlah}</div>
                              <div className="text-sm text-gray-400">{game.nama}</div>
                          </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between items-center">
                              <span>User ID:</span> 
                              <span className="text-terang font-bold">{userId}</span>
                          </div>
                          
                          {zoneId && (
                              <div className="flex justify-between items-center">
                                  <span>Zone ID:</span> 
                                  <span className="text-terang font-bold">{zoneId}</span>
                              </div>
                          )}

                          {nickname && (
                              <div className="flex justify-between items-center">
                                  <span>Nickname:</span> 
                                  <span className="text-terang font-bold">{nickname}</span>
                              </div>
                          )}

                          <div className="flex justify-between items-center">
                              <span>WhatsApp:</span> 
                              <span className="text-terang font-bold">{whatsapp}</span>
                          </div>

                          <div className="flex justify-between items-center">
                              <span>Metode Bayar:</span> 
                              <span className="text-terang font-bold bg-white/10 px-2 py-0.5 rounded text-xs">{paymentPilihan.nama}</span>
                          </div>
                          
                          <div className="border-t border-gray-600 my-3 border-dashed"></div>
                          
                          <div className="flex justify-between">
                              <span>Harga Item:</span> 
                              <span>Rp {hargaAsli.toLocaleString()}</span>
                          </div>
                           <div className="flex justify-between">
                              <span>Pajak (11%):</span> 
                              <span>Rp {pajak.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between text-lg font-bold text-emas pt-2 border-t border-gray-600 mt-2">
                              <span>Total Bayar:</span> 
                              <span>Rp {totalBayar.toLocaleString()}</span>
                          </div>
                      </div>

                      <button onClick={handleFinalConfirm} className="w-full bg-emas text-gelap hover:bg-yellow-500 font-bold py-3 rounded-xl mt-4 shadow-lg">
                          GAS BAYAR
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}