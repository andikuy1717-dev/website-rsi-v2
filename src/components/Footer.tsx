"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import Image from "next/image";

export default function Footer() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const router = useRouter();

  const showDevelopmentAlert = () => {
    Swal.fire({
      icon: "info",
      text: "Menu ini sedang dalam tahap pengembangan",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#21368B",
    });
  };

  const openLabResult = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/login");
      return;
    }

    router.push("/akun/hasil-lab");
  };

  return (
    <footer className="w-full bg-[#111C52] text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* CONTAINER UTAMA */}
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-16 pb-8">
        
        {/* GRID 4 KOLOM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">
          
          {/* KOLOM 1: IDENTITAS, ALAMAT & KONTAK */}
          <div className="flex flex-col space-y-5">
            {/* LOGO & BRAND NAME */}
            <div className="flex items-center gap-3">
              <Image
                src="/Logo RSI.png"
                alt="Logo RS Immanuel"
                width={40}
                height={40}
                className="w-10 h-10 object-contain shrink-0"
              />
              <span className="text-white font-bold text-[17px] sm:text-[18px] tracking-tight">
                RS Immanuel Bandung
              </span>
            </div>

            {/* ALAMAT */}
            <p className="text-[#C5CEEA] text-[13.5px] leading-relaxed">
              Jl. Raya Kopo No.161, Situsaeur, Kec. Bojongloa Kidul, Kota Bandung, Jawa Barat 40234
            </p>

            {/* TELEPON & EMAIL SEJAJAR */}
            <p className="text-[#C5CEEA] text-[13.5px]">
              <a
                href="tel:0225201656"
                className="hover:text-white transition-colors duration-150"
              >
                (022) 520 1656
              </a>
              <span className="mx-2 text-white/40">·</span>
              <a
                href="mailto:info@rsimmanuel.com"
                className="hover:text-white transition-colors duration-150"
              >
                info@rsimmanuel.com
              </a>
            </p>
          </div>

          {/* KOLOM 2: TENTANG KAMI */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-white font-bold text-[15px] sm:text-[16px] mb-1">
              Tentang Kami
            </h3>

            <button
              type="button"
              onClick={() => router.push("/tentang-kami")}
              className="text-left text-[13.5px] text-[#C5CEEA] transition-colors duration-150 hover:text-white"
            >
              Profil Rumah Sakit
            </button>

            <button
              type="button"
              onClick={() => router.push("/edukasi-kesehatan")}
              className="text-left text-[13.5px] text-[#C5CEEA] transition-colors duration-150 hover:text-white"
            >
              Edukasi Kesehatan
            </button>

            <button
              type="button"
              onClick={() => router.push("/promo")}
              className="text-left text-[13.5px] text-[#C5CEEA] transition-colors duration-150 hover:text-white"
            >
              Promo
            </button>

            <a
              href="https://play.google.com/store/search?q=imma&c=apps&hl=id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Download ImMA Apps
            </a>
          </div>

          {/* KOLOM 3: UNTUK PASIEN */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-white font-bold text-[15px] sm:text-[16px] mb-1">
              Untuk Pasien
            </h3>

            <button
              type="button"
              onClick={() => router.push("/cari-dokter")}
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Cari Dokter
            </button>

            <button
              type="button"
              onClick={showDevelopmentAlert}
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Layanan Kesehatan
            </button>

            <a
              href="https://diklat.rsimmanuel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Pusat Informasi
            </a>

            <button
              type="button"
              onClick={openLabResult}
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Hasil Lab
            </button>

            <button
              type="button"
              onClick={showDevelopmentAlert}
              className="text-left text-[#C5CEEA] text-[13.5px] hover:text-white transition-colors duration-150"
            >
              Radiologi
            </button>
          </div>

          {/* KOLOM 4: TERHUBUNG DENGAN KAMI */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-white font-bold text-[15px] sm:text-[16px] mb-1">
              Terhubung dengan Kami
            </h3>

            <ul className="space-y-3.5 text-[13.5px] text-[#C5CEEA]">
              <li>
                <a
                  href="https://www.instagram.com/immanuelhospitalbdg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-block"
                >
                  Instagram · immanuelhospitalbdg
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@rsimmanuelbdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-block"
                >
                  TikTok · rsimmanuelbdg
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@rsimmanuelbdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-block"
                >
                  YouTube · rsimmanuelbdg
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/rsimmanuelbdg161/?locale=id_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-block"
                >
                  Facebook · Rumah Sakit Immanuel
                </a>
              </li>
              <li>
                <a
                  href="https://id.linkedin.com/company/rs-immanuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-block"
                >
                  LinkedIn · RS Immanuel
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* GARIS PEMBATAS HORIZONTAL */}
        <div className="w-full border-t border-white/10 mt-14 mb-6" />

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="text-left text-[#9AA8CE] text-[13px]">
          © 2026 RS Immanuel Bandung. Hak cipta dilindungi.
        </div>

      </div>
    </footer>
  );
}