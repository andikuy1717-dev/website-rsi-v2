"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export default function SejarahPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const section1910 = useFadeInOnScroll();
  const section1922 = useFadeInOnScroll();
  const section1949 = useFadeInOnScroll();
  const section1965 = useFadeInOnScroll();
  const section1997 = useFadeInOnScroll();
  const section2010 = useFadeInOnScroll();
  const section2022 = useFadeInOnScroll();

  return (
    <div className="min-h-screen mx-auto w-full max-w-8xl px-4 md:px-14 lg:px-16 xl:px-18 text-black">

      {/* ================= SECTION 1910 ================= */}
      <div ref={section1910.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section1910.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* IMAGE LEFT */}
        <div className="w-full flex justify-center">
          <Image
            src="/1910.png"
            alt="Immanuel Hospital 1910"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* TEXT RIGHT */}
        <div className="text-gray-600 text-sm leading-relaxed">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            1910
          </h2>
          <p className="text-justify">
            {t.sejarah1910}
          </p>
        </div>
      </div>

      {/* ================= SECTION 1922 ================= */}
      <div ref={section1922.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section1922.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* TEXT LEFT */}
        <div className="text-gray-600 text-sm leading-relaxed order-2 md:order-1 md:pl-10">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            1922
          </h2>
          <p className="text-justify">
            {t.sejarah1922}
          </p>
        </div>

        {/* IMAGE RIGHT */}
        <div className="w-full flex justify-center order-1 md:order-2">
          <Image
            src="/1922.png"
            alt="Immanuel Hospital 1922"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* ================= SECTION 1949 ================= */}
      <div ref={section1949.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section1949.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* IMAGE LEFT */}
        <div className="w-full flex justify-center">
          <Image
            src="/1949.png"
            alt="Immanuel Hospital 1949"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* TEXT RIGHT */}
        <div className="text-gray-600 text-sm leading-relaxed">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            1949
          </h2>
          <p className="text-justify">
            {t.sejarah1949}
          </p>
        </div>
      </div>

      {/* ================= SECTION 1965 ================= */}
      <div ref={section1965.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section1965.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* TEXT LEFT */}
        <div className="text-gray-600 text-sm leading-relaxed order-2 md:order-1 md:pl-10">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            1965
          </h2>
          <p className="text-justify">
            {t.sejarah1965}
          </p>
        </div>

        {/* IMAGE RIGHT */}
        <div className="w-full flex justify-center order-1 md:order-2">
          <Image
            src="/1965.webp"
            alt="Immanuel Hospital 1965"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* ================= SECTION 1997 ================= */}
      <div ref={section1997.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section1997.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* IMAGE LEFT */}
        <div className="w-full flex justify-center">
          <Image
            src="/1997.webp"
            alt="Immanuel Hospital 1997"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* TEXT RIGHT */}
        <div className="text-gray-600 text-sm leading-relaxed">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            1997
          </h2>
          <p className="text-justify">
           {t.sejarah1997}
          </p>
        </div>
      </div>
      
      {/* ================= SECTION 2010 ================= */}
      <div ref={section2010.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section2010.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* TEXT LEFT */}
        <div className="text-gray-600 text-sm leading-relaxed order-2 md:order-1 md:pl-10">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            2010
          </h2>
          <p className="text-justify">
            {t.sejarah2010}
          </p>
        </div>

        {/* IMAGE RIGHT */}
        <div className="w-full flex justify-center order-1 md:order-2">
          <Image
            src="/2010.webp"
            alt="Immanuel Hospital 2010"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* ================= SECTION 2022 ================= */}
      <div ref={section2022.ref} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 transition-all duration-700 ease-out ${section2022.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* IMAGE LEFT */}
        <div className="w-full flex justify-center">
          <Image
            src="/2022.webp"
            alt="Immanuel Hospital 2022"
            width={500}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* TEXT RIGHT */}
        <div className="text-gray-600 text-sm leading-relaxed">
          <h2 className="text-[60px] font-semibold text-blue-950 mb-3">
            2022
          </h2>
          <p className="text-justify">
            {t.sejarah2022}
          </p>
        </div>
      </div>
      
    </div>
  );
}
