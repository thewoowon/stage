"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { attachAuthHelpers } from "@lib/axios";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (t: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
  initializeAuth: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // ✅ logout
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);

    // /api/user/logout
    fetch("/api/user/logout", { method: "POST", credentials: "include" }).catch(
      (e) => console.error("Logout API error:", e)
    );
  }, []);

  // ✅ accessToken setter (localStorage 동기화)
  const handleSetAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  }, []);

  // ✅ refreshToken setter (localStorage 동기화)
  const handleSetRefreshToken = useCallback((token: string | null) => {
    setRefreshToken(token);
    if (token) localStorage.setItem("refreshToken", token);
    else localStorage.removeItem("refreshToken");
  }, []);

  // ✅ 초기화: localStorage에서 불러오기
  const initializeAuth = useCallback(async () => {
    try {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");

      console.log("Auth init:", { access, refresh });
      if (access) {
        handleSetAccessToken(access);
        setIsAuthenticated(true);
      }
      if (refresh) {
        handleSetRefreshToken(refresh);
      }

      if (!access) setIsAuthenticated(false);
    } catch (e) {
      console.error("Auth init error:", e);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [handleSetAccessToken, handleSetRefreshToken, logout]);

  // ✅ customAxios에 helper 연결
  useEffect(() => {
    attachAuthHelpers({
      getAccessToken: () => accessToken,
      setAccessToken: handleSetAccessToken,
      getRefreshToken: () => refreshToken,
      setRefreshToken: handleSetRefreshToken,
      logout,
    });
  }, [
    accessToken,
    refreshToken,
    handleSetAccessToken,
    handleSetRefreshToken,
    logout,
  ]);

  // ✅ 첫 진입 시 init 실행
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: handleSetAccessToken,
        refreshToken,
        setRefreshToken: handleSetRefreshToken,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        initializeAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
