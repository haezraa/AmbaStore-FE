import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <span className="text-3xl">🔥</span>
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AmbaStore
        </Link>
      </div>
    </nav>
  );
}