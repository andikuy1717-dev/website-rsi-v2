"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";

const actions = [
  {
    title: "Download Aplikasi IMMA",
    desc: "Akses layanan kesehatan lebih mudah langsung dari genggaman Anda. Buat janji, cek jadwal dokter, dan nikmati berbagai kemudahan lainnya.",
    img: "/IMMA.png", // ganti sesuai asset lo
    button: "Pelajari Aplikasi IMMA",
    link: "/pelajari-tentang-imma",
  },
  {
    title: "Temui Dokter Pilihan Anda",
    desc: "Temukan dan jadwalkan konsultasi dengan dokter terbaik kami sesuai kebutuhan Anda tanpa harus menunggu lama.",
    img: "/temui_dokter.jpg", // ganti sesuai asset lo
    button: "Temui Dokter",
    link: "/cari-dokter",
  },
];

export default function SudahBuatJanjiTemuPage() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;
  const router = useRouter();

  return (
    <section className="w-full bg-gray-100 py-20">
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl mx-auto">

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* TEXT */}
          <div>
            <h2 className="mt-25 text-4xl font-light text-blue-900 leading-snug">
              Kesehatan Anda, Prioritas Kami <br />
              <span className="font-bold">Siap Konsultasi?</span>
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed text-lg">
              Nikmati kemudahan akses layanan kesehatan kami, mulai dari konsultasi hingga pengelolaan jadwal kunjungan Anda.
            </p>
          </div>

          {/* CARDS */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">

            {actions.map((item, i) => (
              <div
                key={i}
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-md group"
              >

                {/* IMAGE */}
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col justify-between h-[55%]">

                  <h3 className="font-semibold text-blue-900 text-xl leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed mt-3">
                    {item.desc}
                  </p>

                  <button onClick={() => {
                      startLoading();
                      router.push(item.link);
                    }}
                    className="flex items-center gap-2 text-blue-900 font-bold cursor-pointer transition hover:text-blue-500">
                    <span>{item.button}</span>
                    <ArrowRight
                      size={22}
                      strokeWidth={3}
                    />
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}