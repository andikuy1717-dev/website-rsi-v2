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

  const sections = [
    {
      year: "1910",
      image: "/1910.png",
      text: t.sejarah1910,
      reverse: false,
      ref: section1910,
    },
    {
      year: "1922",
      image: "/1922.png",
      text: t.sejarah1922,
      reverse: true,
      ref: section1922,
    },
    {
      year: "1949",
      image: "/1949.png",
      text: t.sejarah1949,
      reverse: false,
      ref: section1949,
    },
    {
      year: "1965",
      image: "/1965.webp",
      text: t.sejarah1965,
      reverse: true,
      ref: section1965,
    },
    {
      year: "1997",
      image: "/1997.webp",
      text: t.sejarah1997,
      reverse: false,
      ref: section1997,
    },
    {
      year: "2010",
      image: "/2010.webp",
      text: t.sejarah2010,
      reverse: true,
      ref: section2010,
    },
    {
      year: "2022",
      image: "/2022.webp",
      text: t.sejarah2022,
      reverse: false,
      ref: section2022,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">

      {/* ================= TIMELINE ================= */}
      <div className="relative">

        {/* GARIS TIMELINE DESKTOP */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slate-200 lg:block" />

        <div className="space-y-16 md:space-y-20">

          {sections.map((section) => (
            <div
              key={section.year}
              ref={section.ref.ref}
              className={`
                relative grid grid-cols-1 items-center gap-8
                transition-all duration-700 ease-out
                lg:grid-cols-2 lg:gap-16
                ${
                  section.ref.isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }
              `}
            >

              {/* ================= IMAGE ================= */}
              <div
                className={
                  section.reverse
                    ? "lg:order-2"
                    : "lg:order-1"
                }
              >
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.10)]">

                  <div className="overflow-hidden rounded-xl">
                    <Image
                      src={section.image}
                      alt={`Immanuel Hospital ${section.year}`}
                      width={600}
                      height={420}
                      className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                </div>
              </div>

              {/* ================= CONTENT ================= */}
              <div
                className={
                  section.reverse
                    ? "lg:order-1"
                    : "lg:order-2"
                }
              >

                {/* YEAR */}
                <h3 className="text-5xl font-extrabold tracking-tight text-[#182772] sm:text-6xl">
                  {section.year}
                </h3>

                {/* ACCENT LINE */}
                <div className="my-5 h-px w-16 bg-[#d6ad52]" />

                {/* DESCRIPTION */}
                <p className="text-justify text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {section.text}
                </p>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= END TIMELINE ================= */}
      <div className="mt-20 flex justify-center">
        <div className="h-2 w-2 rounded-full bg-[#d6ad52]" />
      </div>

    </div>
  );
}