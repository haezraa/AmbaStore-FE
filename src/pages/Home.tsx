import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronLeft, ChevronRight, TrendingUp, Gamepad2 } from 'lucide-react';
import api from '../services/api';
import type { Game } from '../types';

// url gambar banner
const BANNERS = [
  "https://www.ourastore.com/_next/image?url=https%3A%2F%2Fcdn.ourastore.com%2Fourastore.com%2Fbanner%2Fgoogleplayvoucherefootballbanner-ezgif.com-optijpeg.jpg&w=1920&q=100", 
  "https://www.ourastore.com/_next/image?url=https%3A%2F%2Fcdn.ourastore.com%2Fourastore.com%2Fbanner%2Fpromobulananfebbanner.jpg-ezgif.com-optijpeg.jpg&w=1920&q=100", 
  "https://www.ourastore.com/_next/image?url=https%3A%2F%2Fcdn.ourastore.com%2Fourastore.com%2Fbanner%2Ftopuprobloxbannerr-ezgif.com-optijpeg.jpg&w=1920&q=100" 
];

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // auto slide banner
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // tombol prev/next
  const prevSlide = () => setCurrentSlide((curr) => (curr === 0 ? BANNERS.length - 1 : curr - 1));
  const nextSlide = () => setCurrentSlide((curr) => (curr === BANNERS.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data.data);
      } catch (error) {
        console.error("Gagal memuat data game:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // data item populer
  const popularItems = [
    {
      id: 1,
      gameId: 1, 
      name: "Weekly Diamond Pass",
      gameName: "Mobile Legends",
      image: "https://www.ourastore.com/_next/image?url=https%3A%2F%2Fcdn.ourastore.com%2Fourastore.com%2Fproduct%2FMLBBIndofix-ezgif.com-optijpeg.jpg&w=1920&q=75",
      price: "Rp 28.000"
    },
    {
      id: 2,
      gameId: 4, 
      name: "Welkin Moon",
      gameName: "Genshin Impact",
      image: "https://www.ourastore.com/_next/image?url=https%3A%2F%2Fclient-cdn.bangjeff.com%2Fbbcbed30-004a-490e-80da-6da748fe302f.jpg&w=1920&q=75",
      price: "Rp 79.000"
    }
  ];

  return (
    <div className="w-full animate-fade-in-up pb-20">
      
      {/* banner */}
      <div className="w-full relative group mt-0 md:mt-4 px-0">
        <div className="w-full h-48 sm:h-64 md:h-[450px] lg:h-[460px] rounded-none md:rounded-2xl overflow-hidden relative shadow-2xl shadow-emas/10 border-y md:border border-gelap/50">
          
          <div 
            className="w-full h-full flex transition-transform duration-700 ease-in-out" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {BANNERS.map((banner, index) => (
              <img 
                key={index}
                src={banner} 
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover object-center flex-shrink-0"
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gelap to-transparent pointer-events-none"></div>

          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-emas text-white hover:text-gelap p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-emas text-white hover:text-gelap p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm border border-white/10"
          >
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20">
            {BANNERS.map((_, i) => (
              <div 
                key={i}
                onClick={() => setCurrentSlide(i)} 
                className={`
                  transition-all h-1.5 md:h-2 rounded-full cursor-pointer shadow-lg
                  ${currentSlide === i ? "bg-emas w-6 md:w-8" : "bg-white/40 hover:bg-white w-2"}
                `}
              />
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-8 md:mt-12">
        
        {/* populer item */}
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-emas w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-bold text-terang"> Sedang Populer</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {popularItems.map((item) => (
                    <Link 
                        to={`/topup/${item.gameId}`} 
                        key={item.id}
                        className="bg-abu border border-gray-700/50 rounded-2xl p-4 flex items-center gap-4 hover:border-emas transition-all group shadow-lg"
                    >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-600">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-terang font-bold text-sm line-clamp-1">{item.name}</h3>
                            <p className="text-gray-400 text-xs mb-1 line-clamp-1">{item.gameName}</p>
                            <p className="text-emas font-bold text-sm">{item.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* game list */}
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Gamepad2 className="text-emas w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-bold text-terang">Semua Game</h2>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-emas border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emas font-bold animate-pulse">Memuat daftar game...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {games.map((g) => (
                        <Link 
                            to={`/topup/${g.id}`} 
                            key={g.id}
                            className="bg-abu border border-gray-700/50 rounded-2xl overflow-hidden hover:border-emas transition-all group flex flex-col shadow-lg"
                        >
                            <div className="aspect-square overflow-hidden relative">
                                <img 
                                    src={g.gambar} 
                                    alt={g.nama} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gelap/90 via-gelap/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <span className="bg-emas text-gelap text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                                        <Zap className="w-3 h-3" /> Top Up
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 text-center border-t border-gray-700/50 bg-abu/50">
                                <h3 className="text-terang font-bold text-sm line-clamp-1">{g.nama}</h3>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-1">{g.publisher}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}