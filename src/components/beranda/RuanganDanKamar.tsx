"use client";

import { useEffect, useState } from "react";
import { getBedAvailability } from "@/services/BedAvailibilityServices";

// 🔥 TYPE
type Room = {
  class: string;
  name: string;
  jumlah: number;
};

// 🔥 MAPPING MANUAL (kalau mau override specific room)
const roomImageMap: Record<string, string> = {
  "Suite": "/president_suite.jpg",
  "VVIP": "/vvip.jpg",
  "Premier A": "/premier_b.jpg",
  "VIP": "/vip.jpg",
  "Kelas I": "/kelas_1.jpg",
  "Kelas II": "/kelas_2.jpg",
  "Kelas III": "/kelas_3.jpg",
  'Kelas III B': "/kelas_3.jpg",
};

// 🔥 AUTO GENERATE DARI NAMA (fallback)
function getRoomImage(roomName: string) {
  // 1. cek mapping manual dulu
  if (roomImageMap[roomName]) {
    return roomImageMap[roomName];
  }

  // 2. fallback otomatis dari nama
  const formatted = roomName
    .toLowerCase()
    .replace(/\s+/g, "_") // spasi jadi _
    .replace(/[^\w_]/g, ""); // hapus karakter aneh

  return `/rooms/${formatted}.jpg`;
}

export default function RuanganDanKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getBedAvailability();

        if (res?.data) {
          const mapped: Room[] = res.data.map((item: any) => ({
            class: item.ClassID || item.ClassName,
            name: item.ClassName,
            jumlah: Number(item.JumlahTersedia),
          }));

          setRooms(mapped);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl mx-auto">

        {/* TITLE */}
        <div className="mb-10">
          <h2 className="text-4xl text-center font-bold text-blue-900">
            Ruangan & Kamar
          </h2>
          <p className="text-gray-500 mt-2 text-xl text-center">
            Dapatkan informasi ketersediaan kamar secara cepat, akurat, dan terpercaya untuk mendukung kebutuhan perawatan Anda dengan pelayanan terbaik dari Rumah Sakit Immanuel.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <div
                key={i}
                className="relative h-64 rounded-2xl overflow-hidden shadow-md group"
                style={{
                  backgroundImage: `url(${getRoomImage(room.name)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                {/* CONTENT */}
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="text-xl font-semibold">
                    {room.name}
                  </h3>

                  <p className="mt-2 text-lg font-bold">
                    {room.jumlah} Kamar Tersedia
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}