"use client";

import Image from "next/image";
import { Instagram, Facebook, Mail, Youtube, Linkedin } from "lucide-react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    router.push("/akun/hasil-lab");
  };

  return (
    <footer className="w-full bg-[#0A3FA9] text-white">
      {/* CONTENT - padding sama persis dengan navbar, tanpa max-width */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-18 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 sm:gap-15 md:gap-20 lg:gap-40 xl:gap-50">
          {/* LEFT */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-lg font-semibold">{t.tentangKami}</h3>
            <p className="text-sm opacity-90">Download Imma Apps</p>

            <div className="flex flex-col gap-3 -ml-3">
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
                  className="w-auto h-15"
                />
              </a>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.forPatients}</h3>

            <button
              type="button"
              onClick={() => router.push("/cari-dokter")}
              className="block text-left text-sm opacity-90 transition hover:opacity-100 hover:underline"
            >
              {t.cariDokter}
            </button>

            <button
              type="button"
              onClick={showDevelopmentAlert}
              className="block text-left text-sm opacity-90 transition hover:opacity-100 hover:underline"
            >
              {t.layananKesehatan}
            </button>

            <a
              href="https://diklat.rsimmanuel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm opacity-90 transition hover:opacity-100 hover:underline"
            >
              {t.pusatInformasi}
            </a>

            <button
              type="button"
              onClick={openLabResult}
              className="block text-left text-sm opacity-90 transition hover:opacity-100 hover:underline"
            >
              {t.hasilLabBeranda}
            </button>

            <button
              type="button"
              onClick={showDevelopmentAlert}
              className="block text-left text-sm opacity-90 transition hover:opacity-100 hover:underline"
            >
              {t.radiologi}
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.ConnectWithUs}</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/immanuelhospitalbdg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Instagram size={18} />
                  <span>immanuelhospitalbdg</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@rsimmanuelbdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Image
                    src="/tiktok.png"
                    alt="TikTok"
                    width={1}
                    height={1}
                    className="w-5"
                  />
                  <span>rsimmanuelbdg</span>
                </a>
              </li>

              <li>
                <a
                  href="https://id.linkedin.com/company/rs-immanuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Linkedin size={18} />
                  <span>RS Immanuel</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.facebook.com/rsimmanuelbdg161/?locale=id_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Facebook size={18} />
                  <span>Rumah Sakit Immanuel</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:info@rsimmanuel.com"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Mail size={18} />
                  <span>info@rsimmanuel.com</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/@rsimmanuelbdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Youtube size={18} />
                  <span>rsimmanuelbdg</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1E3F9A]">
        <div className="w-full px-4 py-4 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="text-left text-md opacity-90">
            © Copyright 2025, Rs. Immanuel
          </div>
        </div>
      </div>
    </footer>
  );
}
