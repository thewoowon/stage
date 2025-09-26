"use client";

import { LeftChevronIcon } from "@/components/svg";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CopyIcon from "@/components/svg/CopyIcon";
import { useAuth } from "@/contexts/AuthContext";
import customAxios from "@/lib/axios";
import toast from "react-hot-toast";

const LoaderLottie = () => {
  return (
    <DotLottieReact
      src="/lotties/find_location.lottie" // public/anims/hero.lottie
      autoplay
      loop
      style={{
        width: "120px",
        height: "120px",
      }}
    />
  );
};

type SignUpState =
  | "role"
  | "authentication"
  | "searching"
  | "result"
  | "completed";

const SIGNUP_STATES: SignUpState[] = [
  "role",
  "authentication",
  "searching",
  "result",
  "completed",
] as const;

const SignInUpRoleCiew = ({
  selectedRole,
  onSelect,
}: {
  selectedRole: "artist" | "caster" | null;
  onSelect: (role: "artist" | "caster" | null) => void;
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h3["bold"],
            color: "#111111",
          }}
        >
          스테이지에서 <br />
          당신의 역할을 선택해주세요
        </Title>
      </div>

      <div
        style={{
          padding: "0 16px",
          width: "100%",
          display: "flex",
          gap: 16,
          flexDirection: "column",
        }}
      >
        <div
          style={{ width: "100%", position: "relative", cursor: "pointer" }}
          onClick={() => onSelect("artist")}
        >
          <div style={{ width: "100%", height: "186px" }}>
            <video
              src="/videos/mono_woman_flash.mp4"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "50%",
              zIndex: 1,
              color: "white",
              ...TYPOGRAPHY.h3["bold"],
              transform: "translateX(-50%)",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
            }}
          >
            아티스트
          </div>
          {
            selectedRole === "artist" && (
              <GradientBackground />
            ) /* 선택된 역할에 따라 그라데이션 배경 표시 */
          }
        </div>
        <div
          style={{ width: "100%", position: "relative", cursor: "pointer" }}
          onClick={() => onSelect("caster")}
        >
          <div style={{ width: "100%", height: "186px" }}>
            <video
              src="/videos/mono_man_flash.mp4"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "50%",
              zIndex: 1,
              color: "white",
              ...TYPOGRAPHY.h3["bold"],
              transform: "translateX(-50%)",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
            }}
          >
            캐스터
          </div>
          {selectedRole === "caster" && <GradientBackground />}
        </div>
      </div>
    </div>
  );
};

const AuthenticationView = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h3["bold"],
            color: "#111111",
          }}
        >
          KOPIS 인증을 위해 <br />
          개인정보를 확인해주세요
        </Title>
      </div>
      <div style={{ padding: "0 16px", width: "100%" }}>
        <FlexRow
          style={{
            width: "100%",
            height: "44px",
            border: `0.7px solid ${COLORS.grayscale[500]}`,
            position: "relative",
            cursor: "pointer",
          }}
        >
          <CustomInput
            style={{
              ...TYPOGRAPHY.body2["regular"],
              paddingLeft: "10px",
            }}
            placeholder="이름을 입력해주세요"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </FlexRow>
      </div>
    </div>
  );
};

const SearchingView = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h3["bold"],
            color: "#111111",
          }}
        >
          KOPIS 정보를 <br />
          조회중입니다
        </Title>
      </div>
      <div
        style={{
          padding: "0 16px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <LoaderLottie />
      </div>
    </div>
  );
};

