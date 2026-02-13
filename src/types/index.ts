// src/types/index.ts
export interface Nominal {
  id: number;
  jumlah: string;
  harga: number;
  kategori: string;
}

export interface Game {
  id: number;
  nama: string;
  publisher: string;
  gambar: string;
  deskripsi: string;
  satuan: string; 
  input_type: 'id_zone' | 'server_id' | 'uid_only';
  nominals: Nominal[]; 
}

export interface PaymentMethod {
  id: number;
  nama: string;
  kode: string;
  gambar: string;
  kategori: string;
}