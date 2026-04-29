"use client";

import Image from "next/image";

export default function OpenIMMA() {
  return (
    <div
      className="w-full bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg_pelajari_tentang_imma.jpg')",
      }}
    >
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl mx-auto py-16">
        
        <div className="flex items-center justify-between">

          {/* 📝 TEXT KIRI */}
          <div className="max-w-xl">
            
            <h1 className="opacity-0 animate-fade-up text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-blue-900">
              IMMA
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium">
                (Immanuel Mobile Apps)
              </span>
            </h1>

            <p className="opacity-0 animate-fade-up delay-100 mt-5 leading-relaxed">

              <span className="block text-sm md:text-base text-gray-500">
                Dikembangkan oleh Rumah Sakit Immanuel
              </span>

              <span className="block mt-2 text-xl md:text-4xl font-semibold text-blue-800">
                Semua Dalam Satu <br />
                Layanan Kesehatan
              </span>

            </p>

            <span className="opacity-0 animate-fade-up delay-300 block mt-10 text-sm md:text-base text-gray-500">
              Klik tombol dibawah ini untuk mengunduh aplikasi
            </span>

            <div className="opacity-0 animate-fade-up delay-300 mt-1 flex gap-1">
              
              <a
                href="https://play.google.com/store/search?q=imma&c=apps&hl=id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition hover:opacity-90"
              >
                <Image
                  src="/google_play.png"
                  alt="Google Play"
                  width={180}
                  height={54}
                  className="w-auto h-14"
                />
              </a>

              <a
                href="https://apps.apple.com/id/app/imma/id6741088695?l=id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition hover:opacity-90"
              >
                <Image
                  src="/app_store.png"
                  alt="App Store"
                  width={180}
                  height={54}
                  className="w-auto h-14"
                />
              </a>

            </div>

          </div>

          {/* 📱 KANAN */}
           <div className="opacity-0 animate-fade-up delay-200 relative mr-5 sm:mr-10 md:mr-10 lg:mr-40 xl:mr-75">
                        
                <Image
                  src="/pelajari-tentang-imma.png"
                  alt="Pelajari Tentang IMMA"
                  width={200}
                  height={200}
                  className="object-contain"
                />
          
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[120px] h-[20px] bg-black/40 blur-xl rounded-full"></div>
          
                <Image
                  src="/Logo RSI.png"
                  alt="Logo RSI"
                  width={150}
                  height={150}
                  className="object-contain absolute bottom-[-30px] right-[-70px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                />
          
            </div>

        </div>

      </div>
    </div>
  );
}