const RuesultView = ({
  userName = "김OO",
  searchResult,
  onSelect,
}: {
  userName: string;
  searchResult: {
    castId: number;
    categoryName: string;
    performanceName: string;
    name: string;
    startDate: string;
    endDate: string;
    hallName: string;
  };
  onSelect: () => void;
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h3["bold"],
            color: "#111111",
          }}
        >
          KOPIS에서 {userName}님의 <br />
          최신 활동 이력을 찾았습니다. <br />이 경력이 본인 것이 맞나요?
        </Title>
      </div>
      <div
        style={{
          padding: "0 16px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {!!searchResult.castId ? (
          <PortfolioBox>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                {searchResult.categoryName || "없음"}
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                {searchResult.performanceName || "없음"}
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              {searchResult.startDate || "없음"} ~{" "}
              {searchResult.endDate || "없음"}
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: {searchResult.hallName || "없음"}
            </FlexRow>
          </PortfolioBox>
        ) : (
          <div>검색된 이력이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

const CompletedView = ({
  userName = "김OO",
  barcode,
  onSelect,
}: {
  userName: string;
  barcode: string;
  onSelect: () => void;
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h3["bold"],
            color: "#111111",
          }}
        >
          {userName}님의 스테이지 코드가 <br />
          생성되었습니다
        </Title>
      </div>
      <div
        style={{
          padding: "0 16px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <BarcodeBox>
          <div
            style={{
              ...TYPOGRAPHY.body2["semiBold"],
            }}
          >
            고유식별코드
          </div>
          <FlexRow
            style={{
              ...TYPOGRAPHY.h2["bold"],
              gap: "6px",
            }}
          >
            <div>{barcode}</div>
            <div
              onClick={() => {
                navigator.clipboard.writeText("202857");
                toast.success("코드가 복사되었습니다.");
              }}
            >
              <CopyIcon />
            </div>
          </FlexRow>
        </BarcodeBox>
      </div>
    </div>
  );
};

const SignInPage = () => {
  const router = useRouter();
  const [signUpState, setSignUpState] = useState("role");
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    castId: number;
    categoryName: string;
    performanceName: string;
    name: string;
    startDate: string;
    endDate: string;
    hallName: string;
  }>({
    castId: 0,
    categoryName: "",
    performanceName: "",
    name: "",
    startDate: "",
    endDate: "",
    hallName: "",
  });
  const [barcode, setBarcode] = useState("");

  const [signUpForm, setSignUpForm] = useState<{
    role: "artist" | "caster" | null;
    name: string;
  }>({
    role: null,
    name: "",
  });

  const switchSignUpState = () => {
    switch (signUpState) {
      case "role":
        return (
          <SignInUpRoleCiew
            selectedRole={signUpForm.role}
            onSelect={(role: "artist" | "caster" | null) => {
              setSignUpForm({ ...signUpForm, role: role });
            }}
          />
        );
      case "authentication":
        return (
          <AuthenticationView
            value={signUpForm.name}
            onChange={(name: string) =>
              setSignUpForm({ ...signUpForm, name: name })
            }
          />
        );
      case "searching":
        return <SearchingView />;
      case "result":
        return (
          <RuesultView
            userName={signUpForm.name}
            searchResult={searchResult}
            onSelect={() => {
              setSignUpForm({ ...signUpForm, role: "artist" });
            }}
          />
        );
      case "completed":
        return (
          <CompletedView
            userName={signUpForm.name}
            barcode={barcode}
            onSelect={() => {
              setSignUpForm({ ...signUpForm, role: "artist" });
            }}
          />
        );
      default:
        return (
          <SignInUpRoleCiew
            selectedRole={signUpForm.role}
            onSelect={() => {
              setSignUpState("authentication");
            }}
          />
        );
    }
  };

  const searchKopisInfo = async () => {
    // API 요청 보내기
    try {
      const response = await customAxios.get("/api/kopis/getArtist", {
        params: { name: signUpForm.name },
      });

      if (response.status !== 200) {
        toast.error("KOPIS 정보 조회에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const data = response.data;
      if (data.castId === 0) {
        toast.error("KOPIS 정보가 없습니다. 이름을 다시 확인해주세요.");
        setSearchResult({
          castId: 0,
          categoryName: "",
          performanceName: "",
          name: "",
          startDate: "",
          endDate: "",
          hallName: "",
        });
        setSignUpState("result");
        return;
      }

      setSearchResult({
        castId: data.castId,
        categoryName: data.categoryName,
        performanceName: data.performanceName,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        hallName: data.hallName,
      });
      setSignUpState("result");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("KOPIS 정보 조회 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSearchResult({
        castId: 0,
        categoryName: "",
        performanceName: "",
        name: "",
        startDate: "",
        endDate: "",
        hallName: "",
      });
      setSignUpState("result");
    }
  };

  const createArtistStage = async () => {
    // API 요청 보내기
    try {
      const response = await customAxios.post("/api/stage/createArtistStage", {
        name: signUpForm.name,
        castId: searchResult.castId,
      });

      if (response.status !== 200) {
        toast.error(
          "아티스트 스테이지 생성에 실패했습니다. 다시 시도해주세요."
        );
        return;
      }

      const data = response.data;
      setBarcode(data.stageCode || "202857");
      setSignUpState("completed");
    } catch (error) {
      console.error("Error creating artist stage:", error);
      toast.error(
        "아티스트 스테이지 생성 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const createCasterStage = async () => {
    // API 요청 보내기
    try {
      const response = await customAxios.post("/api/stage/createCasterStage");

      if (response.status !== 200) {
        toast.error("캐스터 스테이지 생성에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setIsAuthenticated(true);
      router.push("/stage");
    } catch (error) {
      console.error("Error creating artist stage:", error);
      toast.error(
        "캐스터 스테이지 생성 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleNext = async () => {
    // 일단 validation
    if (signUpState === "role" && !signUpForm.role) {
      toast.error("역할을 선택해주세요.");
      return;
    }

    // 만약 role 선택 후 caster이면 곧바로 생성 작업.
    if (signUpState === "role" && signUpForm.role === "caster") {
      await createCasterStage();
      return;
    }

    if (signUpState === "authentication" && signUpForm.name.trim() === "") {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (signUpState === "authentication") {
      setIsLoading(true);
      setSignUpState("searching");
      await searchKopisInfo();
      return;
    }

    if (signUpState === "result") {
      await createArtistStage();
      return;
    }

    const currentIndex = SIGNUP_STATES.indexOf(
      signUpState as (typeof SIGNUP_STATES)[number]
    );
    if (currentIndex < SIGNUP_STATES.length - 1) {
      setSignUpState(SIGNUP_STATES[currentIndex + 1]);
    }

    // 마지막 단계면 홈으로 이동
    if (signUpState === "completed") {
      setIsAuthenticated(true);
      router.push("/");
    }
  };

  const buttonDisabled = () => {
    if (signUpState === "role") {
      return !signUpForm.role;
    } else if (signUpState === "authentication") {
      return signUpForm.name.trim() === "";
    } else if (signUpState === "searching") {
      return true;
    } else if (signUpState === "result") {
      return false;
    } else if (signUpState === "completed") {
      return false;
    }
    return false;
  };

  const handleBack = () => {
    if (signUpState === "role") {
      router.back();
      return;
    }

    const currentIndex = SIGNUP_STATES.indexOf(
      signUpState as (typeof SIGNUP_STATES)[number]
    );
    if (currentIndex > 0) {
      setSignUpState(SIGNUP_STATES[currentIndex - 1]);
      if (SIGNUP_STATES[currentIndex - 1] === "searching") {
        searchKopisInfo();
      }
    } else {
      router.back();
    }
  };

  return (
    <Container>
      <ShadowHeader>
        <div onClick={handleBack} style={{ cursor: "pointer" }}>
          <LeftChevronIcon fill="#111111" />
        </div>
      </ShadowHeader>
      {/* 상태에 따른 컴포넌트 렌더링 */ switchSignUpState()}
      <ButtonWrapper>
        <ButtonBox>
          {signUpState === "result" && (
            <Button
              onClick={handleBack}
              style={{
                backgroundColor: "white",
                color: COLORS.primary[500],
                border: `1px solid ${COLORS.primary[500]}`,
              }}
            >
              아니오, 다시 확인
            </Button>
          )}
          <Button onClick={handleNext} disabled={buttonDisabled()}>
            {signUpState === "result" ? "네, 맞습니다" : "확인"}
          </Button>
        </ButtonBox>
      </ButtonWrapper>
    </Container>
  );
};

export default SignInPage;

const Container = styled.main`
  background-color: white;
  width: 100%;
  min-height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

const ShadowHeader = styled.div`
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const Title = styled.div``;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

const Button = styled.button`
  z-index: 1;
  width: 100%;
  height: 48px;
  background-color: ${COLORS.primary[500]};
  color: #ffffff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -2%;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.primary[600]};
  }

  &:disabled {
    background-color: ${COLORS.grayscale[600]};
    color: ${COLORS.grayscale[100]};
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

const GradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    195deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(242, 90, 19, 0.2) 50%,
    rgba(242, 90, 19, 1) 100%
  );
  z-index: 2;
`;

const CustomInput = styled.input`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  &::placeholder {
    color: ${COLORS.grayscale[600]};
  }
`;

const FlexRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const PortfolioBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid ${COLORS.grayscale[500]};
  padding: 12px 14px;
`;

const BarcodeBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  border: 1px solid ${COLORS.grayscale[500]};
  padding: 17px 14px;
`;
