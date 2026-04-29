"use client";

import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";

export default function CeritaPasienPage() {
  const [open, setOpen] = useState(false);


  return (
    <>
    <section
      className="w-full min-h-screen"
      style={{
        backgroundImage: "url('/ibu_hamil.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "100%",
      }}
    >
      {/* 🔥 Overlay FULL */}
      <div className="w-full min-h-screen bg-black/50 flex items-start pt-24 md:pt-32 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        
        <div className="text-white max-w-xl">

          <p className="text-lg md:text-base mb-2 opacity-80">
            Cerita #KisahImmanuel
          </p>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Perjuangan Seorang <br />Ibu Menunggu  <br />Buah Hati
          </h1>

          <p className="text-base md:text-lg opacity-90 leading-relaxed mb-10">
            Di balik setiap senyum seorang ibu, tersimpan perjalanan panjang yang
            penuh harapan, doa, dan ketegaran. Hari demi hari dilalui dengan
            penuh kesabaran, hingga akhirnya tangisan pertama sang buah hati
            menjadi jawaban atas semua penantian yang tak pernah sia-sia.
          </p>

          {/* 🔥 CTA */}
          <div className="flex flex-col gap-2">

            <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-white font-bold">
                <span className="font-bold cursor-pointer">Baca Selengkapnya</span>
                 <ArrowRight
                    size={22}
                    strokeWidth={3}
                    className="group-hover:translate-x-1 transition cursor-pointer"
                 />
            </button>

            <button className="flex items-center gap-2 text-white font-bold">
                <span className="font-bold cursor-pointer">Cerita Lainnya</span>
                 <ArrowRight
                    size={22}
                    strokeWidth={3}
                    className="group-hover:translate-x-1 transition cursor-pointer"
                 />
            </button>

          </div>

        </div>

      </div>
    </section>

    {/* 🔥 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-7xl h-[80vh] rounded-2xl overflow-hidden relative shadow-2xl">

            {/* ❌ CLOSE */}
            <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-20 text-black cursor-pointer hover:scale-110 transition"
            >
                <X size={28} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

                {/* 🎬 VIDEO (FULL HEIGHT) */}
                <div className="w-full h-full">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/1W8v8p1a064"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                </div>

                {/* 📖 CONTENT KANAN */}
                <div className="flex flex-col p-6 md:p-10 h-full overflow-hidden">

                {/* 🧠 JUDUL */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-black shrink-0">
                    Perjuangan Seorang Ibu Menunggu Buah Hati
                </h2>

                {/* 📜 DESKRIPSI (SCROLLABLE) */}
                <div className="flex-1 overflow-y-auto text pr-2 text-gray-700 leading-relaxed space-y-4">
                    <p>
                    Malam itu, suasana ruang bersalin dipenuhi ketegangan. Rasa
                    sakit yang datang silih berganti tak menghentikan tekad sang
                    ibu untuk bertahan. Setiap detik terasa begitu panjang,
                    setiap tarikan napas dipenuhi harapan.
                    </p>

                    <p>
                    Dengan penuh keberanian, ia melewati setiap proses yang tidak
                    mudah. Didampingi tenaga medis yang sigap, perjuangan itu
                    akhirnya terbayar ketika tangisan pertama sang bayi terdengar.
                    </p>

                    <p>
                    Tangisan itu bukan sekadar suara, melainkan jawaban atas doa,
                    kesabaran, dan perjuangan panjang yang penuh makna.
                    </p>

                    <p>
                    Ini adalah kisah tentang cinta, keteguhan, dan keajaiban
                    kehidupan yang tidak bisa diukur dengan kata-kata.
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