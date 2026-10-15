"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import Image from "next/image";

export default function SudahBuatJanjiTemuPage() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;

   return (
    <section className="w-full bg-white py-16 font-['Plus_Jakarta_Sans',sans-serif] sm:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#111C52] px-6 py-10 shadow-2xl sm:rounded-[40px] sm:px-10 sm:py-12 lg:min-h-[500px] lg:px-14 lg:py-14">
          {/* dekorasi background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full bg-blue-400/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-[18%] h-48 w-48 rounded-full bg-[#E0A91B]/5 blur-3xl"
          />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
            {/* Konten kiri */}
            <div className="max-w-[640px]">
              <p className="mb-3 text-[12px] font-bold tracking-[1.5px] text-[#E0A91B] sm:text-[13px]">
                APLIKASI ImMA
              </p>

              <h2 className="max-w-[620px] text-[30px] font-extrabold leading-[1.16] tracking-tight text-white sm:text-[38px] lg:text-[42px]">
                Akses kesehatan lebih mudah,{" "}
                <span className="block">langsung dari genggaman.</span>
              </h2>

              <p className="mt-5 max-w-[540px] text-[14px] leading-[1.7] text-[#D3D8EE] sm:text-[15px] lg:text-[16px]">
                Buat janji, cek jadwal dokter, dan nikmati berbagai kemudahan
                lainnya lewat aplikasi ImMA RS Immanuel Bandung.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="https://play.google.com/store/search?q=imma&c=apps&hl=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Unduh ImMA di Google Play"
                  className="inline-flex transition duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
                >
                  <Image
                    src="/google_play.png"
                    alt="Unduh di Google Play"
                    width={180}
                    height={54}
                    className="h-auto w-[145px] sm:w-[155px]"
                  />
                </a>

                <a
                  href="https://apps.apple.com/id/app/imma/id6741088695?l=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Unduh IMMA di App Store"
                  className="inline-flex transition duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
                >
                  <Image
                    src="/app_store.png"
                    alt="Unduh di App Store"
                    width={180}
                    height={54}
                    className="h-auto w-[145px] sm:w-[155px]"
                  />
                </a>

                <div
                  aria-hidden="true"
                  className="hidden h-16 w-px bg-white/25 sm:block"
                />

                <div className="flex items-center gap-3 sm:ml-1">
                  <div className="rounded-xl bg-white p-2 shadow-sm">
                    <Image
                      src="/qr-imma.png"
                      alt="QR code untuk mengunduh aplikasi IMMA"
                      width={784}
                      height={784}
                      className="h-16 w-16 rounded-md object-contain"
                    />
                  </div>

                  <span className="max-w-[110px] text-[12px] leading-tight text-[#D3D8EE]">
                    Pindai untuk mengunduh
                  </span>
                </div>
              </div>
            </div>

            {/* PNG ini SUDAH punya frame HP — jangan diberi border/notch lagi */}
            <div className="flex justify-center lg:justify-end lg:pr-4">
              <img
                src="/pelajari-tentang-imma.png"
                alt="Tampilan aplikasi IMMA RS Immanuel"
                className="
                  h-[300px] w-auto max-w-full
                  select-none object-contain
                  drop-shadow-[0_16px_24px_rgba(0,0,0,0.32)]
                  sm:h-[330px]
                  lg:h-[365px]
                  xl:h-[395px]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}