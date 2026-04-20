import HeroSection from "@/components/beranda/HeroSection";
import SixMainButtons from "@/components/beranda/SixMainButtons";
import ListCount from "@/components/beranda/ListCount";
import LayananUnggulanSectionPage from "@/components/beranda/LayananUnggulanSectionPage"

export default function Page() {
  return (
    <>
    <div className="w-full pt-5 sm:pt-5 md:pt-15 flex flex-col items-start justify-start gap-4 sm:gap-6 sm:px-8 md:px-12 lg:px-16 xl:px-18" style={{
      background: "linear-gradient(to bottom right, white 20%, #a6cbff 70%, #a6cbff 50%, #bbd8fd 90%)"
    }}>
      
    {/* HERO SECTION KIRI DAN KANAN */}
      <HeroSection />

      {/* 6 MAIN BUTTONS */}
      <SixMainButtons />
    </div>

      {/* PARAMEDIC COUNT LIST */}
      <ListCount/>

      {/* PARAMEDIC COUNT LIST */}
      <LayananUnggulanSectionPage/>
    </>

  );
}
