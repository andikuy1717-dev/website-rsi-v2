"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import {
  getOrganization,
  OrganizationItem,
} from "@/services/OrganizationService";

export default function KataPengantarPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const judulAnim = useFadeInOnScroll(true);
  const direksiAnim = useFadeInOnScroll(true);

  const [organization, setOrganization] = useState<OrganizationItem[]>([]);
  const [loadingOrganization, setLoadingOrganization] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoadingOrganization(true);

        const result = await getOrganization();

        if (result.success && Array.isArray(result.data)) {
          setOrganization(result.data);
        } else {
          setOrganization([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data struktur organisasi:", error);
        setOrganization([]);
      } finally {
        setLoadingOrganization(false);
      }
    };

    fetchOrganization();
  }, []);

  const getPhotoUrl = (photoUrl: string) => {
    if (!photoUrl) return "";

    if (photoUrl.startsWith("http")) {
      return photoUrl;
    }

    return `https://app.rsimmanuel.net${photoUrl}`;
  };

  // Menggabungkan pimpinan utama dan seluruh children-nya menjadi daftar card.
  const flattenOrganization = (
    data: OrganizationItem[]
  ): OrganizationItem[] => {
    return data
      .sort((a, b) => a.order - b.order)
      .flatMap((item) => [
        item,
        ...flattenOrganization(
          [...(item.children || [])].sort((a, b) => a.order - b.order)
        ),
      ]);
  };

  const directors = flattenOrganization(organization);

  return (
    <div className="mx-auto max-w-6xl">
      {/* JUDUL */}
      <div
        ref={judulAnim.ref}
        className={`mb-10 text-center transition-all duration-700 ${
          judulAnim.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <h1 className="text-[18px] font-semibold text-gray-700 sm:text-[22px] md:text-[28px]">
          {t.jajaranDireksi}
        </h1>

        <p className="mt-2 text-base text-gray-600 md:text-lg">
           {organization.length > 0 ? organization[0].periode : ""}
        </p>
      </div>

      {/* FOTO DIREKSI */}
      <div
        ref={direksiAnim.ref}
        className={`mb-14 grid grid-cols-1 gap-10 text-center transition-all duration-700 sm:grid-cols-2 lg:grid-cols-3 ${
          direksiAnim.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        {loadingOrganization && (
          <div className="col-span-full flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#21368B]" />
          </div>
        )}

        {!loadingOrganization && directors.length === 0 && (
          <p className="col-span-full py-10 text-gray-500">
            Belum ada data jajaran direksi.
          </p>
        )}

        {!loadingOrganization &&
          directors.map((director) => (
            <div key={director.id} className="flex flex-col items-center">
              {/* FOTO */}
              <div className="relative h-72 w-56 overflow-hidden rounded-xl border-2 border-gray-400 bg-gradient-to-tr from-gray-400 via-gray-500 to-gray-600 shadow-lg md:h-72 md:w-48 lg:w-56">
                {director.photo_url ? (
                  <img
                    src={getPhotoUrl(director.photo_url)}
                    alt={director.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white">
                    Foto belum tersedia
                  </div>
                )}
              </div>

              {/* NAMEPLATE */}
              <div className="relative mt-4 w-full overflow-hidden bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 px-6 py-3 text-center shadow-lg">
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-white" />
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-white" />
                <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-white" />
                <span className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-white" />

                <p className="text-sm font-extrabold tracking-wide text-gray-900 md:text-[13px] xl:text-[14px]">
                  {director.name}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-800 md:text-[12px]">
                  {director.position}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* KATA PENGANTAR */}
      <div className="rounded-xl border border-gray-400 bg-white p-6 shadow-sm md:p-10">
        <h2 className="mb-6 text-center text-[30px] font-bold text-gray-900">
          {t.kataPengantar}
        </h2>

        <div
          className="space-y-5 text-justify leading-relaxed text-gray-700 xl:text-[16px]"
          dangerouslySetInnerHTML={{ __html: t.kataPengantarText }}
        />
      </div>
    </div>
  );
}