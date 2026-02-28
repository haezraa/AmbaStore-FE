import { Clock, Settings, Phone } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#303030] rounded-2xl p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                IK
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">ilham kurniawan</h3>
                <span className="bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-md font-semibold mt-1 inline-block">
                  Member
                </span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-8 flex items-center gap-2 text-gray-300 text-sm font-medium">
            <Phone className="w-4 h-4" />
            +6285693459855
          </div>
        </div>

        <div className="bg-[#303030] rounded-2xl p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                <span className="text-black font-bold text-xs">C</span>
              </div>
              <span className="text-white font-bold">Amba Coin</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <button className="bg-[#A58B61] hover:bg-[#856942] text-white px-4 py-1.5 rounded text-sm font-bold transition-colors">Top Up</button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors">Redeem</button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-black text-white">0 <span className="text-3xl font-bold">Amba Coin</span></h2>
          </div>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-4">Transaksi Hari Ini</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 bg-[#424750] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-gray-300 text-sm font-medium">Total Transaksi</p>
        </div>
        
        <div className="col-span-2 bg-[#424750] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-gray-300 text-sm font-medium">Total Penjualan</p>
        </div>

        <div className="bg-[#b89b3a] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-white text-sm font-medium">Menunggu</p>
        </div>

        <div className="bg-[#2f5c96] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-white text-sm font-medium">Dalam Proses</p>
        </div>

        <div className="bg-[#2c7844] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-white text-sm font-medium">Sukses</p>
        </div>

        <div className="bg-[#822a2a] rounded-xl p-6 flex flex-col items-center justify-center h-32 shadow-md">
          <h4 className="text-3xl font-bold text-white mb-2">0</h4>
          <p className="text-white text-sm font-medium">Gagal</p>
        </div>
      </div>

    </div>
  );
}