"use client";
import styled from "@emotion/styled";
import { COLORS } from "@/styles/color";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import customAxios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import BackgroundVideo from "@/components/module/BackgroundVideo";
import { LogoText } from "@/components/svg";
import SearchMainView from "@/components/view/SearchMainView";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const { user, setUser } = useUser();

  const {
    setAccessToken,
    isAuthenticated,
    setIsAuthenticated,
    setRefreshToken,
  } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false); // ✅ 루프 방지용 플래그

  const getAccessToken = useCallback(async () => {
    if (!code || isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await customAxios.get("/api/token/token", {
        params: { code },
      });

      if (response.status === 200) {
        const accessToken =
          response.headers["accesstoken"] ||
          response.headers["AccessToken"] ||
          response.headers["access-token"]; // ✅ 케이스 대응
        const refreshToken =
          response.headers["refreshtoken"] ||
          response.headers["RefreshToken"] ||
          response.headers["refresh-token"];

        if (!accessToken || !refreshToken) {
          toast.error("토큰을 가져오지 못했습니다.");
          router.replace("/");
          return;
        }

        const userInfoResponse = await customAxios.get(
          "/api/user/getUserInfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (userInfoResponse.status === 200) {
          const userInfo = userInfoResponse.data;
          if (!userInfo.category) {
            // ✅ 최초 회원가입 단계
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setIsAuthenticated(true);
            setUser(userInfo);
            router.replace("/signup");
            return;
          }

          // ✅ 정상 로그인 처리
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setIsAuthenticated(true);
          setUser(userInfo);
          // code 쿼리 제거 후 홈 이동 (무한 루프 방지)
          router.replace("/");
        }
      } else {
        console.error("로그인 실패:", response);
        router.replace("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "로그인에 실패했습니다.");
      } else {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      router.replace("/");
    } finally {
      setIsProcessing(false);
    }
  }, [
    code,
    isProcessing,
    router,
    setAccessToken,
    setIsAuthenticated,
    setRefreshToken,
    setUser,
  ]);

  const handleLogin = () => {
    window.location.href =
      "https://api.thisismystage.com/oauth2/authorization/google";
  };

  useEffect(() => {
    if (code) {
      void getAccessToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]); // ✅ code만 감시 (getAccessToken 의존성 제거)

  if (isAuthenticated && user) {
    return <SearchMainView />;
  }

  return (
    <Container>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          paddingBottom: "100px",
        }}
      >
        <LogoText />
      </div>
      <BackgroundVideo />
      <ButtonWrapper>
        <ButtonBox>
          <Button onClick={handleLogin}>구글로 시작</Button>
        </ButtonBox>
      </ButtonWrapper>
    </Container>
  );
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
  overflow-x: hidden;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Button = styled.button`
  z-index: 1;
  width: 100%;
  height: 48px;
  background-color: #111111;
  color: #ff6828;
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -2%;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #191919;
  }

  &:disabled {
    background-color: ${COLORS.grayscale[200]};
    color: ${COLORS.grayscale[500]};
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  gap: 12px;
`;
