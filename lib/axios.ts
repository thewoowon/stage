// lib/customAxios.ts
import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://api.thisismystage.com",
  timeout: 10000,
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

// === 외부에서 주입할 함수 (AuthContext에서 attach) ===
let getToken: () => string | null = () => null;
let setToken: (t: string | null) => void = () => {};
let logout: () => void = () => {};

export const attachAuthHelpers = (helpers: {
  getToken: () => string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
}) => {
  getToken = helpers.getToken;
  setToken = helpers.setToken;
  logout = helpers.logout;
};

// 요청 인터셉터
customAxios.interceptors.request.use((config) => {
  const token = getToken();
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
        const res = await customAxios.post("/auth/token/reissue"); // refreshToken은 쿠키 자동 전송
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("토큰 재발급 실패");

        setToken(newAccessToken);
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
