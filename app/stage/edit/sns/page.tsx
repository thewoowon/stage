"use client";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import InstagramIcon from "@/components/svg/InstagramIcon";
import YoutubeIcon from "@/components/svg/YoutubeIcon";
import { useUser } from "@/contexts/UserContext";
import PlusIcon from "@/components/svg/PlusIcon";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import customAxios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ArtistDetailResponseType, SNSResponseType } from "@/type";
import { isValidHttpsUrl } from "@/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";

const LoaderLottie = () => {
  return (
    <DotLottieReact
      src="/lotties/loading_gray.lottie" // public/anims/hero.lottie
      autoplay
      loop
      style={{
        width: "32px",
        height: "32px",
      }}
    />
  );
};

const OptionsContextMenu = ({
  open,
  options,
  selectedOption,
  onSelect,
}: {
  open: boolean;
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <ContextMenuContainer>
      {options.map((option) => (
        <ContextMenuItem
          key={option}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
          style={{
            ...TYPOGRAPHY.body2["regular"],
            backgroundColor:
              selectedOption === option ? COLORS.grayscale[400] : "",
          }}
        >
          {option === "youtube" ? (
            <YoutubeIcon width={20} height={20} />
          ) : (
            <InstagramIcon width={20} height={20} />
          )}
        </ContextMenuItem>
      ))}
    </ContextMenuContainer>
  );
};

