import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import type { Game, Nominal } from '../types'; 

export default function TopUp() {
  const { id } = useParams(); 
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [nominalPilihan, setNominalPilihan] = useState<Nominal | null>(null);

  useEffect(() => {
    const fetchDetailGame = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data.data); 
        setLoading(false); 
      } catch (error) {
        console.error("Gagal narik detail game:", error);
        setLoading(false);
      }
    };

    fetchDetailGame();
  }, [id]); 

  if (loading) {
    return <div className="text-center py-20 text-emas font-bold animate-pulse text-xl">Loading...</div>;
  }

  if (!game) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-emas mb-4">Game Tidak Ditemukan</h2>
        <Link to="/" className="text-terang hover:text-emas underline">Kembali ke Home</Link>
      </div>
    );
  }

  const handleBayar = () => {
    if (!userId || !zoneId || !nominalPilihan) {
      alert("Mohon isi data terlebih dahulu");
      return;
    }
    alert(` \nGame: ${game.nama} \nID: ${userId} (${zoneId}) \nItem: ${nominalPilihan.jumlah} \nTotal: Rp ${nominalPilihan.harga.toLocaleString()}`);
  }

  return (
    <div className="w-full animate-fade-in-up px-4 md:px-0">
      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-400 hover:text-emas transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" /> Kembali ke Home
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-xl sticky top-24 text-center">
            <img 
              src={game.gambar} 
              alt={game.nama} 
              className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-lg" 
            />
            <h2 className="text-2xl font-bold text-emas mb-2">{game.nama}</h2>
            <p className="text-sm text-gray-400">{game.deskripsi}</p>
            <div className="mt-4 inline-block bg-gelap text-emas px-3 py-1 rounded-full text-xs font-bold border border-emas/30">
              Currency: {game.satuan}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
            <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
              Masukkan ID Player
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <input 
                type="text" placeholder="User ID" 
                value={userId} onChange={(e) => setUserId(e.target.value)}
                className="col-span-2 bg-gelap border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-emas focus:ring-1 focus:ring-emas transition text-terang placeholder-gray-500"
              />
              <input 
                type="text" placeholder="Zone ID" 
                value={zoneId} onChange={(e) => setZoneId(e.target.value)}
                className="col-span-1 bg-gelap border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-emas focus:ring-1 focus:ring-emas transition text-terang placeholder-gray-500"
              />
            </div>
          </div>

          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-lg">
            <h3 className="text-lg font-bold text-terang mb-4 flex items-center gap-3">
              <span className="bg-emas text-gelap w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
              Pilih Nominal <span className="text-sm text-gray-400 font-normal ml-2">({game.satuan})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {game.nominals.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setNominalPilihan(item)}
                  className={`
                    p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden
                    ${nominalPilihan?.id === item.id 
                      ? 'bg-emas/10 border-emas ring-1 ring-emas shadow-lg shadow-emas/10' 
                      : 'bg-gelap border-transparent hover:border-gray-500'}
                  `}
                >
                  <div className="font-bold text-sm text-terang mb-1">{item.jumlah}</div>
                  <div className="text-emas font-mono font-semibold text-sm">Rp {item.harga.toLocaleString()}</div>
                  
                  {nominalPilihan?.id === item.id && (
                    <CheckCircle2 className="absolute top-3 right-3 text-emas w-5 h-5" />
                  )}
                </button>
              ))}

              {game.nominals.length === 0 && (
                <div className="col-span-full text-center py-4 text-gray-400">
                  Item kosong
                </div>
              )}

            </div>
          </div>

          <div className="bg-abu p-6 rounded-2xl border border-gelap shadow-2xl sticky bottom-4 z-10">
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-400 font-medium">Total Pembayaran</span>
               <span className="text-2xl font-black text-emas drop-shadow-md">
                 {nominalPilihan ? `Rp ${nominalPilihan.harga.toLocaleString()}` : 'Rp 0'}
               </span>
            </div>
            <button 
             disabled={!nominalPilihan}
             onClick={handleBayar}
             className={`
               w-full py-4 rounded-xl font-extrabold text-lg transition-all transform active:scale-95 shadow-xl
               ${nominalPilihan 
                 ? 'bg-emas hover:bg-yellow-500 text-gelap shadow-emas/20' 
                 : 'bg-gelap text-gray-500 cursor-not-allowed'}
             `}
            >
             {nominalPilihan ? 'Bayar Sekarang 💸' : 'Pilih Item Dulu'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}