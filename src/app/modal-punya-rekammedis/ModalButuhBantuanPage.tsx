"use client";

import { useState } from "react";

export default function ModalButuhBantuanPage({
  onClose,
}: {
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
        ${closing ? "animate-overlay-out" : "animate-overlay"}
      `}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative
          ${closing ? "animate-modal-out" : "animate-modal"}
        `}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black transition cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-center mb-4 text-black">
          Butuh Bantuan?
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Silakan hubungi kami melalui salah satu cara berikut
        </p>

        <div className="space-y-3">
          <a
            onClick={() => window.open("https://wa.me/628112187773", "_blank")}
            className="block w-full border rounded-lg p-3 text-center hover:bg-gray-100 transition text-black cursor-pointer"
          >
            💬 WhatsApp Customer Service
          </a>

          <a
            href="mailto:info@rsimmanuel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border rounded-lg p-3 text-center hover:bg-gray-100 transition text-black cursor-pointer"
          >
            ✉️ Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
