import styled from "@emotion/styled";
import Header from "../layout/Header";
import GNB from "../layout/GNB";
import { COLORS } from "@/styles/color";
import { useState } from "react";
import { TYPOGRAPHY } from "@/styles/typography";
import DownChevronIcon from "../svg/DownChevronIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import { GENRE_LIST } from "@/constants";
import {
  ArtistListResponseType,
  ArtistResponseType,
  ProjectListResponseType,
  ProjectResponseType,
} from "@/type";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

const SORT_OPTIONS = ["최신순", "인기순"];

const SortOptionsContextMenu = ({
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

const ArtistList = ({
  artist,
  isLoading,
}: {
  artist: ArtistResponseType[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "88px",
          textAlign: "center",
          marginTop: "20px",
          ...TYPOGRAPHY.body1["regular"],
        }}
      >
        <LoaderLottie />
      </div>
    );
  }

  if (artist.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "88px",
          textAlign: "center",
          marginTop: "20px",
          ...TYPOGRAPHY.body1["regular"],
        }}
      >
        검색 결과가 없어요!
      </div>
    );
  }

  return (
    <ArtistListContainer>
      {artist.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </ArtistListContainer>
  );
};

const ArtistCard = ({ artist }: { artist: ArtistResponseType }) => {
  const router = useRouter();
  return (
    <ArtistCardContainer
      onClick={() => router.push(`/search/artist/${artist.id}`)}
    >
      <div style={{ position: "relative", width: "100%", height: "164px" }}>
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: COLORS.grayscale[500],
            }}
          ></div>
        )}
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
          {artist.categoryList?.map((category, index) => (
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
              {category.genreName}
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
          {artist.level || "Unknown"} / {artist.score || 0}
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

const ProjectList = ({
  project,
  isLoading,
}: {
  project: ProjectResponseType[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "88px",
          textAlign: "center",
          marginTop: "20px",
          ...TYPOGRAPHY.body1["regular"],
        }}
      >
        <LoaderLottie />
      </div>
    );
  }

  if (project.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "88px",
          textAlign: "center",
          marginTop: "20px",
          ...TYPOGRAPHY.body1["regular"],
        }}
      >
        검색 결과가 없어요!
      </div>
    );
  }

  return (
    <ProjectListContainer>
      {project.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectListContainer>
  );
};

const ProjectCard = ({ project }: { project: ProjectResponseType }) => {
  const router = useRouter();
  return (
    <ProjectCardContainer
      onClick={() => router.push(`/search/project/${project.id}`)}
    >
      <div style={{ position: "relative", width: "100%", height: "164px" }}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: COLORS.grayscale[500],
            }}
          ></div>
        )}
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
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[100],
              backgroundColor: COLORS.primary[500],
              padding: "2px 6px",
            }}
          >
            {project.genre}
          </div>
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
          접수마감일: {project.endDate}
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

  const handleModeChange = (mode: "artist" | "project") => {
    setViewMode(mode);
  };

  const { data: artistData, isLoading: artistIsLoading } =
    useQuery<ArtistListResponseType>({
      queryKey: ["artistList", selectedTheme, sortOption],
      queryFn: async () => {
        // Replace with your API call
        const response = await customAxios("/api/stage/getStageList", {
          params: {
            genreListList: selectedTheme,
            startNumber: 0,
            offsetNumber: 50,
            sort: 0,
          },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      },
    });

  const { data: projectData, isLoading: projectIsLoading } =
    useQuery<ProjectListResponseType>({
      queryKey: ["projectList", selectedTheme, sortOption],
      queryFn: async () => {
        // Replace with your API call
        const response = await customAxios("/api/project/getProjectList", {
          params: {
            genreList: selectedTheme,
            startNumber: 0,
            offsetNumber: 50,
            sort: 0,
          },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      },
    });

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
        {GENRE_LIST.map((theme) => (
          <ThemeButton
            key={theme.genreId}
            style={{
              ...TYPOGRAPHY.body2["medium"],
              color: selectedTheme.includes(theme.genreId)
                ? COLORS.grayscale[100]
                : COLORS.grayscale[700],
              border: `1px solid ${COLORS.grayscale[500]}`,
              backgroundColor: selectedTheme.includes(theme.genreId)
                ? COLORS.grayscale[1300]
                : "transparent",
            }}
            onClick={() => {
              if (selectedTheme.includes(theme.genreId)) {
                setSelectedTheme((prev) =>
                  prev.filter((id) => id !== theme.genreId)
                );
              } else {
                setSelectedTheme((prev) => [...prev, theme.genreId]);
              }
            }}
          >
            {theme.genreName}
          </ThemeButton>
        ))}
      </HorizontalThemeScrollContainer>
      <FlexRowSpaceBetween>
        <div
          style={{
            ...TYPOGRAPHY.body2["medium"],
          }}
        >
          {viewMode === "artist"
            ? artistData?.stageList.length || 0
            : projectData?.projectList.length || 0}
          개
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
        <ArtistList
          artist={artistData?.stageList || []}
          isLoading={artistIsLoading}
        />
      ) : (
        <ProjectList
          project={projectData?.projectList || []}
          isLoading={projectIsLoading}
        />
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
