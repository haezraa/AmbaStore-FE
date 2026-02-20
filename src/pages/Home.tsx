import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
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
      
      {/*banner */}
      <div className="w-full relative group mt-0 md:mt-4 px-0">
        <div className="w-full h-48 sm:h-64 md:h-[450px] lg:h-[450px] rounded-none md:rounded-2xl overflow-hidden relative shadow-2xl shadow-emas/10 border-y md:border border-gelap/50">
          
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

      {/* game list */}
      <div className="px-4 md:px-0 mt-8 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 text-terang">
          Sedang Populer
        </h2>

        {loading ? (
          <div className="text-center text-emas font-bold py-10 animate-pulse">
            Loading data game...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {games.map((game) => (
              <Link 
                to={`/topup/${game.id}`}
                key={game.id} 
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-emas/30 hover:border-emas shadow-lg hover:shadow-emas/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gelap"
              >
                <img 
                  src={game.gambar} 
                  alt={game.nama} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-gelap via-gelap/80 to-transparent flex flex-col justify-end p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-base md:text-lg font-semibold text-white drop-shadow-md leading-tight mb-1">
                    {game.nama}
                  </h3>
                  <p className="text-xs text-emas font-medium">
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