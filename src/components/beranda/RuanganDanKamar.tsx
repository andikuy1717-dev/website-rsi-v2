"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getBedAvailability } from "@/services/BedAvailibilityServices";

// TYPE
type Room = {
  class: string;
  name: string;
  jumlah: number;
};

// MAPPING MANUAL GAMBAR KAMAR
const roomImageMap: Record<string, string> = {
  "Suite": "/president_suite.jpg",
  "VVIP": "/vvip.jpg",
  "Premier A": "/premier_b.jpg",
  "VIP": "/vip.jpg",
  "Kelas I": "/kelas_1.jpg",
  "Kelas II": "/kelas_2.jpg",
  "Kelas III": "/kelas_3.jpg",
  "Kelas III B": "/kelas_3.jpg",
};

// FALLBACK GAMBAR KAMAR
function getRoomImage(roomName: string) {
  if (roomImageMap[roomName]) {
    return roomImageMap[roomName];
  }
  const formatted = roomName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");

  return `/rooms/${formatted}.jpg`;
}

// DATA DUMMY SESUAI DESAIN GAMBAR (JIKA API BELUM AKTIF / KOSONG)
const fallbackRooms: Room[] = [
  { class: "VVIP", name: "VVIP", jumlah: 3 },
  { class: "Premier A", name: "Premier A", jumlah: 3 },
  { class: "VIP", name: "VIP", jumlah: 17 },
  { class: "Kelas I", name: "Kelas I", jumlah: 7 },
  { class: "Kelas II", name: "Kelas II", jumlah: 20 },
  { class: "Kelas III", name: "Kelas III", jumlah: 19 },
];

export default function RuanganDanKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState("");

  useEffect(() => {
    // Set jam update saat ini
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setUpdatedTime(`${hours}:${minutes} WIB`);

    async function fetchData() {
      try {
        const res = await getBedAvailability();

        if (res?.data && res.data.length > 0) {
          const mapped: Room[] = res.data.map((item: any) => ({
            class: item.ClassID || item.ClassName,
            name: item.ClassName,
            jumlah: Number(item.JumlahTersedia),
          }));
          setRooms(mapped);
        } else {
          setRooms(fallbackRooms);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setRooms(fallbackRooms);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    // LATAR ABU (#F3F5FB) DARI SPESIFIKASI DESIGN SYSTEM
    <section className="w-full bg-[#E3E6EF] py-20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* HEADER SECTION */}
        <div className="mb-10 sm:mb-12">
          
          {/* EYEBROW: GARIS EMAS #E0A91B + TEKS KAPITAL */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-[3px] bg-[#E0A91B] rounded-full shrink-0" />
            <span className="text-[13px] font-bold text-[#1B2A78] uppercase tracking-[1.5px]">
              Ruangan & Kamar
            </span>
          </div>

          {/* H2 JUDUL SECTION: 42px / 1.15 / ExtraBold 800, Navy Gelap #111C52 */}
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold text-[#111C52] leading-[1.15] tracking-[-0.8px] mb-3">
            Fasilitas Kamar
          </h2>

          {/* ROW: DESKRIPSI & BADGE WAKTU PEMBARUAN */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-[#545B75] text-[15px] sm:text-[16px] leading-[1.6] max-w-2xl font-normal">
              Informasi ketersediaan kamar secara cepat, akurat, dan terpercaya untuk mendukung kebutuhan perawatan Anda.
            </p>

            {/* BADGE WAKTU PEMBARUAN DENGAN TITIK HIJAU */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E6EF] shadow-xs shrink-0 self-start md:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[#545B75] text-[12px] sm:text-[13px] font-medium">
                Diperbarui: {updatedTime || "Hari ini"}
              </span>
            </div>
          </div>

        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[270px] bg-white border border-[#E3E6EF] rounded-3xl overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div className="h-[200px] bg-gray-200" />
                <div className="p-5 flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-200 rounded-md" />
                  <div className="h-7 w-20 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRID KARTU KAMAR (3 KOLOM) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rooms.map((room, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-[#E3E6EF] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* WADAH FOTO KAMAR */}
                <div className="relative w-full h-[200px] sm:h-[210px] bg-gradient-to-br from-[#EAEEFB]/60 via-[#F3F5FB] to-[#D5DAEA]/40 overflow-hidden flex items-center justify-center select-none">
                  
                  {/* Pola diagonal placeholder */}
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #1B2A78 0, #1B2A78 1.5px, transparent 0, transparent 18px)"
                    }}
                  />

                  {/* Fallback teks jika gambar belum terbaca */}
                  <p className="text-[#545B75] text-[13px] sm:text-[14px] font-medium z-0">
                    Foto kamar {room.name}
                  </p>

                  {/* GAMBAR KAMAR ASLI (DENGAN OBJECT COVER) */}
                  <Image
                    src={getRoomImage(room.name)}
                    alt={`Foto Kamar ${room.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                    onError={(e: any) => {
                      // Sembunyikan tag gambar jika file foto tidak ditemukan di public
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* BAR INFO KETERSEDIAAN DI BAWAH */}
                <div className="p-5 sm:p-6 bg-white flex items-center justify-between border-t border-[#E3E6EF]">
                  
                  {/* NAMA KAMAR: Navy Gelap #111C52, 19-20px Bold */}
                  <h3 className="font-bold text-[#111C52] text-[18px] sm:text-[19px] leading-tight group-hover:text-[#1B2A78] transition-colors">
                    {room.name}
                  </h3>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}