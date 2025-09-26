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
let getAccessToken: () => string | null = () => null;
let setAccessToken: (t: string | null) => void = () => {};
let getRefreshToken: () => string | null = () => null;
let setRefreshToken: (t: string | null) => void = () => {};
let logout: () => void = () => {};

export const attachAuthHelpers = (helpers: {
  getAccessToken: () => string | null;
  setAccessToken: (t: string | null) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (t: string | null) => void;
  logout: () => void;
}) => {
  getAccessToken = helpers.getAccessToken;
  setAccessToken = helpers.setAccessToken;
  getRefreshToken = helpers.getRefreshToken;
  setRefreshToken = helpers.setRefreshToken;
  logout = helpers.logout;
};

// 요청 인터셉터
customAxios.interceptors.request.use((config) => {
  if (config.url?.includes("/api/token/refresh")) {
    // ✅ refresh 요청일 때 refreshToken 사용
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    }
    // const refreshToken = getRefreshToken();
    // if (refreshToken) {
    //   config.headers.Authorization = `Bearer ${refreshToken}`;
    // }
    const user = localStorage.getItem("user");

    if (!user) throw new Error("No user in localStorage for refresh token");

    const userObject = JSON.parse(user);
    config.data = {
      userId: userObject.id,
    };
  } else {
    console.log("Attaching access token to request");
    const token = localStorage.getItem("accessToken");
    // const token = getAccessToken();
    console.log("Access Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터
customAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 detected, attempting refresh");
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(customAxios(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        // ✅ refreshToken으로 새 accessToken 요청
        const res = await customAxios.post("/api/token/refresh");
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        if (!newAccessToken) throw new Error("토큰 재발급 실패");

        // 새 토큰 저장
        setAccessToken(newAccessToken);
        if (newRefreshToken) setRefreshToken(newRefreshToken);

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
