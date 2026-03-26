"use client";

import Image from "next/image";

export default function PreFooter() {
  return (
    <section className="relative w-full mt-12">
      {/* IMAGE */}
      <div className="relative w-full aspect-1350/450">
        <Image
          src="/prefooter.png"
          alt="Pre Footer"
          fill
          className="object-cover"
          sizes="100vw"
          loading="eager"
          priority
        />
      </div>
    </section>
  );
}
