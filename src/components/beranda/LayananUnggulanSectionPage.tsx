"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { FiArrowRight } from "react-icons/fi";

const services = [
  {
    tag: "Mata",
    title: "Phacoemulsification Carl Zeiss Visalis 100",
    desc: "Pengobatan katarak dengan teknologi Phacoemulsification Carl Zeiss Visalis 100 untuk hasil yang memuaskan.",
    img: "/phaco.webp",
    photoLabel: "Foto: alat Phaco",
    link: "/layanan/phaco",
  },
  {
    tag: "Jantung & Vaskular",
    title: "Cathlab Vascular Intervention & DSA",
    desc: "Teknologi canggih untuk diagnosis dan pengobatan gangguan vaskular melalui Cathlab Vascular Intervention.",
    img: "/cathlab.jpg",
    photoLabel: "Foto: ruang Cathlab",
    link: "/layanan/cathlab",
  },
  {
    tag: "Estetika",
    title: "Slimming Clinic",
    desc: "Dari konsultasi hingga perawatan lanjutan, kami membantu Anda mencapai berat badan ideal dengan metode yang aman.",
    img: "/slimming.webp",
    photoLabel: "Foto: Slimming Clinic",
    link: "/layanan/slimming",
  },
];

export default function LayananUnggulanSectionPage() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;

  return (
    // LATAR PUTIH DENGAN PADDING ATAS (pt-28 sm:pt-32) AGAR KARTU MELAYANG TIDAK MENABRAK
    <section className="w-full bg-white pt-24 sm:pt-28 md:pt-32 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* HEADER SECTION */}
        <div className="mb-10 sm:mb-14">
          
          {/* EYEBROW: GARIS EMAS #E0A91B + TEKS KAPITAL SPASI +1.5 */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-5 h-[3px] bg-[#E0A91B] rounded-full shrink-0" />
            <span className="text-[13px] font-bold text-[#1B2A78] uppercase tracking-[1.5px]">
              Layanan Unggulan
            </span>
          </div>

          {/* H2 JUDUL SECTION: 42px / 1.15 / ExtraBold 800, spasi -0.8px, Navy Gelap #111C52 */}
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold text-[#111C52] leading-[1.15] tracking-[-0.8px] mb-4 max-w-3xl">
            Teknologi modern, tenaga medis profesional
          </h2>

          {/* ROW: DESKRIPSI + LINK LIHAT SEMUA LAYANAN */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <p className="text-[#545B75] text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.6] max-w-2xl font-normal">
              Kami menghadirkan berbagai layanan kesehatan terbaik dengan fasilitas modern untuk memberikan perawatan yang optimal dan menyeluruh bagi setiap pasien.
            </p>

            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 text-[#1B2A78] hover:text-[#111C52] font-semibold text-[15px] transition-colors shrink-0 group cursor-pointer"
            >
              <span>{lang === "ID" ? "Lihat semua layanan" : "View all services"}</span>
              <FiArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

        {/* GRID KARTU LAYANAN (3 KOLOM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#E3E6EF] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* WADAH FOTO DENGAN POLA DIAGONAL & GAMBAR */}
              <div className="relative w-full h-[210px] sm:h-[220px] bg-gradient-to-br from-[#EAEEFB]/60 via-[#F3F5FB] to-[#D5DAEA]/40 overflow-hidden flex items-center justify-center border-b border-[#E3E6EF] select-none">
                
                {/* Pola garis diagonal */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #1B2A78 0, #1B2A78 1.5px, transparent 0, transparent 18px)"
                  }}
                />

                {/* Placeholder teks jika gambar belum ada / fallback */}
                <div className="relative z-0 text-center px-4">
                  <p className="text-[#545B75] text-[13px] sm:text-[14px] font-medium">
                    {service.photoLabel}
                  </p>
                </div>

                {/* Aktifkan tag Image jika gambar asli sudah tersedia */}
                {
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                /> 
                }
              </div>

              {/* KONTEN KARTU */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                
                <div>
                  {/* TAG KATEGORI: Biru Muda #EAEEFB, Teks Primary Navy #1B2A78 */}
                  <span className="inline-block bg-[#EAEEFB] text-[#1B2A78] text-[12px] font-semibold px-2.5 py-1 rounded-md mb-3.5 self-start">
                    {service.tag}
                  </span>

                  {/* H3 JUDUL KARTU: 20px / 1.3 / Bold 700, Navy Gelap #111C52 */}
                  <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111C52] leading-[1.3] mb-3 group-hover:text-[#1B2A78] transition-colors">
                    {service.title}
                  </h3>

                  {/* DESKRIPSI KARTU: 14-15px / 1.6 / 400, Teks Sekunder #545B75 */}
                  <p className="text-[#545B75] text-[14px] sm:text-[14.5px] leading-[1.6] mb-6 font-normal">
                    {service.desc}
                  </p>
                </div>

                {/* LINK "SELENGKAPNYA →" */}
                <div>
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1.5 text-[#1B2A78] group-hover:text-[#111C52] font-semibold text-[14px] sm:text-[15px] transition-colors"
                  >
                    <span>{lang === "ID" ? "Selengkapnya" : "Learn more"}</span>
                    <FiArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}