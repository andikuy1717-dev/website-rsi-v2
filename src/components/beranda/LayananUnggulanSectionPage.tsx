"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

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
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;

  return (
    <section className="w-full bg-gray-100 py-20">
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-start">

        {/* TEXT */}
        <div>
          <h2 className="mt-22 text-4xl font-light text-blue-900 leading-snug">
            {t.layanan} <br />
            <span className="font-bold">{t.unggulanKami}</span>
          </h2>

          <p className="mt-2 text-gray-600 leading-relaxed text-xl">
            {t.kamiMenghadirkan}
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
    </div>
    </section>
  );
}