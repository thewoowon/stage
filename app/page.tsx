"use client";
import styled from "@emotion/styled";
import { COLORS } from "@/styles/color";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import customAxios from "@/lib/axios";

export default function Home() {
  const params = useSearchParams();
  const code = params.get("code");
  const router = useRouter();

  const getAccessToken = useCallback(async () => {
    if (!code) return;
    try {
      const response = await customAxios.get("/token/token", {
        params: { code },
      });

      console.log("로그인 응답:", response.headers);
      console.log(response.headers["accesstoken"]);
      console.log(response.headers["accesstoken"]);
      if (response.status === 200) {
        console.log("로그인 성공");
        useAuthStore.getState().setAccessToken(response.headers["accesstoken"]);
        localStorage.setItem("refreshToken", response.headers["accesstoken"]);
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      router.replace("/");
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      router.replace("/");
    }
  }, [code, router]);

  useEffect(() => {
    if (code) {
      getAccessToken();
    }
  }, [code, getAccessToken]);

  if (!!useAuthStore.getState().accessToken) {
    return <Container>hello</Container>;
  }

  return <Container>hello, STAGE</Container>;
}

const Container = styled.main`
  background-color: white;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-top: 57px;
  overflow-x: hidden;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  @media (max-width: 768px) {
    padding-top: 50px;
  }
  @media (max-width: 480px) {
    padding-top: 40px;
  }
  @media (max-width: 360px) {
    padding-top: 30px;
  }
`;
