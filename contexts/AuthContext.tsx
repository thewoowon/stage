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
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // ✅ logout
  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // TODO: 서버 로그아웃 API 호출 추가 가능
  }, []);

  // ✅ accessToken setter (localStorage 동기화)
  const handleSetAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, []);

  // ✅ 초기화: localStorage에서 불러오기
  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        handleSetAccessToken(token);
      }
    } catch (e) {
      console.error("Auth init error:", e);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [handleSetAccessToken, logout]);

  // ✅ customAxios에 helper 연결
  useEffect(() => {
    attachAuthHelpers({
      getToken: () => accessToken,
      setToken: handleSetAccessToken,
      logout,
    });
  }, [accessToken, handleSetAccessToken, logout]);

  // ✅ 첫 진입 시 init 실행
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: handleSetAccessToken,
        isAuthenticated: !!accessToken,
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
