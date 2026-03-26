"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { getDoctorBookmarks } from "@/utils/doctorBookmark";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { DoctorCard } from "@/app/cari-dokter/page"; // contoh path
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Buat Verifikasi Login Dulu Jika Belum Login atau Token Habis 

export default function DokterFavoritPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<any[]>([]);

  // 🔥 pagination logic
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = favorites.slice(
    startIndex,
  startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
    }
  }, [favorites, totalPages]);

  const handleUnfavorite = (id: string) => {
    setFavorites((prev) =>
        prev.filter((d) => d.paramedicid !== id)
    );
  };

  useEffect(() => {
    let isMounted = true;

    const initPage = async () => {
        startLoading();

        try {
        // Biar loading sempat muncul smooth
        await new Promise((resolve) => setTimeout(resolve, 200));

        const data = getDoctorBookmarks();

        if (!isMounted) return;

        setFavorites(Object.values(data));
        } catch (error) {
        console.error("Load dokter favorit error:", error);
        } finally {
        endLoading();
        }
    };

    initPage();

    return () => {
        isMounted = false;
    };
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-6 text-black">
        {t.dokterFavorit}
      </h1>

      {favorites.length === 0 ? (
        <div className="text-gray-400">
          {t.tidakAdaDokterFavorit}
        </div>
       ) : (
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentItems.map((dokter) => (
                <DoctorCard
                key={dokter.paramedicid}
                dokter={dokter}
                bookLabel={t.bookAppointment}
                addFavorite={t.AddFavorite}
                token={token}
                router={router}
                selectedDate={null}
                onUnfavorite={handleUnfavorite} // 🔥 ini dia
                />
            ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
            
            {/* PREV */}
            <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`
                px-3 py-2 rounded-lg border text-sm
                ${
                currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                }
            `}
            >
            ‹
            </button>

            {/* PAGE NUMBERS */}
            {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
                const start = Math.max(
                1,
                Math.min(currentPage - 2, totalPages - 4)
                );
                return start + i;
            }
            )
            .filter((page) => page >= 1 && page <= totalPages)
            .map((page) => (
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                    px-3 py-2 rounded-lg text-sm border
                    ${
                    currentPage === page
                        ? "bg-blue-900 text-white border-blue-900"
                        : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }
                `}
                >
                {page}
                </button>
            ))}

            {/* NEXT */}
            <button
            onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className={`
                px-3 py-2 rounded-lg border text-sm
                ${
                currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                }
            `}
            >
            ›
            </button>
        </div>
        )}
    </>
  );
}