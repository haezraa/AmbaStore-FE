import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { ArrowLeft, CheckCircle2, ShieldCheck, X, Mail, Phone, TicketPercent } from 'lucide-react';
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

  if (loading) return <div className="text-center py-20 text-emas font-bold animate-pulse">Loading...</div>;
  if (!game) return <div>Game gak ketemu!</div>;

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
        alert("Mohon lengkapi semua data (Akun, Item, Pembayaran, dan Kontak) dulu ya Bro! 😡");
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
            alert(`SUKSES! Invoice: ${response.data.data.invoice_code}`);
            
            navigate('/'); 
        }
    } catch (error) {
        console.error("Gagal transaksi:", error);
        alert("Waduh, gagal bikin transaksi Bro! Coba lagi.");
    }
  }

  return (
    <div className="w-full animate-fade-in-up px-4 md:px-0 pb-40">
      
      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-400 hover:text-emas font-medium">
        <ArrowLeft className="w-5 h-5" /> Kembali
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-xl sticky top-24 text-center">
            <img src={game.gambar} alt={game.nama} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-2 border-emas" />
            <h2 className="text-2xl font-bold text-emas">{game.nama}</h2>
            <p className="text-terang text-sm mb-4">{game.publisher}</p>
            </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          
          {/* data akun */}
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
            <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
              Data Akun
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" placeholder="User ID / UID" className="flex-1 bg-gelap border border-gray-600 rounded-lg p-3 text-terang focus:border-emas focus:outline-none" value={userId} onChange={(e) => setUserId(e.target.value)} />
              {game.input_type === 'id_zone' && (
                <input type="text" placeholder="Zone ID" className="w-full md:w-1/3 bg-gelap border border-gray-600 rounded-lg p-3 text-terang focus:border-emas focus:outline-none" value={zoneId} onChange={(e) => setZoneId(e.target.value)} />
              )}
              {game.input_type === 'server_id' && (
                <select className="w-full md:w-1/3 bg-gelap border border-gray-600 rounded-lg p-3 text-terang focus:border-emas focus:outline-none" value={serverId} onChange={(e) => setServerId(e.target.value)}>
                  <option value="">Pilih Server</option>
                  {servers.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* pilih item */}
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
            <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
              Pilih Item
            </h3>
            {categories.map((kategori) => (
              <div key={kategori} className="mb-6 last:mb-0">
                <h4 className="text-emas font-bold text-sm uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">{kategori}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {game.nominals.filter(n => n.kategori === kategori).map((item) => (
                    <button key={item.id} onClick={() => setNominalPilihan(item)}
                      className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${nominalPilihan?.id === item.id ? 'bg-emas/10 border-emas ring-1 ring-emas' : 'bg-gelap border-transparent hover:border-gray-500'}`}
                    >
                      <div className="font-bold text-sm text-terang mb-1">{item.jumlah}</div>
                      <div className="text-emas font-mono font-semibold text-sm">Rp {item.harga.toLocaleString()}</div>
                      {nominalPilihan?.id === item.id && <CheckCircle2 className="absolute top-2 right-2 text-emas w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 3. PEMBAYARAN */}
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
             <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
              Pilih Pembayaran
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {payments.map((pay) => (
                    <button 
                        key={pay.id}
                        onClick={() => setPaymentPilihan(pay)}
                        className={`
                            p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all h-24 bg-white
                            ${paymentPilihan?.id === pay.id 
                                ? 'border-emas ring-2 ring-emas bg-white' 
                                : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'}
                        `}
                    >
                        <img src={pay.gambar} alt={pay.nama} className="h-8 object-contain" />
                        <span className="text-xs font-bold text-gray-800 text-center">{pay.nama}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* detail kontak */}
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
            <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">4</span>
              Detail Kontak
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="email" 
                        placeholder="Email Kamu (buat kirim bukti)" 
                        className="w-full bg-gelap border border-gray-600 rounded-lg p-3 pl-10 text-terang focus:border-emas focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="tel" 
                        placeholder="No. WhatsApp (08xxxxxxxx)" 
                        className="w-full bg-gelap border border-gray-600 rounded-lg p-3 pl-10 text-terang focus:border-emas focus:outline-none"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                    />
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">*Tenang aja, data lu aman. Cuma buat jaga-jaga kalau diamond nyangkut.</p>
          </div>

          {/* kode */}
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
             <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">5</span>
              Kode Promo
            </h3>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <TicketPercent className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Punya kode promo? Masukin sini!" 
                        className="w-full bg-gelap border border-gray-600 rounded-lg p-3 pl-10 text-terang focus:border-emas focus:outline-none uppercase"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                </div>
                <button className="bg-gelap border border-emas text-emas font-bold px-6 rounded-lg hover:bg-emas hover:text-gelap transition-colors">
                    Gunakan
                </button>
            </div>
          </div>

        </div>
      </div>

      {nominalPilihan && paymentPilihan && (
          <div className="fixed bottom-0 left-0 w-full bg-abu border-t border-gray-700 p-4 z-40 animate-slide-up shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:block">
                        <p className="text-gray-400 text-sm">{nominalPilihan.jumlah}</p>
                        <p className="text-gray-400 text-xs">Via {paymentPilihan.nama}</p>
                    </div>
                    <div className="flex-1 md:flex-none">
                        <div className="text-2xl font-black text-emas">Rp {totalBayar.toLocaleString()}</div>
                    </div>
                </div>
                <button 
                    onClick={handleBeliSekarang}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
                >
                    Beli Sekarang
                </button>
            </div>
          </div>
      )}

      {/* modal pembayaran*/}
      {showModal && nominalPilihan && paymentPilihan && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-abu w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
                  
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gelap">
                      <h3 className="text-lg font-bold text-terang">Detail Pesanan</h3>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>

                  <div className="p-6 space-y-4 overflow-y-auto">
                      <div className="flex items-center gap-4 bg-gelap p-3 rounded-xl border border-gray-700">
                          <img src={game.gambar} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                              <div className="font-bold text-terang">{nominalPilihan.jumlah}</div>
                              <div className="text-xs text-gray-400">{game.nama}</div>
                          </div>
                      </div>

                      <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                              <span className="text-gray-400">ID Akun:</span>
                              <span className="font-bold text-terang">{userId} {zoneId ? `(${zoneId})` : ''}</span>
                          </div>
                           <div className="flex justify-between">
                              <span className="text-gray-400">Kontak:</span>
                              <span className="font-bold text-terang text-right">{email}<br/>{whatsapp}</span>
                          </div>
                          <div className="my-2 border-t border-gray-700 border-dashed"></div>
                          <div className="flex justify-between">
                              <span className="text-gray-400">Harga:</span>
                              <span className="font-medium text-terang">Rp {hargaAsli.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-400">Pajak (11%):</span>
                              <span className="font-medium text-terang">Rp {pajak.toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 bg-gelap border-t border-gray-700 flex justify-between items-center mt-auto">
                      <div>
                          <p className="text-xs text-gray-400">Total Pembayaran</p>
                          <p className="text-xl font-black text-emas">Rp {totalBayar.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={handleFinalConfirm}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg"
                      >
                          Konfirmasi
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  );
}