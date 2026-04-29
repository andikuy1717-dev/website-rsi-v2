"use client";

export default function TutorialIMMA() {
  return (
    <section className="w-full py-15 px-6 flex flex-col items-center text-center">

      {/* 🏷️ Judul */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
        Tentang Aplikasi IMMA
      </h1>

      {/* ✏️ Subtext */}
      <p className="mt-3 text-sm md:text-base text-gray-400">
        Ketahui lebih banyak tentang aplikasi IMMA
      </p>

      {/* 🎥 Video */}
      <div className="mt-10 w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
        <video
          src="/video_tutor_imma.mp4"
          controls
          className="w-full h-full object-contain"
        />
      </div>

    </section>
  );
}