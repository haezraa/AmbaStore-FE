import { Outlet, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-gelap font-sans text-terang overflow-hidden">
      
      {/* bagian kiri */}
      <div className="hidden lg:flex w-1/2 bg-emas flex-col justify-center px-16 relative">
        
        <h1 className="text-5xl font-black text-gelap leading-tight mb-6 mt-[-10%]">
          TOP UP GAME<br />
          CEPAT, AMAN,<br />
          TERPERCAYA.
        </h1>
        <p className="text-gray-800 text-lg font-medium max-w-md">
          Nikmati pengalaman top up game yang lebih cepat dan praktis. Proses otomatis, harga bersahabat, dan layanan siap 24 jam.
        </p>

        <div className="absolute bottom-12 left-16 text-gray-800 text-sm font-bold">
          © 2026 AmbaStore.
        </div>
      </div>
      
      {/* bagian kanan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative h-full">
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-400 hover:text-emas bg-abu/50 hover:bg-abu p-2 rounded-[1vw] transition-all z-10"
          title="Kembali"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

    </div>
  );
}