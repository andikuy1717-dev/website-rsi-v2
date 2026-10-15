import HeroSection from "@/components/beranda/HeroSection";
import SixMainButtons from "@/components/beranda/SixMainButtons";
import LayananUnggulanSectionPage from "@/components/beranda/LayananUnggulanSectionPage";
import RuanganDanKamar from "@/components/beranda/RuanganDanKamar";
import CeritaPasienPage from "@/components/beranda/CeritaPasien";
import SudahBuatJanjiTemuPage from "@/components/beranda/SudahBuatJanjiTemuPage";
import ArtikelDanPromoPage from "@/components/beranda/ArtikelDanPromo";

export default function Page() {
  return (
    <>
      {/* HERO WRAPPER: FULL LATAR ABU (#F3F5FB) TANPA GRADIEN */}
      <section className="w-full bg-[#F3F5FB] pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 relative">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          
          {/* HERO SECTION KIRI & KANAN */}
          <HeroSection />

          {/* KARTU MELAYANG YANG MEMBELAH KE SECTION BERIKUTNYA */}
          <div className="relative z-20 -mb-28 sm:-mb-32 mt-12 sm:mt-16">
            <SixMainButtons />
          </div>

        </div>
      </section>

      {/* SECTION BERIKUTNYA DENGAN LATAR PUTIH */}
      <LayananUnggulanSectionPage />

      {/* SECTION LAINNYA */}
      <RuanganDanKamar />
      <CeritaPasienPage />
      <ArtikelDanPromoPage />
      <SudahBuatJanjiTemuPage />
    </>
  );
}