"use client";

import { useState } from "react";
import ModalPunyaRMPage from "./ModalPunyaRMPage";
import ModalLupaPasswordPage from "./ModalLupaPasswordPage";
import ModalVerifikasiOtpResetPasswordPage from "./ModalVerifikasiOtpResetPasswordPage";
import ModalResetPasswordPage from "./ModalResetPasswordPage";
import ModalButuhBantuanPage from "./ModalButuhBantuanPage";
import LoginPakaiOtp from "./LoginPakaiOtp";
import ModalVerifikasiOtpLoginPage from "./ModalVerifikasiOtpLoginPage";

export default function LoginModalController({onClose }: { onClose: () => void; }) {
  const [activeModal, setActiveModal] = useState<"login" | "forgot" | "otp" | "reset" | "help" | "loginOtp" | "loginOtpVerify">("login");
  const [resetEmail, setResetEmail] = useState("");

return (
  <>
    {activeModal === "login" && (
      <ModalPunyaRMPage
        onClose={onClose}   // ⬅️ TUTUP DARI PARENT
        onForgot={() => setActiveModal("forgot")}
        onHelp={() => setActiveModal("help")}
        onLoginOtp={() => setActiveModal("loginOtp")}
        direction="right"
      />
    )}

    {activeModal === "forgot" && (
        <ModalLupaPasswordPage
          onClose={onClose} // ❌ X / overlay → close semua
          onBack={() => setActiveModal("login")}
          direction="left"
          onSuccessOtp={(email) => {
            setResetEmail(email);
            setActiveModal("otp"); // 🔥 PINDAH KE OTP
          }}
        />
    )}

     {activeModal === "otp" && (
        <ModalVerifikasiOtpResetPasswordPage
          email={resetEmail}
          onClose={onClose} // ❌ X → close semua
          onVerified={() => {
            setActiveModal("reset"); // 🔥 PINDAH KE RESET PASSWORD
          }}
        />
      )}

      {activeModal === "reset" && (
        <ModalResetPasswordPage
          email={resetEmail}
          onClose={onClose} // selesai → balik login / close
          onSuccess={() => {
            setActiveModal("login"); // 🔥 BALIK KE LOGIN MODAL
          }}
        />
      )}

      {activeModal === "help" && (
        <ModalButuhBantuanPage
          onClose={() => setActiveModal("login")}
        />
      )}

      {activeModal === "loginOtp" && (
        <LoginPakaiOtp
          onClose={onClose}
          onBack={() => setActiveModal("login")}
          onSuccess={(email) => {
            setResetEmail(email);
            setActiveModal("loginOtpVerify"); // ➜ lanjut verifikasi OTP
          }}
        />
      )}

      {activeModal === "loginOtpVerify" && (
        <ModalVerifikasiOtpLoginPage
          email={resetEmail}
          onClose={onClose}
        />
      )}

    </>
  );

}
