import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-terang mb-2">Masuk</h2>
      <p className="text-gray-400 text-sm mb-8">Silakan masuk menggunakan alamat email dan kata sandi Anda.</p>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-terang mb-1.5">Alamat email</label>
          <input type="email" placeholder="admin@ambastore.com" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
        </div>

        <div>
          <label className="block text-xs font-bold text-terang mb-1.5">Kata sandi</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Kata sandi" className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-emas focus:ring-emas focus:ring-offset-gray-900" />
            <span className="text-gray-400 font-medium">Ingat saya</span>
          </label>
          <Link to="#" className="text-emas hover:text-yellow-500 transition-colors font-bold">Lupa kata sandi?</Link>
        </div>

        <button type="submit" className="w-full bg-emas hover:bg-yellow-500 text-gelap font-bold py-3.5 mt-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg">
          <Lock className="w-4 h-4" /> Masuk
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 font-medium mt-6">
        Belum memiliki akun? <Link to="/register" className="text-emas hover:text-yellow-500 transition-colors font-bold">Daftar</Link>
      </p>
    </div>
  );
}