"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const fiturData = [
  {
    title: "Pendaftaran Online",
    desc: "Nikmati kemudahan pendaftaran berobat tanpa antre langsung dari aplikasi IMMA. Pilih jenis pasien (Tunai, Mitra/Asuransi, atau YBRS), tentukan pasien atau anggota keluarga lainnya, jadwal kunjungan, serta poli atau dokter sesuai kebutuhan Anda dalam satu alur yang praktis dan nyaman.",
    image: "/fitur_pendaftaran.jpeg",
  },
  {
    title: "Riwayat Berobat",
    desc: "Pantau riwayat berobat Anda. Lihat daftar kunjungan sebelumnya lengkap dengan informasi dokter, tanggal, dan waktu pemeriksaan dalam satu tampilan yang rapi dan praktis.",
    image: "/fitur_riwayat_berobat.jpeg",
  },
  {
    title: "Jadwal Dokter",
    desc: "Kini mencari jadwal dokter jadi lebih mudah dan cepat. Melalui IMMA, Anda cukup memilih dokter atau poli serta tanggal kunjungan, dan sistem akan menampilkan jadwal praktik lengkap beserta jamnya secara instan.",
    image: "/fitur_jadwal_dokter.jpeg",
  },
];

// 🔥 clone slide pertama
const extendedData = [
  fiturData[fiturData.length - 1], // clone terakhir di depan
  ...fiturData,
  fiturData[0], // clone pertama di belakang
];

export default function FiturIMMA() {
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  useEffect(() => {
    if (isDraggingState) return; // 🔥 sekarang ini WORK

    const interval = setInterval(() => {
        setIndex((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [isDraggingState, index]);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (index === 0) {
        setTimeout(() => {
        setIsTransitioning(false);
        setIndex(fiturData.length);
        }, 700);

        setTimeout(() => {
        setIsTransitioning(true);
        }, 750);
    }

    if (index === fiturData.length + 1) {
        setTimeout(() => {
        setIsTransitioning(false);
        setIndex(1);
        }, 700);

        setTimeout(() => {
        setIsTransitioning(true);
        }, 750);
    }
  }, [index]);

 const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsDraggingState(true); // 🔥 ini penting
    startX.current = e.clientX;
    setIsTransitioning(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

  const diff = e.clientX - startX.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    setIsDraggingState(false); // 🔥 ini juga penting

    setIsTransitioning(true);

    if (dragOffset > 80) {
        setIndex((prev) => prev - 1);
    } else if (dragOffset < -80) {
        setIndex((prev) => prev + 1);
    }

    setTimeout(() => {
        setDragOffset(0);
    }, 50);
  };

  return (
    <section className="w-full bg-blue-900 py-20 text-white">

      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-7xl mx-auto">

        {/* 🏷️ Judul */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Fitur Unggulan IMMA
          </h1>

          <p className="mt-3 text-sm md:text-base text-blue-200">
            Nikmati berbagai kemudahan layanan kesehatan dalam satu aplikasi
          </p>
        </div>

        {/* 🔥 SLIDER */}
        <div className="mt-16 relative overflow-hidden cursor-grab active:cursor-grabbing" 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}>

          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-700 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
            }}
          >
            {extendedData.map((item, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <div className="grid md:grid-cols-2 gap-10 items-center">

                  {/* 📝 KIRI */}
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-4 text-blue-200 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* 📱 KANAN */}
                  <div className="flex justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={210}
                      height={210}
                      className="rounded-xl shadow-lg object-contain"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}