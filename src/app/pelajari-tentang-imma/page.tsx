"use client";

import { useEffect } from "react";
import { endLoading } from "@/utils/LoadingManager";
import OpenIMMA from "./component-tentang-imma/OpenImma";
import TutorialIMMA from "./component-tentang-imma/TutorialImma";
import FiturIMMA from "./component-tentang-imma/FiturImma";

export default function PelajariIMMAPage() {

  useEffect(() => {
    endLoading();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="lg:pt-8 xl:pt-9 text-black">
      {/* KONTEN 1 (OPENING) IMMA */}
      <OpenIMMA />

      {/* KONTEN 2 (TUTORIAL) IMMA */}
      <TutorialIMMA />

      {/* KONTEN 3 (FITUR) IMMA */}
      <FiturIMMA />
    </div>
  );
}