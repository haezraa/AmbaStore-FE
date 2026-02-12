import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import api from '../services/api';
import type { Game } from '../types';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="w-full animate-fade-in-up pb-20">
      
      <div className="w-full p-4 md:p-0 mt-4 mb-8">
        <div className="w-full h-40 md:h-64 bg-gradient-to-br from-abu to-gelap border border-emas/30 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl shadow-emas/10">
          <div className="text-center z-10 relative">
            <h1 className="text-3xl md:text-5xl font-extrabold text-emas mb-2 drop-shadow-lg tracking-wider">
              PROMO SPESIAL!
            </h1>
            <p className="text-terang text-sm md:text-lg">Diskon Diamond s/d 50% khusus user baru!</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emas opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emas opacity-5 rounded-full blur-2xl -ml-10 -mb-10"></div>
        </div>
      </div>

      <div className="p-4 md:p-0">
        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 text-terang">
          <Zap className="w-6 h-6 text-emas fill-emas" /> Sedang Populer
        </h2>

        {loading ? (
          <div className="text-center text-emas font-bold py-10 animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            
            {games.map((game) => (
              <Link 
                to={`/topup/${game.id}`}
                key={game.id} 

                // card desain
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-emas/50 hover:border-emas shadow-lg hover:shadow-emas/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-gelap"
              >
                <img 
                  src={game.gambar} 
                  alt={game.nama} 

                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gelap via-gelap/80 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  
                  <h3 className="text-lg md:text-xl font-extrabold text-terang drop-shadow-md leading-tight">
                    {game.nama}
                  </h3>
                  
                  <p className="text-sm text-emas font-semibold">
                    {game.publisher}
                  </p>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}