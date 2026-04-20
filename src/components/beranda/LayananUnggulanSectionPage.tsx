"use client";

import Image from "next/image";

const services = [
  {
    title: "Phacoemulsification Carl Zeiss Vitalis 100",
    desc: "Dengan teknologi Phacoemulsification Carl Zeiss Vitalis 100, RS Immanuel ada pengobatan katarak dengan hasil yang memuaskan.",
    img: "/phaco.webp",
  },
  {
    title: "Slimming Clinic",
    desc: "Dari konsultasi hingga perawatan lanjutan, kami membantu Anda mendapatkan tubuh yang Anda impikan dengan metode yang aman.",
    img: "/slimming.webp",
  },
  {
    title: "Cathlab Vascular Intervention & DSA",
    desc: "RS Immanuel menawarkan teknologi canggih untuk diagnosis dan pengobatan gangguan vaskular melalui Cathlab Vascular Intervention.",
    img: "/cathlab.jpg",
  },
];

export default function LayananUnggulanSectionPage() {
  return (
    <section className="w-full bg-gray-100 py-20 px-18">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-center">

        {/* TEXT */}
        <div>
          <h2 className="text-4xl font-light text-blue-900 leading-snug">
            Layanan <br />
            <span className="font-bold">Unggulan Kami</span>
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Kami menghadirkan berbagai layanan kesehatan terbaik dengan
            fasilitas modern dan tenaga medis profesional untuk memberikan
            perawatan yang optimal dan menyeluruh bagi setiap pasien.
          </p>
        </div>

        {/* CARDS */}
        <div className="lg:col-span-2 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map((service, i) => (
            <div
              key={i}
              className="relative h-[480px] rounded-3xl overflow-hidden shadow-md group"
            >
              
              {/* IMAGE */}
              <Image
                src={service.img}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              {/* GRADIENT BLUR */}
              <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-linear-to-t from-white via-white/85 to-transparent flex flex-col justify-start min-h-[200px]">

                <h3 className="font-semibold text-blue-900 text-lg leading-snug line-clamp-2 h-14">
                  {service.title}
                </h3>

                <p className="text-gray-700 text-sm mt-3 leading-relaxed h-24">
                  {service.desc}
                </p>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}