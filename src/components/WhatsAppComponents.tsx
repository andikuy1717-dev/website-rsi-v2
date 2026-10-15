"use client";

//import { useState } from "react";

export default function WhatsAppComponents() {
  return (
    <>
      {/* WA kecil di pojok */}
        <div onClick={() => window.open("https://wa.me/6281297707779", "_blank")} className="flex items-center gap-1 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
        <img
          src="/WA_Logo.png"
          alt="WhatsApp"
          className="max-sm:w-3 max-sm:h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 align-middle"/>
        <span
           className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md">
          WhatsApp
        </span>
      </div>
    </>
  );
}
