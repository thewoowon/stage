// lib/customAxios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const customAxios = axios.create({
  baseURL: "https://api.sfgdai.com",
  timeout: 60000,
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 요청 인터셉터
customAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && !config.url?.startsWith("auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
customAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const { logout, setAccessToken } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(customAxios(originalRequest));
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await customAxios.post("/auth/token/reissue"); // refreshToken은 쿠키로 자동 전송
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("토큰 재발급 실패");

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return customAxios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default customAxios;
