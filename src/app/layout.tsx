// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import LayoutWrapper from "./LayoutWrapper";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
    <html lang="id">
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}