import styled from "@emotion/styled";
import Header from "../layout/Header";
import GNB from "../layout/GNB";
import { COLORS } from "@/styles/color";
import { useState } from "react";
import { TYPOGRAPHY } from "@/styles/typography";
import DownChevronIcon from "../svg/DownChevronIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ARTIST_DATA: ArtistType[] = [
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
  {
    id: 2,
    name: "박아티스트",
    profileImage: "/images/square-profiles/women/woman-1.png",
    thumbnailImage: "/images/square-profiles/women/woman-1.png",
    description: "안녕하세요. 저는 뮤지컬을 좋아하는 박아티스트입니다.",
    followersCount: 500,
    isFollowing: false,
    level: 2,
    score: 600,
    tags: ["뮤지컬", "연극"],
    height: 165,
    weight: 50,
    birthDate: "1995-03-22",
    specialty: ["배우", "보컬"],
  },
  {
    id: 3,
    name: "최아티스트",
    profileImage: "/images/square-profiles/women/woman-2.png",
    thumbnailImage: "/images/square-profiles/women/woman-2.png",
    description: "안녕하세요. 저는 클래식을 좋아하는 최아티스트입니다.",
    followersCount: 300,
    isFollowing: true,
    level: 4,
    score: 800,
    tags: ["클래식", "오페라"],
    height: 170,
    weight: 55,
    birthDate: "1988-11-30",
    specialty: ["성악"],
  },
  {
    id: 4,
    name: "정아티스트",
    profileImage: "/images/square-profiles/men/man-3.png",
    thumbnailImage: "/images/square-profiles/men/man-3.png",
    description: "안녕하세요. 저는 연극을 좋아하는 정아티스트입니다.",
    followersCount: 400,
    isFollowing: false,
    level: 3,
    score: 700,
    tags: ["연극", "뮤지컬"],
    height: 178,
    weight: 70,
    birthDate: "1991-07-10",
    specialty: ["배우"],
  },
  {
    id: 5,
    name: "한아티스트",
    profileImage: "/images/square-profiles/women/woman-3.png",
    thumbnailImage: "/images/square-profiles/women/woman-3.png",
    description: "안녕하세요. 저는 서커스를 좋아하는 한아티스트입니다.",
    followersCount: 200,
    isFollowing: true,
    level: 2,
    score: 500,
    tags: ["서커스", "마술"],
    height: 160,
    weight: 48,
    birthDate: "1993-09-18",
    specialty: ["마술사"],
  },
  {
    id: 6,
    name: "오아티스트",
    profileImage: "/images/square-profiles/women/woman-4.png",
    thumbnailImage: "/images/square-profiles/women/woman-4.png",
    description: "안녕하세요. 저는 국악을 좋아하는 오아티스트입니다.",
    followersCount: 100,
    isFollowing: false,
    level: 1,
    score: 300,
    tags: ["국악", "판소리"],
    height: 162,
    weight: 50,
    birthDate: "1994-12-05",
    specialty: ["국악인"],
  },
];

export const PROJECT_DATA: ProjectType[] = [
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
  {
    id: 2,
    title: "뮤지컬<더멜로디>남자배우 추가모집합니다",
    thumbnailImage: "/images/projects-images/project-3.png",
    description: "이 프로젝트는 현대무용 작품을 선보이는 공연입니다.",
    likesCount: 100,
    isLiked: false,
    artist: [ARTIST_DATA[1]],
    tags: ["현대무용", "발레"],
    deadline: "2025-12-01",
    company: "댄스 컴퍼니",
    caster: "이민수",
  },
];

const THEMES = [
  { id: 0, name: "대중음악" },
  { id: 1, name: "무용" },
  { id: 2, name: "뮤지컬" },
  { id: 3, name: "클래식" },
  { id: 4, name: "연극" },
  { id: 5, name: "서커스/마술" },
  { id: 6, name: "국악" },
];

const SORT_OPTIONS = ["최신순", "인기순", "과거순"];

const SortOptionsContextMenu = ({
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

const ArtistList = ({ artist }: { artist: ArtistType[] }) => {
  return (
    <ArtistListContainer>
      {artist.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </ArtistListContainer>
  );
};

const ArtistCard = ({ artist }: { artist: ArtistType }) => {
  const router = useRouter();
  return (
    <ArtistCardContainer
      onClick={() => router.push(`/search/artist/${artist.id}`)}
    >
      <div style={{ position: "relative", width: "100%", height: "164px" }}>
        <Image
          src={artist.profileImage}
          alt={artist.name}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "0 16px",
        }}
      >
        <div>
          {artist.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[100],
                backgroundColor: COLORS.primary[500],
                padding: "2px 6px",
                marginRight: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body1["semiBold"],
          }}
        >
          {artist.name}
        </div>
        {/* <div style={{ ...TYPOGRAPHY.body2["regular"] }}>
          팔로워 {artist.followersCount}명
        </div> */}
        <div
          style={{
            ...TYPOGRAPHY.body2["regular"],
            color: COLORS.grayscale[700],
          }}
        >
          레벨
          {artist.level}/ {artist.score}
        </div>
      </div>
    </ArtistCardContainer>
  );
};

const ArtistListContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 0px 100px 0px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  grid-row-gap: 20px;
`;

const ArtistCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 13px;
  cursor: pointer;
`;

const ProjectList = ({ project }: { project: ProjectType[] }) => {
  return (
    <ProjectListContainer>
      {project.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectListContainer>
  );
};

const ProjectCard = ({ project }: { project: ProjectType }) => {
  const router = useRouter();
  return (
    <ProjectCardContainer
      onClick={() => router.push(`/search/project/${project.id}`)}
    >
      <div style={{ position: "relative", width: "100%", height: "164px" }}>
        <Image
          src={project.thumbnailImage}
          alt={project.title}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          {project.artist.map((artist) => (
            <div
              key={artist.id}
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[100],
                backgroundColor: COLORS.primary[500],
                padding: "2px 6px",
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body1["semiBold"],
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body2["regular"],
            color: COLORS.grayscale[700],
          }}
        >
          {project.description}
        </div>
      </div>
    </ProjectCardContainer>
  );
};

const ProjectListContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 0 0px 100px 0px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  grid-row-gap: 20px;
`;

const ProjectCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 13px;
  cursor: pointer;
`;

const SearchMainView = () => {
  const [viewMode, setViewMode] = useState<"artist" | "project">("artist");
  const [selectedTheme, setSelectedTheme] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<string>("최신순");
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [count, setCount] = useState(84);

  const handleModeChange = (mode: "artist" | "project") => {
    setViewMode(mode);
  };

  return (
    <Container>
      <Header />
      <ArtistProjectButtonContainer>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[viewMode === "artist" ? "semiBold" : "regular"],
          }}
          onClick={() => {
            handleModeChange("artist");
          }}
          selected={viewMode === "artist"}
        >
          아티스트
        </ArtistProjectButton>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[
              viewMode === "project" ? "semiBold" : "regular"
            ],
          }}
          onClick={() => {
            handleModeChange("project");
          }}
          selected={viewMode === "project"}
        >
          프로젝트
        </ArtistProjectButton>
      </ArtistProjectButtonContainer>
      <HorizontalThemeScrollContainer>
        {THEMES.map((theme) => (
          <ThemeButton
            key={theme.id}
            style={{
              ...TYPOGRAPHY.body2["medium"],
              color: selectedTheme.includes(theme.id)
                ? COLORS.grayscale[100]
                : COLORS.grayscale[700],
              border: `1px solid ${COLORS.grayscale[500]}`,
              backgroundColor: selectedTheme.includes(theme.id)
                ? COLORS.grayscale[1300]
                : "transparent",
            }}
            onClick={() => {
              if (selectedTheme.includes(theme.id)) {
                setSelectedTheme((prev) =>
                  prev.filter((id) => id !== theme.id)
                );
              } else {
                setSelectedTheme((prev) => [...prev, theme.id]);
              }
            }}
          >
            {theme.name}
          </ThemeButton>
        ))}
      </HorizontalThemeScrollContainer>
      <FlexRowSpaceBetween>
        <div
          style={{
            ...TYPOGRAPHY.body2["medium"],
          }}
        >
          {count}개
        </div>
        <SortButton
          style={{
            ...TYPOGRAPHY.body2["medium"],
          }}
          onClick={() => setContextMenuOpen((prev) => !prev)}
        >
          {sortOption}
          <DownChevronIcon />
          <SortOptionsContextMenu
            open={contextMenuOpen}
            options={SORT_OPTIONS}
            selectedOption={sortOption}
            onSelect={(option) => {
              console.log("select", option);
              setSortOption(option);
              setContextMenuOpen(false);
            }}
            onClose={() => {
              setContextMenuOpen(false);
            }}
          />
        </SortButton>
      </FlexRowSpaceBetween>
      {viewMode === "artist" ? (
        <ArtistList artist={ARTIST_DATA} />
      ) : (
        <ProjectList project={PROJECT_DATA} />
      )}
      <GNB />
      {contextMenuOpen && (
        <ContextMenuOverlay onClick={() => setContextMenuOpen(false)} />
      )}
    </Container>
  );
};

export default SearchMainView;

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
  width: 80px;
  height: 42px;
  padding: 8px 12px;
  border: none;
  color: ${({ selected }) =>
    selected ? COLORS.grayscale[1300] : COLORS.grayscale[600]};
  cursor: pointer;
`;

const HorizontalThemeScrollContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  gap: 8px;
  padding: 12px 16px;
`;

const ThemeButton = styled.button`
  flex: 0 0 auto;
  padding: 8px 10px;
  cursor: pointer;
  height: 36px;
`;

const FlexRowSpaceBetween = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 16px 12px 16px;
  color: ${COLORS.grayscale[700]};
`;

const SortButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: ${COLORS.grayscale[700]};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ContextMenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;
