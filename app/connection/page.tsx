"use client";
import GNB from "@/components/layout/GNB";
import Header from "@/components/layout/Header";
import { ARTIST_DATA } from "@/components/view/SearchMainView";
import { useUser } from "@/contexts/UserContext";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { useState } from "react";

const SENT_PROJECTS_LIST = [
  {
    id: 0,
    title: "2026년 연극 <저니스 엔드> 배우 모집 공고",
    thumbnailImage: "/images/projects-images/project-1.png",
    description: "이 프로젝트는 새로운 뮤지컬 작품을 제작하는 프로젝트입니다.",
    likesCount: 150,
    isLiked: false,
    artist: [ARTIST_DATA[2], ARTIST_DATA[4]],
    tags: ["뮤지컬", "연극"],
    deadline: "2025-10-09",
    company: "주식회사 피에치이엔엠 (PH E&M)",
    caster: "홍길동",
  },
  {
    id: 1,
    title:
      "뮤지컬 [ 우연히 행복해지다 ] - 부산공연 < 배철수역, 유기범역 > 추가 오디션",
    thumbnailImage: "/images/projects-images/project-2.png",
    description: "이 프로젝트는 유명 클래식 곡들을 연주하는 콘서트입니다.",
    likesCount: 200,
    isLiked: true,
    artist: [ARTIST_DATA[0], ARTIST_DATA[3]],
    tags: ["클래식", "콘서트"],
    deadline: "2025-11-15",
    company: "클래식 컴퍼니",
    caster: "김영희",
  },
];
const RECEIVED_PROJECTS_LIST = [
  {
    id: 0,
    title: "2026년 연극 <저니스 엔드> 배우 모집 공고",
    thumbnailImage: "/images/projects-images/project-1.png",
    description: "이 프로젝트는 새로운 뮤지컬 작품을 제작하는 프로젝트입니다.",
    likesCount: 150,
    isLiked: false,
    artist: [ARTIST_DATA[2], ARTIST_DATA[4]],
    tags: ["뮤지컬", "연극"],
    deadline: "2025-10-09",
    company: "주식회사 피에치이엔엠 (PH E&M)",
    caster: "홍길동",
  },
  {
    id: 1,
    title:
      "뮤지컬 [ 우연히 행복해지다 ] - 부산공연 < 배철수역, 유기범역 > 추가 오디션",
    thumbnailImage: "/images/projects-images/project-2.png",
    description: "이 프로젝트는 유명 클래식 곡들을 연주하는 콘서트입니다.",
    likesCount: 200,
    isLiked: true,
    artist: [ARTIST_DATA[0], ARTIST_DATA[3]],
    tags: ["클래식", "콘서트"],
    deadline: "2025-11-15",
    company: "클래식 컴퍼니",
    caster: "김영희",
  },
];

const SENT_ARTISTS_LIST = [
  {
    id: 0,
    name: "김아티스트",
    profileImage: "/images/square-profiles/men/man-1.png",
    thumbnailImage: "/images/square-profiles/men/man-1.png",
    description: "안녕하세요. 저는 음악을 좋아하는 김아티스트입니다.",
    followersCount: 1200,
    isFollowing: false,
    level: 5,
    score: 1500,
    tags: ["팝", "재즈", "클래식"],
    height: 180,
    weight: 75,
    birthDate: "1990-01-01",
    specialty: ["보컬", "작곡"],
  },
  {
    id: 1,
    name: "이아티스트",
    profileImage: "/images/square-profiles/men/man-2.png",
    thumbnailImage: "/images/square-profiles/men/man-2.png",
    description: "안녕하세요. 저는 무용을 좋아하는 이아티스트입니다.",
    followersCount: 800,
    isFollowing: true,
    level: 3,
    score: 900,
    tags: ["현대무용", "발레"],
    height: 175,
    weight: 65,
    birthDate: "1992-05-15",
    specialty: ["댄서"],
  },
];
const RECEIVED_ARTISTS_LIST = [
  {
    id: 0,
    name: "김아티스트",
    profileImage: "/images/square-profiles/men/man-1.png",
    thumbnailImage: "/images/square-profiles/men/man-1.png",
    description: "안녕하세요. 저는 음악을 좋아하는 김아티스트입니다.",
    followersCount: 1200,
    isFollowing: false,
    level: 5,
    score: 1500,
    tags: ["팝", "재즈", "클래식"],
    height: 180,
    weight: 75,
    birthDate: "1990-01-01",
    specialty: ["보컬", "작곡"],
  },
  {
    id: 1,
    name: "이아티스트",
    profileImage: "/images/square-profiles/men/man-2.png",
    thumbnailImage: "/images/square-profiles/men/man-2.png",
    description: "안녕하세요. 저는 무용을 좋아하는 이아티스트입니다.",
    followersCount: 800,
    isFollowing: true,
    level: 3,
    score: 900,
    tags: ["현대무용", "발레"],
    height: 175,
    weight: 65,
    birthDate: "1992-05-15",
    specialty: ["댄서"],
  },
];

const SentList = ({ data }: { data: (ProjectType | ArtistType)[] }) => {
  if (data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.grayscale[600],
          ...TYPOGRAPHY.body1.medium,
        }}
      >
        보낸 연결이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>ArtistCardContainer</div>
      ))}
    </div>
  );
};

const ReceivedList = ({ data }: { data: (ProjectType | ArtistType)[] }) => {
  if (data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.grayscale[600],
          ...TYPOGRAPHY.body1.medium,
        }}
      >
        받은 연결이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>ArtistCardContainer</div>
      ))}
    </div>
  );
};

const ConnectionPage = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<"sent" | "received">("sent");
  const [sentList, setSentList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);
  const handleModeChange = (mode: "sent" | "received") => {
    setViewMode(mode);
  };

  return (
    <Container>
      <ShadowHeader
        style={{
          ...TYPOGRAPHY.h2["bold"],
        }}
      >
        연결
      </ShadowHeader>
      <ArtistProjectButtonContainer>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[viewMode === "sent" ? "semiBold" : "medium"],
          }}
          onClick={() => {
            handleModeChange("sent");
          }}
          selected={viewMode === "sent"}
        >
          보낸 연결
        </ArtistProjectButton>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[
              viewMode === "received" ? "semiBold" : "medium"
            ],
          }}
          onClick={() => {
            handleModeChange("received");
          }}
          selected={viewMode === "received"}
        >
          받은 연결
        </ArtistProjectButton>
      </ArtistProjectButtonContainer>
      {viewMode === "sent" ? (
        <SentList data={sentList} />
      ) : (
        <ReceivedList data={receivedList} />
      )}
      <GNB />
    </Container>
  );
};

export default ConnectionPage;

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

const ArtistProjectButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
`;

const ArtistProjectButton = styled.button<{ selected?: boolean }>`
  width: 85px;
  height: 42px;
  padding: 8px 12px;
  border: none;
  color: ${({ selected }) =>
    selected ? COLORS.grayscale[1300] : COLORS.grayscale[600]};
  cursor: pointer;
`;

const ShadowHeader = styled.div`
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;
