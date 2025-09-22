"use client";
import styled from "@emotion/styled";
import { COLORS } from "@/styles/color";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import customAxios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Context 기반
import BackgroundVideo from "@/components/module/BackgroundVideo";
import { LogoText } from "@/components/svg";
import SearchMainView from "@/components/view/SearchMainView";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const { user, setUser } = useUser();

  // ✅ AuthContext 훅 사용
  const {
    setAccessToken,
    isAuthenticated,
    setIsAuthenticated,
    setRefreshToken,
  } = useAuth();

  // ✅ 서버에서 Access Token 발급
  const getAccessToken = useCallback(async () => {
    console.log("getAccessToken 호출됨");
    if (!code) return;
    try {
      const response = await customAxios.get("/api/token/token", {
        params: { code },
      });

      if (response.status === 200) {
        const accessToken = response.headers["accesstoken"];
        const refreshToken = response.headers["refreshtoken"];

        setAccessToken(accessToken);
        setRefreshToken(refreshToken); // ✅ localStorage도 자동 반영됨
      } else {
        console.error("로그인 실패:", response);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }

      const userInfoResponse = await customAxios.get("/api/user/getUserInfo", {
        headers: { Authorization: `Bearer ${response.headers["accesstoken"]}` },
      });

      if (userInfoResponse.status === 200) {
        const userInfo = userInfoResponse.data;
        console.log("userInfo:", userInfo);
        if (!userInfo.category) {
          router.replace("/signup");
          return;
        }
        router.replace("/");
        setIsAuthenticated(true);
        setUser(userInfo);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      router.replace("/");
    }
  }, [
    code,
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
      console.log("code:", code);
      getAccessToken();
    }
  }, [code, getAccessToken]);

  console.log("isAuthenticated:", isAuthenticated, "user:", user);

  if (isAuthenticated && user.id !== 0) {
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
  -ms-overflow-style: none; /* IE and Edge */
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
