import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-terang mb-2">Daftar</h2>
      <p className="text-gray-400 text-sm mb-6">Silakan masukkan informasi pendaftaran yang valid.</p>

      <form onSubmit={handleRegister} className="space-y-3.5">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-terang mb-1">Nama lengkap</label>
            <input type="text" placeholder="Nama lengkap" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-terang mb-1">Username</label>
            <input type="text" placeholder="Username" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-terang mb-1">Alamat email</label>
          <input type="email" placeholder="Alamat email" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
        </div>

        <div>
          <label className="block text-xs font-bold text-terang mb-1">Nomor WhatsApp</label>
          <div className="flex bg-abu border border-gray-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-emas focus-within:border-emas transition-all">
            <div className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-700">
              <span className="text-lg">🇮🇩</span>
            </div>
            <input type="tel" placeholder="+62" className="w-full bg-transparent text-terang py-2.5 px-4 focus:outline-none placeholder:text-gray-500" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-terang mb-1">Kata sandi</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Kata sandi" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-terang mb-1">Konfirmasi sandi</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Konfirmasi" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-1 pb-2">
          <input type="checkbox" className="w-4 h-4 mt-0.5 rounded bg-gray-800 border-gray-600 text-emas focus:ring-emas focus:ring-offset-gray-900" required />
          <span className="text-gray-400 font-medium text-sm leading-snug">
            Saya setuju dengan <span className="text-emas hover:text-yellow-500 transition-colors">Syarat dan Ketentuan</span> serta <span className="text-emas hover:text-yellow-500 transition-colors">Kebijakan Privasi</span>.
          </span>
        </label>

        <button type="submit" className="w-full bg-emas hover:bg-yellow-500 text-gelap font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg">
          <UserPlus className="w-4 h-4" /> Daftar
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 font-medium mt-5">
        Sudah memiliki akun? <Link to="/login" className="text-emas hover:text-yellow-500 transition-colors font-bold">Masuk</Link>
      </p>
    </div>
  );
}