// src/types/index.ts
export interface Nominal {
  id: number;
  jumlah: string;
  harga: number;
}

export interface Game {
  id: number;
  nama: string;
  publisher: string;
  gambar: string;
  deskripsi: string;
  satuan: string; 
  nominals: Nominal[]; 
}