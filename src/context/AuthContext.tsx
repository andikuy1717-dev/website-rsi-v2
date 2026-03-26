"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type JwtPayload = {
  exp: number;
};

type AuthContextType = {
  userId: number | null;
  token: string | null;
  firstName: string | null;
  medicalNo: string | null;
  email: string | null;
  noKK: string | null;
  login: (data: {
    id: number;
    token: string;
    firstName: string;
    medicalNo?: string;
    email?: string;
    noKK?: string;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [medicalNo, setMedicalNo] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [noKK, setNoKK] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // 🔥 LOGIN
  function login(data: {
    id: number;
    token: string;
    firstName: string;
    medicalNo?: string;
    email?: string;
    noKK?: string;
  }) {
    const { id, token, firstName, medicalNo, email, noKK } = data;

    localStorage.setItem("userId", id.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", firstName);
    if (medicalNo) localStorage.setItem("medicalNo", medicalNo);
    if (email) localStorage.setItem("email", email);
    if (noKK) localStorage.setItem("noKK", noKK);

    setUserId(id);
    setToken(token);
    setFirstName(firstName);
    setMedicalNo(medicalNo || null);
    setEmail(email || null);
    setNoKK(noKK || null);
  }

   // 🔥 LOGOUT
  function logout() {
    if (isInitializing) return; // 🔥 KUNCI UTAMA

    // 🔥 clear semua storage user-related
    localStorage.clear();
    sessionStorage.clear();

    setUserId(null);
    setToken(null);
    setFirstName(null);
    setMedicalNo(null);
    setEmail(null);
    setNoKK(null);

    router.push("/login");
  }

  // 🔥 AUTO LOAD + AUTO LOGOUT TOKEN EXPIRED
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("firstName");
    const storedMedicalNo = localStorage.getItem("medicalNo");
    const storedEmail = localStorage.getItem("email");
    const storedNoKK = localStorage.getItem("noKK");

    if (storedUserId) {
      setUserId(Number(storedUserId));
    }

    if (!storedToken) {
      setIsInitializing(false); // 🔥 PENTING
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      const now = Date.now() / 1000;
      const remaining = decoded.exp - now;

      if (remaining <= 0) {
        logout();
        return;
      }

      setToken(storedToken);
      setFirstName(storedFirstName);
      setMedicalNo(storedMedicalNo);
      setEmail(storedEmail);
      setNoKK(storedNoKK);

      const timer = setTimeout(() => {
        logout();
      }, remaining * 1000);

      return () => clearTimeout(timer);

    } catch (err) {
    // ⛔ JANGAN logout saat init
      console.warn("JWT decode skipped during init", err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId, token, firstName, medicalNo, email, noKK, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
