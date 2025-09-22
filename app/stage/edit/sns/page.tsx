"use client";
import styled from "@emotion/styled";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { ARTIST_DATA } from "@/components/view/SearchMainView";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import InstagramIcon from "@/components/svg/InstagramIcon";
import YoutubeIcon from "@/components/svg/YoutubeIcon";
import { useUser } from "@/contexts/UserContext";
import PlusIcon from "@/components/svg/PlusIcon";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import customAxios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { SNSResponseType } from "@/type";

const SNS_OPTIONS = ["최신순", "인기순", "과거순"];

const OptionsContextMenu = ({
  open,
  options,
  selectedOption,
  onSelect,
  onClose,
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
          {option}
        </ContextMenuItem>
      ))}
    </ContextMenuContainer>
  );
};

const ContextMenuContainer = styled.div`
  width: 80px;
  position: absolute;
  top: 110%;
  right: -6px;
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
`;

const SnsEditPage = () => {
  const router = useRouter();
  const { user } = useUser();

  // 동적으로
  const [snsSettings, setSnsSettins] = useState<SNSResponseType[]>([]);

  // /api/stage/getSns
  const { data: mySnsData, isLoading: isMySnsLoading } = useQuery<
    SNSResponseType[]
  >({
    queryKey: ["mySns"],
    queryFn: async () => {
      const response = await customAxios.get(`/api/stage/getSns`, {});
      if (response.status !== 200) {
        throw new Error("프로필 정보를 가져오는 데 실패했습니다.");
      }

      console.log("myStageData", response.data);

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!user && user.category === 1, // user가 있을 때만 실행
  });

  useEffect(() => {
    if (mySnsData && mySnsData.length > 0) {
      setSnsSettins(mySnsData);
    }
  }, [mySnsData]);

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
              프로젝트
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
                placeholder="프로젝트명을 입력해주세요."
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
              >
                {sns.type === "youtube" ? (
                  <YoutubeIcon width={20} height={20} />
                ) : (
                  <InstagramIcon width={20} height={20} />
                )}
                <DownChevronIcon fill="black" />
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

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 248px;
  flex-shrink: 0;
`;

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f4f4f4;
  margin: 16px 0;
  flex-shrink: 0;
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
