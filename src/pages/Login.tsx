import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/dashboard'); 
      } else {
        setErrorMsg('Gagal masuk. Silakan periksa kembali data Anda.');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Terjadi kesalahan pada server. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <h2 className="text-3xl font-bold text-terang mb-2">Masuk</h2>
      <p className="text-gray-400 text-sm mb-8">Silakan masuk menggunakan alamat email dan kata sandi Anda.</p>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-terang mb-1.5">Alamat email</label>
          <input 
            type="email" 
            placeholder="admin@ambastore.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" 
            required 
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-terang mb-1.5">Kata sandi</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Kata sandi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-abu text-terang border border-gray-700 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-emas focus:border-emas transition-all placeholder:text-gray-500" 
              required 
              disabled={isLoading}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-terang"
              disabled={isLoading}
            >
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

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emas hover:bg-yellow-500 text-gelap font-bold py-3.5 mt-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gelap border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Masuk
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 font-medium mt-6">
        Belum memiliki akun? <Link to="/register" className="text-emas hover:text-yellow-500 transition-colors font-bold">Daftar</Link>
      </p>
    </div>
  );
}