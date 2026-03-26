"use client";

import Image from "next/image";
import {
  Instagram,
  Facebook,
  Mail,
  Youtube,
  Linkedin,
} from "lucide-react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  return (
    <footer className="w-full bg-[#0A3FA9] text-white">
      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-1 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-15 md:gap-20 lg:gap-40 xl:gap-50">
        
        {/* LEFT */}
        <div className="flex flex-col items-start space-y-4">
          <h3 className="text-lg font-semibold">{t.tentangKami}</h3>
          <p className="text-sm opacity-90">Download Imma Apps</p>

          <div className="flex flex-col gap-3 -ml-3">
             <a
              href="https://play.google.com/store/search?q=imma&c=apps&hl=id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-90 transition"
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
              className="inline-block hover:opacity-90 transition"
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
          <p className="text-sm opacity-90">{t.cariDokter}</p>
          <p className="text-sm opacity-90">{t.layananKesehatan}</p>
          <p className="text-sm opacity-90">{t.pusatInformasi}</p>
          <p className="text-sm opacity-90">{t.hasilLabBeranda}</p>
          <p className="text-sm opacity-90">{t.radiologi}</p>
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
                className="flex items-center gap-3 hover:opacity-80 transition"
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
                className="flex items-center gap-3 hover:opacity-80 transition"
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
                className="flex items-center gap-3 hover:opacity-80 transition"
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
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <Facebook size={18} />
                <span>Rumah Sakit Immanuel</span>
              </a>
            </li>

            <li>
              <a
                href="mailto:info@rsimmanuel.com"
                className="flex items-center gap-3 hover:opacity-80 transition"
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
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <Youtube size={18} />
                <span>rsimmanuelbdg</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#1E3F9A]">
          <div className="max-w-7xl mx-auto px-6 py-4 text-md opacity-90 text-left">
          © Copyright 2025, Rs. Immanuel 
          </div>
      </div>
    </footer>
  );
}
