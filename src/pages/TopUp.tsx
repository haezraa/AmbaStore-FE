import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, X, Mail, Phone, TicketPercent, 
  Gamepad2, Wallet, User, Zap, AlertCircle, HelpCircle
} from 'lucide-react';
import api from '../services/api';
import type { Game, Nominal, PaymentMethod } from '../types';

const getGameConfig = (gameName: string) => {
    switch (gameName) {
        case 'Mobile Legends':
            return {
                placeholder1: "Masukkan User ID",
                placeholder2: "Masukkan Zone ID",
                tip: "Untuk mengetahui User ID Anda, silakan klik menu profile dibagian kiri atas pada menu utama game. User ID akan terlihat dibagian bawah Nama Karakter Game Anda. Silakan masukkan User ID Anda untuk menyelesaikan transaksi. Contoh : 12345678(1234).",
                servers: []
            };
        case 'Free Fire':
            return {
                placeholder1: "Masukkan Player ID",
                tip: "Untuk menemukan ID Anda, klik pada ikon karakter. User ID tercantum di bawah nama karakter Anda. Contoh: '5363266446'.",
                servers: []
            };
        case 'Call of Duty: Mobile':
            return {
                placeholder1: "Masukkan Player ID",
                tip: "Untuk menemukan PlayerID Anda, klik ikon 'settings' yang terletak di sebelah kanan layar dan klik tab 'LEGAL AND PRIVACY', Anda dapat menemukan PlayerID Anda di sini.",
                servers: []
            };
        case 'Genshin Impact':
            return {
                placeholder1: "Masukkan UID",
                tip: "Untuk menemukan UID Anda, masuk pakai akun Anda. Klik pada tombol profile di pojok kiri atas layar. Temukan UID dibawah avatar. Masukan UID Anda di sini. Selain itu, Anda juga dapat temukan UID Anda di pojok bawah kanan layar.",
                servers: [
                    { value: "os_asia", label: "Asia" },
                    { value: "os_usa", label: "America" },
                    { value: "os_euro", label: "Europe" },
                    { value: "os_cht", label: "TW, HK, MO" }
                ]
            };
        case 'Valorant':
            return {
                placeholder1: "Masukkan Riot ID",
                tip: "Untuk menemukan Riot ID Anda, buka halaman profil akun dan salin Riot ID+Tag menggunakan tombol yang tersedia disamping Riot ID. (Contoh: Westbourne#SEA)",
                servers: []
            };
        case 'Honkai: Star Rail':
            return {
                placeholder1: "Masukkan UID",
                tip: "Untuk menemukan UID Anda, masuk ke akun di aplikasi Anda. UID selalu berada di pojok kiri bawah layar. UID juga dapat ditemukan di Phone Menu.",
                servers: [
                    { value: "prod_official_asia", label: "Asia" },
                    { value: "prod_official_usa", label: "America" },
                    { value: "prod_official_eur", label: "Europe" },
                    { value: "prod_official_cht", label: "TW, HK, MO" }
                ]
            };
        case 'Zenless Zone Zero':
            return {
                placeholder1: "Masukkan UID",
                tip: "Untuk menemukan UID Anda, masuklah ke akun Anda di dalam aplikasi. Ketuk nama pengguna Anda di sudut kiri atas, dan UID akan ditampilkan di sebelah kiri.",
                servers: [
                    { value: "prod_gf_jp", label: "Asia" },
                    { value: "prod_gf_us", label: "America" },
                    { value: "prod_gf_eu", label: "Europe" },
                    { value: "prod_gf_sg", label: "TW, HK, MO" }
                ]
            };
        case 'Magic Chess: Go Go':
            return {
                placeholder1: "Masukkan User ID",
                placeholder2: "Masukkan Zone ID",
                tip: "Login ke dalam Game, Tap pada Avatar di pojok kiri atas untuk memasuki halaman informasi dasar dan mengecek ID Anda.",
                servers: []
            };
        case 'Punishing: Gray Raven':
            return {
                placeholder1: "Masukkan Role ID",
                tip: "Login ke akun game untuk menemukan Role ID Punishing: Gray Raven. Cek Profil di pojok kiri atas layarmu dan temukan 8-digit Role ID dibawah level dan nickname. Silakan enter Role ID disini.",
                servers: [
                    { value: "Asia-Pacific", label: "Asia-Pacific" },
                    { value: "Europe", label: "Europe" },
                    { value: "North America", label: "North America" }
                ]
            };
        case 'Arena of Valor':
            return {
                placeholder1: "Masukkan Player ID",
                tip: "Untuk menemukan User ID Anda, Ketuk ikon pengaturan, scroll ke bawah, temukan bagian \"Umum\", lalu Klik \"Player ID\". Contoh: \"888347346994333\".",
                servers: []
            };
        default:
            return {
                placeholder1: "Masukkan User ID",
                tip: "Masukkan ID Anda yang valid.",
                servers: []
            };
    }
};

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
  const [isNotFound, setIsNotFound] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = (message: string, type: "error" | "success" = "error") => {
      setToast({ show: true, message, type });
      setTimeout(() => { setToast((prev) => ({ ...prev, show: false })); }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, paymentRes] = await Promise.all([
          api.get(`/games/${id}`),
          api.get('/payments')
        ]);
        const gameData = gameRes.data.data;
        setGame(gameData);
        setPayments(paymentRes.data.data);
        setLoading(false);

        const config = getGameConfig(gameData.nama);
        if (config.servers.length > 0) {
            setServerId(config.servers[0].value);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
      if (!game) return;

      const config = getGameConfig(game.nama);
      let isReady = false;

      if (config.placeholder2) {
          isReady = userId.trim() !== "" && zoneId.trim() !== "";
      } else if (config.servers.length > 0) {
          isReady = userId.trim() !== "" && serverId.trim() !== "";
      } else {
          isReady = userId.trim() !== "";
      }

      if (isReady) {
          setIsChecking(true);
          setNickname("");
          setIsNotFound(false);

          const delayDebounceFn = setTimeout(async () => {
              try {
                  const response = await api.post('/check-nickname', {
                      game_name: game.nama,
                      user_id: userId,
                      zone_id: zoneId,
                      server_id: serverId 
                  });

                  if (response.data.sukses) {
                      setNickname(response.data.nickname); 
                      setIsNotFound(false);
                  }
              } catch (error) {
                  setNickname("");
                  setIsNotFound(true);
              } finally {
                  setIsChecking(false);
              }
          }, 1000); 

          return () => clearTimeout(delayDebounceFn);
      } else {
          setNickname("");
          setIsChecking(false);
          setIsNotFound(false);
      }
  }, [userId, zoneId, serverId, game]);


  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

  const gameConfig = game ? getGameConfig(game.nama) : null;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gelap">
       <div className="w-12 h-12 border-4 border-emas border-t-transparent rounded-full animate-spin"></div>
       <p className="text-emas font-bold animate-pulse">Memuat data...</p>
    </div>
  );
  
  if (!game) return <div className="text-center py-20 text-terang">Game tidak ditemukan.</div>;

  const hargaAsli = nominalPilihan ? nominalPilihan.harga : 0;
  const pajak = hargaAsli * 0.11;
  const totalBayar = hargaAsli + pajak;
  
  const categories = Array.from(new Set(game.nominals.map(n => n.kategori)));

  const handleBeliSekarang = () => {
    if (!userId || 
       (!zoneId && gameConfig?.placeholder2) || 
       (!serverId && gameConfig && gameConfig.servers.length > 0) ||
       !nominalPilihan ||
       !paymentPilihan ||
       !email || !whatsapp
    ) {
        showToast("Silakan isi data pesanan terlebih dahulu.", "error");
        return;
    }
    
    if (isChecking) {
        showToast("Sedang memeriksa Nickname, silakan tunggu.", "error");
        return;
    }
    if (!nickname) {
        showToast("ID tidak ditemukan. Silakan periksa kembali data akun Anda.", "error");
        return;
    }

    setShowModal(true);
  }

  const handleFinalConfirm = async () => {
    const payload = {
        game_name: game.nama,
        game_publisher: game.publisher,
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
            showToast("Gagal membuat transaksi. Silakan coba kembali.", "error");
        }
    } catch (error) {
        console.error("Error transaksi:", error);
        showToast("Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.", "error");
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-40 pt-6 relative">
      
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-out flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'} ${toast.type === 'error' ? 'bg-red-500/95 border-red-400 text-white backdrop-blur-md' : 'bg-green-600/95 border-green-400 text-white backdrop-blur-md'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-6 h-6 flex-shrink-0" /> : <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
          <span className="font-bold text-sm md:text-base">{toast.message}</span>
      </div>

      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-emas transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        
        <div className="lg:col-span-4">
            <div className="bg-abu shadow-2xl p-6 rounded-3xl border border-gray-700/50 sticky top-28 text-center lg:text-left">
                <div className="relative inline-block lg:block mb-6">
                     <img src={game.gambar} alt={game.nama} className="w-40 h-40 object-cover rounded-2xl shadow-lg ring-2 ring-emas/50 mx-auto lg:mx-0" />
                </div>
                <h2 className="text-3xl font-bold text-terang mb-2">{game.nama}</h2>
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

        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">1</div>
               <h3 className="text-lg font-bold text-terang">Masukkan Data Akun</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">{gameConfig?.placeholder1}</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder={gameConfig?.placeholder1} 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)} 
                        />
                    </div>
                </div>

                {gameConfig?.placeholder2 && (
                     <div className="relative">
                        <label className="text-xs text-gray-400 mb-1 block ml-1">{gameConfig?.placeholder2}</label>
                        <div className="relative">
                            <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder={gameConfig?.placeholder2} 
                                className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                                value={zoneId} 
                                onChange={(e) => setZoneId(e.target.value)} 
                            />
                        </div>
                    </div>
                )}
                
                {gameConfig && gameConfig.servers.length > 0 && (
                    <div className="relative">
                         <label className="text-xs text-gray-400 mb-1 block ml-1">Pilih Server</label>
                        <select 
                            className="w-full bg-gelap border border-gray-600 rounded-xl py-3 px-4 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none appearance-none font-medium h-[50px] cursor-pointer" 
                            value={serverId} 
                            onChange={(e) => setServerId(e.target.value)}
                        >
                            {gameConfig.servers.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                )}
                
                {(isChecking || nickname || isNotFound) && (
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-1">
                        {isChecking && (
                            <div className="flex items-center gap-2 text-emas text-sm animate-pulse ml-1">
                                <div className="w-4 h-4 border-2 border-emas border-t-transparent rounded-full animate-spin"></div>
                                Mencari Nickname...
                            </div>
                        )}
                        {!isChecking && nickname && (
                            <div className="w-full sm:w-auto inline-flex bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5 items-center gap-3 animate-fade-in self-start">
                                <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider leading-tight">Nickname Ditemukan</p>
                                    <p className="text-terang font-bold text-sm leading-tight">{nickname}</p>
                                </div>
                            </div>
                        )}
                        {!isChecking && isNotFound && (
                            <div className="flex items-center gap-2 text-red-400 text-sm ml-1 animate-fade-in">
                                <AlertCircle className="w-4 h-4" />
                                ID tidak ditemukan atau salah.
                            </div>
                        )}
                    </div>
                )}

                {gameConfig?.tip && (
                    <div className={`col-span-1 md:col-span-2 flex items-start gap-3 ${(isChecking || nickname || isNotFound) ? 'mt-4' : 'mt-1'}`}>
                        <HelpCircle className="text-emas w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                            {gameConfig.tip}
                        </p>
                    </div>
                )}
            </div>
          </div>

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
                                <img src={(item as any).image ? (item as any).image : game.gambar} alt="icon" className="w-8 h-8 object-cover rounded-md flex-shrink-0" />
                            </div>
                            <div className="mt-auto pt-2 border-t border-gray-700/50">
                                <span className={`text-xs md:text-sm font-semibold ${nominalPilihan?.id === item.id ? 'text-emas' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                    Rp {item.harga.toLocaleString('id-ID')}
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
                        <input type="email" placeholder="Email Kamu" className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block ml-1">WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input type="tel" placeholder="08xxxxxxxx" className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-abu rounded-3xl border border-gray-700/50 overflow-hidden shadow-lg">
             <div className="bg-gelap p-4 border-b border-gray-700/50 flex items-center gap-3">
               <div className="bg-emas w-8 h-8 rounded-lg flex items-center justify-center text-gelap font-black text-lg">5</div>
               <h3 className="text-lg font-bold text-terang">Kode Promo</h3>
            </div>
            <div className="p-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input type="text" placeholder="Masukkan Kode Promo" className="w-full bg-gelap border border-gray-600 rounded-xl py-3 pl-10 text-terang focus:border-emas focus:ring-1 focus:ring-emas focus:outline-none transition-all" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    </div>
                    <button className="bg-gray-700 border border-gray-600 text-white font-bold px-8 rounded-xl hover:bg-emas hover:text-gelap hover:border-emas transition-all">Gunakan</button>
                </div>
            </div>
          </div>

        </div>
      </div>

      {nominalPilihan && paymentPilihan && (
          <div className="fixed bottom-0 left-0 w-full bg-abu/95 backdrop-blur-xl border-t border-gray-700 p-4 z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-2 md:px-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-gelap p-3 rounded-xl border border-gray-600 hidden md:block">
                        <Wallet className="w-6 h-6 text-emas" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Total Pembayaran</p>
                        <div className="text-3xl font-bold text-emas drop-shadow-md">Rp {totalBayar.toLocaleString('id-ID')}</div>
                        <p className="text-terang text-sm font-medium mt-1 flex items-center gap-2">
                            {nominalPilihan.jumlah} <span className="text-gray-500">|</span> {paymentPilihan.nama}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleBeliSekarang}
                    className="w-full md:w-auto bg-emas hover:bg-yellow-500 text-gelap font-bold py-4 px-12 rounded-xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    BELI SEKARANG
                </button>
            </div>
          </div>
      )}

      {showModal && nominalPilihan && paymentPilihan && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-abu w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
                  
                  <div className="p-5 flex justify-between items-start">
                      <div>
                          <h3 className="text-xl font-bold text-terang">Detail pesanan</h3>
                          <p className="text-sm text-gray-400 mt-1">Mohon konfirmasi detail pesanan Anda sudah benar.</p>
                      </div>
                      <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-terang w-6 h-6" /></button>
                  </div>

                  <div className="px-5 pb-5 space-y-5">
                      <div className="flex items-center gap-4 bg-gelap/50 p-4 rounded-xl border border-gray-700/50">
                          <img src={(nominalPilihan as any).image || game.gambar} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="font-bold text-terang">{nominalPilihan.jumlah}</div>
                      </div>

                      <div className="space-y-4 text-sm">
                          {nickname && (
                              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                                  <span className="text-gray-400">Nickname:</span> 
                                  <span className="text-terang font-bold">{nickname}</span>
                              </div>
                          )}
                          <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                              <span className="text-gray-400">ID:</span> 
                              <span className="text-terang font-bold">
                                  {userId}{zoneId ? `(${zoneId})` : serverId ? `(${serverId})` : ''}
                              </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                              <span className="text-gray-400">Bayar dengan:</span> 
                              <span className="text-terang font-bold">{paymentPilihan.nama}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                              <span className="text-gray-400">Harga:</span> 
                              <span className="text-terang font-bold">Rp {hargaAsli.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between items-center pb-1">
                              <span className="text-gray-400">Pajak: (11%)</span> 
                              <span className="text-terang font-bold">Rp {pajak.toLocaleString('id-ID')}</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-gelap p-5 border-t border-gray-700/50 flex justify-between items-center">
                      <div>
                          <p className="text-gray-400 text-xs mb-1">Total pembayaran</p>
                          <div className="text-2xl font-bold text-emas">Rp {totalBayar.toLocaleString('id-ID')}</div>
                      </div>
                      <button onClick={handleFinalConfirm} className="bg-emas text-gelap hover:bg-yellow-500 font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors">
                          Konfirm
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  );
}