const ContextMenuContainer = styled.div`
  width: 70px;
  position: absolute;
  top: 110%;
  right: 0;
  background-color: ${COLORS.grayscale[100]};
  border: 1px solid ${COLORS.grayscale[500]};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ContextMenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.grayscale[400]};
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SnsEditPage = () => {
  const router = useRouter();
  const { user } = useUser();

  // 동적으로
  const [snsSettings, setSnsSettins] = useState<
    (SNSResponseType & {
      contextMenuOpen?: boolean;
    })[]
  >([]);

  const { data: myStageData, isLoading: isMyStageLoading } =
    useQuery<ArtistDetailResponseType>({
      queryKey: ["myStage"],
      queryFn: async () => {
        const response = await customAxios.get(`/api/stage/getMyArtistStage`);
        if (response.status !== 200) {
          throw new Error("프로필 정보를 가져오는 데 실패했습니다.");
        }

        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5분
    });

  // /api/stage/getSns
  const { data: mySnsData, isLoading: isMySnsLoading } = useQuery<
    SNSResponseType[]
  >({
    queryKey: ["mySns", myStageData?.id],
    queryFn: async () => {
      const response = await customAxios.get(`/api/stage/getSns`, {
        params: {
          profileId: myStageData?.id,
        },
      });
      if (response.status !== 200) {
        throw new Error("프로필 정보를 가져오는 데 실패했습니다.");
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!myStageData && !!myStageData.id, // user가 있을 때만 실행
  });

  const handleUpdate = async () => {
    console.log("user:", user);
    // validation
    // instagram, youtube 각각 1개씩만 있어야 함.
    const types = snsSettings.map((sns) => sns.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      toast.error("같은 SNS 유형은 하나만 추가할 수 있습니다.");
      return;
    }
    // isValidHttpsUrl
    for (const sns of snsSettings) {
      if (!sns.title || sns.title.trim() === "") {
        toast.error("제목을 입력해주세요.");
        return;
      }
      if (!sns.url || sns.url.trim() === "") {
        toast.error("URL을 입력해주세요.");
        return;
      }
      if (!isValidHttpsUrl(sns.url)) {
        toast.error("유효한 HTTPS URL을 입력해주세요.");
        return;
      }
    }

    if (!myStageData) {
      toast.error("아티스트 스테이지 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      const response = await customAxios.post(`/api/stage/createSns`, {
        id: myStageData?.id,
        snsData: snsSettings.map((sns) => ({
          title: sns.title,
          type: sns.type,
          url: sns.url,
        })),
      });

      if (response.status !== 200) {
        throw new Error("프로필 정보를 업데이트하는 데 실패했습니다.");
      }

      toast.success("저장되었습니다.");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("프로필 정보를 업데이트하는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (mySnsData && mySnsData.length > 0) {
      setSnsSettins(mySnsData);
    }
  }, [mySnsData]);

  if (isMyStageLoading || isMySnsLoading) {
    return (
      <Container>
        <ShadowHeader>
          <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="black" />
          </div>
          <div
            style={{
              ...TYPOGRAPHY.body1["semiBold"],
            }}
          >
            공식 SNS 편집
          </div>
          <div
            onClick={() => {
              return;
            }}
            style={{ cursor: "pointer" }}
          >
            <PlusIcon />
          </div>
        </ShadowHeader>
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoaderLottie />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ShadowHeader>
        <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
          <LeftChevronIcon fill="black" />
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body1["semiBold"],
          }}
        >
          공식 SNS 편집
        </div>
        <div
          onClick={() => {
            if (snsSettings.length >= 2) return;

            const newSettings = [...snsSettings];
            newSettings.push({ id: 0, type: "instagram", title: "", url: "" });
            setSnsSettins(newSettings);
          }}
          style={{ cursor: "pointer" }}
        >
          <PlusIcon />
        </div>
      </ShadowHeader>
      {snsSettings.map((sns, index) => (
        <div
          style={{
            padding: "20px 16px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          key={index}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              제목
            </div>
            <FlexRow
              style={{
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
                placeholder="제목을 입력해주세요"
                value={sns.title}
                onChange={(e) => {
                  const newSettings = [...snsSettings];
                  newSettings[index].title = e.target.value;
                  setSnsSettins(newSettings);
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              게시물 링크
            </div>
            <FlexRow
              style={{
                gap: "8px",
              }}
            >
              <FlexRow
                style={{
                  width: "70px",
                  height: "44px",
                  border: `0.7px solid ${COLORS.grayscale[500]}`,
                  position: "relative",
                  cursor: "pointer",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setSnsSettins((prev) => {
                    const newSettings = [...prev];
                    newSettings[index].contextMenuOpen =
                      !newSettings[index].contextMenuOpen;
                    return newSettings;
                  });
                }}
              >
                {sns.type === "youtube" ? (
                  <YoutubeIcon width={20} height={20} />
                ) : (
                  <InstagramIcon width={20} height={20} />
                )}
                <DownChevronIcon fill="black" />
                <OptionsContextMenu
                  open={sns.contextMenuOpen || false}
                  options={["instagram", "youtube"]}
                  selectedOption={sns.type}
                  onSelect={(option) => {
                    console.log("select", option);
                    const newSettings = [...snsSettings];
                    newSettings[index].type = option as "instagram" | "youtube";
                    newSettings[index].contextMenuOpen = false;
                    setSnsSettins(newSettings);
                  }}
                  onClose={() => {
                    const newSettings = [...snsSettings];
                    newSettings[index].contextMenuOpen = false;
                    setSnsSettins(newSettings);
                  }}
                />
              </FlexRow>
              <FlexRow
                style={{
                  flex: 1,
                  height: "44px",
                  border: `0.7px solid ${COLORS.grayscale[500]}`,
                  position: "relative",
                  cursor: "pointer",
                  gap: "8px",
                }}
              >
                <CustomInput
                  style={{
                    ...TYPOGRAPHY.body2["regular"],
                    paddingLeft: "10px",
                  }}
                  placeholder="게시물 링크를 입력해주세요."
                  value={sns.url}
                  onChange={(e) => {
                    const newSettings = [...snsSettings];
                    newSettings[index].url = e.target.value;
                    setSnsSettins(newSettings);
                  }}
                />
              </FlexRow>
            </FlexRow>
          </div>
        </div>
      ))}
      <ButtonWrapper>
        <ButtonBox>
          {snsSettings.length > 0 && (
            <Button onClick={handleUpdate}>저장</Button>
          )}
        </ButtonBox>
      </ButtonWrapper>
    </Container>
  );
};

export default SnsEditPage;

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
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 20px;
  margin-top: 12px;
`;

const Button = styled.button`
  z-index: 1;
  width: 100%;
  height: 48px;
  background-color: ${COLORS.primary[500]};
  color: ${COLORS.grayscale[100]};
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
    background-color: ${COLORS.grayscale[200]};
    color: ${COLORS.grayscale[500]};
    cursor: not-allowed;
  }
`;

const FlexRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const CustomInput = styled.input`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  &::placeholder {
    color: ${COLORS.grayscale[500]};
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
