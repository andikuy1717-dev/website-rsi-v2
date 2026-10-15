"use client";

import Swal from "sweetalert2";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";

export default function CeritaPasienPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* SECTION BACKGROUND: PRIMARY NAVY #1B2A78 */}
      <section className="w-full bg-[#1B2A78] py-16 sm:py-20 lg:py-24 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
        
        {/* CONTAINER SEJAJAR 1440px DENGAN SECTION LAIN */}
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* SISI KIRI: KONTEN TEKS & TOMBOL (7 KOLOM) */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-center">
              
              {/* EYEBROW: AKSEN EMAS #E0A91B */}
              <p className="text-[#E0A91B] text-[13px] sm:text-[14px] font-bold tracking-wide mb-3">
                Cerita #KisahImmanuel
              </p>

              {/* JUDUL H2: PUTIH, ExtraBold 800, leading 1.15 */}
              <h2 className="text-white text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold leading-[1.15] tracking-tight mb-5">
                Perjuangan Seorang Ibu <br />
                Menunggu Buah Hati
              </h2>

              {/* DESKRIPSI: TEKS DI LATAR GELAP #D3D8EE */}
              <p className="text-[#D3D8EE] text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.6] font-normal max-w-xl mb-8">
                Di balik setiap senyum seorang ibu, tersimpan perjalanan panjang penuh harapan, doa, dan ketegaran. Hari demi hari dilalui dengan penuh kesabaran, hingga akhirnya tangisan pertama sang buah hati menjadi jawaban atas semua penantian.
              </p>

              {/* DUA TOMBOL BERDAMPINGAN */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                
                {/* TOMBOL UTAMA: LATAR EMAS #E0A91B DENGAN TEKS NAVY GELAP #111C52 */}
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 bg-[#E0A91B] hover:bg-[#d19b12] active:scale-95 text-[#111C52] px-6 py-3 rounded-xl font-bold text-[14px] sm:text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={17} strokeWidth={2.5} />
                </button>

                {/* TOMBOL KEDUA: NAVY DARK OUTLINE */}
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: "info",
                      text: "Menu ini dalam tahap pengembangan",
                      confirmButtonText: "Mengerti",
                      confirmButtonColor: "#1B2A78",
                    });
                  }}
                  className="flex items-center gap-2 bg-[#142263] hover:bg-[#111C52] active:scale-95 text-white border border-[#2B3C87] px-6 py-3 rounded-xl font-semibold text-[14px] sm:text-[15px] transition-all duration-200 cursor-pointer"
                >
                  <span>Cerita Lainnya</span>
                </button>

              </div>

            </div>

            {/* SISI KANAN: WADAH FOTO BESAR DENGAN SUDUT MELENGKUNG (6 KOLOM) */}
            <div className="lg:col-span-6 xl:col-span-6 w-full flex justify-center lg:justify-end">
              <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-3xl lg:rounded-[36px] overflow-hidden border border-[#2B3C87] shadow-xl bg-[#142263]/70 flex items-center justify-center select-none group">
                
                {/* Pola diagonal placeholder */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #D3D8EE 0, #D3D8EE 1.5px, transparent 0, transparent 20px)"
                  }}
                />

                {/* Teks fallback */}
                <p className="text-[#D3D8EE] text-[14px] sm:text-[15px] font-medium z-0">
                  Foto cerita pasien
                </p>

                {/* Foto asli ibu_hamil.jpg */}
                <Image
                  src="/ibu_hamil.jpg"
                  alt="Cerita Pasien Immanuel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POPUP MODAL VIDEO & CERITA LENGKAP */}
      {open && (
        <div className="fixed inset-0 bg-black/80 z-9999 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-6xl max-h-[85vh] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
            
            {/* TOMBOL CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black shadow-sm transition cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
              
              {/* VIDEO YOUTUBE */}
              <div className="w-full min-h-[260px] lg:min-h-[460px] bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/1W8v8p1a064"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* CERITA LENGKAP */}
              <div className="flex flex-col p-6 sm:p-8 lg:p-10 overflow-hidden">
                <p className="text-[#E0A91B] text-[12px] font-bold uppercase tracking-wider mb-2">
                  Kisah Pasien
                </p>
                <h3 className="text-[22px] sm:text-[26px] font-extrabold text-[#111C52] leading-tight mb-4">
                  Perjuangan Seorang Ibu Menunggu Buah Hati
                </h3>

                <div className="flex-1 overflow-y-auto pr-3 text-[#545B75] text-[14px] sm:text-[15px] leading-relaxed space-y-4">
                  <p>
                    Malam itu, suasana ruang bersalin dipenuhi ketegangan. Rasa sakit yang datang silih berganti tak menghentikan tekad sang ibu untuk bertahan. Setiap detik terasa begitu panjang, setiap tarikan napas dipenuhi harapan.
                  </p>
                  <p>
                    Dengan penuh keberanian, ia melewati setiap proses yang tidak mudah. Didampingi tenaga medis yang sigap, perjuangan itu akhirnya terbayar ketika tangisan pertama sang bayi terdengar.
                  </p>
                  <p>
                    Tangisan itu bukan sekadar suara, melainkan jawaban atas doa, kesabaran, dan perjuangan panjang yang penuh makna.
                  </p>
                  <p>
                    Ini adalah kisah tentang cinta, keteguhan, dan keajaiban kehidupan yang tidak bisa diukur dengan kata-kata.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}