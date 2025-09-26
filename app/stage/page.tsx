"use client";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import InstagramIcon from "@/components/svg/InstagramIcon";
import YoutubeIcon from "@/components/svg/YoutubeIcon";
import { useUser } from "@/contexts/UserContext";
import EditorIcon from "@/components/svg/EditorIcon";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import GNB from "@/components/layout/GNB";
import { ArtistDetailResponseType, ProjectResponseType } from "@/type";
import { useAuth } from "@/contexts/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PlusIcon from "@/components/svg/PlusIcon";

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

const StagePage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const [imageOverlayVisible, setImageOverlayVisible] = useState(false);
  const [videoOverlayVisible, setVideoOverlayVisible] = useState(false);

  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>(
    {}
  );

  console.log("user", user);

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
      enabled: !!user, // user가 있을 때만 실행
    });

  // /api/project/getMyOpenProjectList -> 나의 진행중인 프로젝트 목록
  // /api/project/getMyCloseProjectList -> 나의 마감 프로젝트 목록

  const { data: myOpenProjectData, isLoading: isOpenProjectLoading } = useQuery<
    ProjectResponseType[]
  >({
    queryKey: ["myOpenProjects"],
    queryFn: async () => {
      const response = await customAxios.get(
        `/api/project/getMyOpenProjectList`,
        {}
      );
      if (response.status !== 200) {
        throw new Error("진행중인 프로젝트 정보를 가져오는 데 실패했습니다.");
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!user && user.category === 2, // user가 있을 때만 실행
  });

  const { data: myCloseProjectData, isLoading: isCloseProjectLoading } =
    useQuery<ProjectResponseType[]>({
      queryKey: ["myCloseProjects"],
      queryFn: async () => {
        const response = await customAxios.get(
          `/api/project/getMyCloseProjectList`,
          {}
        );
        if (response.status !== 200) {
          throw new Error("마감 프로젝트 정보를 가져오는 데 실패했습니다.");
        }

        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5분
      enabled: !!user && user.category === 2, // user가 있을 때만 실행
    });

  // ✅ 썸네일 가져오기 함수
  async function fetchPreview(url: string) {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    return res.json();
  }

  // ✅ SNS 리스트에 있는 링크들 한번에 처리
  useEffect(() => {
    if (!myStageData?.snsList) return;

    (async () => {
      const results: Record<string, string | null> = {};
      await Promise.all(
        myStageData.snsList.map(async (sns) => {
          const preview = await fetchPreview(sns.url);
          results[sns.id] = preview.valid ? preview.thumbnail : null;
        })
      );
      setThumbnails(results);
    })();
  }, [myStageData?.snsList]);

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  // artist가 내 프로필일 때
  if (user.category === 1) {
    if (isMyStageLoading) {
      return (
        <Container>
          <ShadowHeader>
            {/* <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
          </div> */}
            <div
              onClick={() => {
                return;
              }}
              style={{ cursor: "pointer" }}
            >
              <EditorIcon />
            </div>
          </ShadowHeader>
          <ImageWrapper
            style={{
              backgroundColor: COLORS.grayscale[400],
            }}
          ></ImageWrapper>
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
        <OuterBox>
          <ShadowHeader>
            {/* <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
              <LeftChevronIcon fill="#FFFFFF" />
            </div> */}
            <div
              onClick={() => router.push("/stage/edit/profile")}
              style={{ cursor: "pointer" }}
            >
              <EditorIcon />
            </div>
          </ShadowHeader>
          <ImageWrapper
            style={{
              backgroundColor: COLORS.grayscale[400],
            }}
          >
            {myStageData?.image && (
              <Image
                src={myStageData.image}
                alt={myStageData.name}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
          </ImageWrapper>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: 4,
              padding: "25px 16px",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body1["medium"],
                color: COLORS.grayscale[1300],
              }}
            >
              {myStageData?.grade || "Unknown"} | {myStageData?.score || 0}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.h2["bold"],
              }}
            >
              {myStageData?.name || ""}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  cursor:
                    myStageData?.youtubeLink !== "https://"
                      ? "pointer"
                      : "not-allowed",
                }}
                onClick={() => {
                  if (myStageData?.youtubeLink === "https://") return;
                  if (!myStageData?.youtubeLink) return;
                  router.push(myStageData?.youtubeLink);
                }}
              >
                <YoutubeIcon />
              </div>
              <div
                style={{
                  cursor:
                    myStageData?.instagramLink !== "https://"
                      ? "pointer"
                      : "not-allowed",
                }}
                onClick={() => {
                  if (myStageData?.instagramLink === "https://") return;
                  if (!myStageData?.instagramLink) return;
                  router.push(myStageData?.instagramLink);
                }}
              >
                <InstagramIcon />
              </div>
            </div>
          </div>
          <div style={{ padding: "0 16px", width: "100%" }}>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                생년
              </div>
              <div>
                {myStageData?.birthDate
                  ? myStageData.birthDate.slice(0, 10)
                  : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                신장
              </div>
              <div>
                {myStageData?.weight
                  ? `${myStageData.weight} cm`
                  : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                체중
              </div>
              <div>
                {myStageData?.weight
                  ? `${myStageData.weight} kg`
                  : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                특기
              </div>
              <div>
                {Array.isArray(myStageData?.specialty)
                  ? myStageData.specialty.join(", ")
                  : "없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                분야
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(myStageData?.genreList || []).length === 0 && "없음"}
                {myStageData &&
                  (myStageData?.genreList || []).length > 0 &&
                  myStageData.genreList.map((genre, index) => (
                    <span
                      key={index}
                      style={{
                        ...TYPOGRAPHY.caption["medium"],
                        color: COLORS.grayscale[100],
                        backgroundColor: COLORS.primary[500],
                        padding: "2px 6px",
                      }}
                    >
                      {genre.genreName}
                    </span>
                  ))}
              </div>
            </Flex>
          </div>
          <Divider />
          <div style={{ padding: "0 16px", width: "100%" }}>
            <Title
              style={{
                ...TYPOGRAPHY.h4["bold"],
              }}
            >
              공식 SNS
              <div
                onClick={() => router.push("/stage/edit/sns")}
                style={{ cursor: "pointer" }}
              >
                <EditorIcon fill="black" />
              </div>
            </Title>
            <HorizontalThemeScrollContainer>
              {(myStageData?.snsList || []).length === 0 && "없음"}
              {myStageData &&
                (myStageData?.snsList || []).length > 0 &&
                myStageData?.snsList.map((sns) => {
                  const thumbnail = thumbnails[sns.id];
                  return (
                    <SnsCard
                      key={sns.id}
                      onClick={() => {
                        // setImageOverlayVisible(true);
                        // setVideoOverlayVisible(true);
                        return;
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "190px",
                          height: "210px",
                          backgroundColor: COLORS.grayscale[500],
                        }}
                      >
                        {thumbnail && (
                          <Image
                            src={thumbnail}
                            alt={sns.type}
                            fill
                            sizes="100%"
                            style={{ objectFit: "cover" }}
                            priority
                          />
                        )}
                      </div>
                      <FlexRow
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            ...TYPOGRAPHY.body2["regular"],
                          }}
                        >
                          Youtube
                        </div>
                        <div
                          onClick={() => router.push(sns.url)}
                          style={{ cursor: "pointer" }}
                        >
                          {sns.type === "youtube" ? (
                            <YoutubeIcon width={20} height={20} />
                          ) : (
                            <InstagramIcon width={20} height={20} />
                          )}
                        </div>
                      </FlexRow>
                    </SnsCard>
                  );
                })}
            </HorizontalThemeScrollContainer>
          </div>
          <Divider />
          <div style={{ padding: "0 16px", width: "100%" }}>
            <Title
              style={{
                ...TYPOGRAPHY.h4["bold"],
              }}
            >
              KOPIS 포트폴리오
            </Title>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {(myStageData?.portfolioList || []).length === 0 && "없음"}
              {myStageData &&
                (myStageData?.portfolioList || []).length > 0 &&
                myStageData?.portfolioList.map((portfolio) => (
                  <PortfolioBox key={portfolio.id}>
                    <FlexRow style={{ gap: 6 }}>
                      <div
                        style={{
                          ...TYPOGRAPHY.caption["medium"],
                          color: COLORS.grayscale[100],
                          backgroundColor: COLORS.grayscale[1300],
                          padding: "2px 6px",
                        }}
                      >
                        {portfolio.category.genreName || "분야 없음"}
                      </div>
                      <div
                        style={{
                          ...TYPOGRAPHY.body2["semiBold"],
                        }}
                      >
                        {portfolio.title}
                      </div>
                    </FlexRow>
                    <FlexRow
                      style={{
                        ...TYPOGRAPHY.body2["regular"],
                      }}
                    >
                      2023.09.21 ~ 2023.09.21
                      {portfolio.startDate} ~ {portfolio.endDate}
                    </FlexRow>
                    <FlexRow
                      style={{
                        ...TYPOGRAPHY.body2["regular"],
                      }}
                    >
                      공연장명: {portfolio.title || ""}
                    </FlexRow>
                  </PortfolioBox>
                ))}
            </div>
          </div>
          {imageOverlayVisible && (
            <ImageOverlay>
              <ShadowHeader>
                <div
                  onClick={() => {
                    setImageOverlayVisible(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <LeftChevronIcon fill="#FFFFFF" />
                </div>
              </ShadowHeader>
              <div style={{ width: "100%", height: "100%" }}>
                <Image
                  src="/images/oblong-profiles/women/woman-1.png"
                  alt="Profile"
                  fill
                  sizes="100%"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </ImageOverlay>
          )}
          {videoOverlayVisible && (
            <VideoOverlay>
              <ShadowHeader>
                <div
                  onClick={() => {
                    setVideoOverlayVisible(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <LeftChevronIcon fill="#FFFFFF" />
                </div>
              </ShadowHeader>
              <div style={{ width: "100%", height: "100%" }}>
                <video
                  src="/videos/cute_woman_audition.mp4"
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  autoPlay
                />
              </div>
            </VideoOverlay>
          )}
          <ButtonBox>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              로그아웃
            </Button>
          </ButtonBox>
        </OuterBox>
        <GNB />
        <Modal style={{ display: open ? "flex" : "none" }}>
          <MessageBox>
            <div>정말 로그아웃 하시겠어요?</div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <MessageBoxButton
                style={{
                  ...TYPOGRAPHY.body1.medium,
                  backgroundColor: COLORS.grayscale[500],
                  color: COLORS.grayscale[1300],
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                취소
              </MessageBoxButton>
              <MessageBoxButton
                style={{
                  ...TYPOGRAPHY.body1.medium,
                  backgroundColor: COLORS.grayscale[1100],
                  color: COLORS.grayscale[100],
                }}
                onClick={() => {
                  logout();
                  setOpen(false);
                  window.location.href = "/";
                }}
              >
                확인
              </MessageBoxButton>
            </div>
          </MessageBox>
        </Modal>
      </Container>
    );
  }

  if (isOpenProjectLoading || isCloseProjectLoading) {
    return (
      <Container>
        <ShadowHeader>
          {/* <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
          </div> */}
          <div
            onClick={() => router.push("/stage/edit/profile")}
            style={{ cursor: "pointer" }}
          >
            <EditorIcon />
          </div>
        </ShadowHeader>
        <ImageWrapper
          style={{
            backgroundColor: COLORS.grayscale[400],
          }}
        ></ImageWrapper>
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

  // company가 내 프로필일 때 (user.category === 2)

  return (
    <Container>
      <OuterBox>
        <ShadowHeader>
          {/* <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
          </div> */}
          <div
            onClick={() => router.push("/stage/edit/profile")}
            style={{ cursor: "pointer" }}
          >
            <EditorIcon />
          </div>
        </ShadowHeader>
        <ImageWrapper
          style={{
            backgroundColor: COLORS.grayscale[400],
          }}
        ></ImageWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            padding: "25px 16px",
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.body1["medium"],
              color: COLORS.grayscale[1300],
            }}
          >
            {"-"}
          </div>
          <div
            style={{
              ...TYPOGRAPHY.h2["bold"],
            }}
          >
            {user.name}
          </div>
        </div>
        <Divider />
        <div style={{ padding: "0 16px", width: "100%" }}>
          <Title
            style={{
              ...TYPOGRAPHY.h4["bold"],
            }}
          >
            진행중인 프로젝트
          </Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {(myOpenProjectData || []).length === 0 && "없음"}
            {myOpenProjectData &&
              (myOpenProjectData || []).length > 0 &&
              myOpenProjectData?.map((project, index) => (
                <PortfolioBox
                  key={index}
                  onClick={() => router.push("/search/project/0")}
                >
                  <FlexRow style={{ gap: 6 }}>
                    <div
                      style={{
                        ...TYPOGRAPHY.caption["medium"],
                        color: COLORS.grayscale[100],
                        backgroundColor: COLORS.grayscale[1300],
                        padding: "2px 6px",
                      }}
                    >
                      {project.genre || "분야 없음"}
                    </div>
                    <div
                      style={{
                        ...TYPOGRAPHY.body2["semiBold"],
                      }}
                    >
                      {project.title || "공연명"}
                    </div>
                  </FlexRow>
                  <FlexRow
                    style={{
                      ...TYPOGRAPHY.body2["regular"],
                    }}
                  >
                    {project.endDate || "2023.09.21"}
                  </FlexRow>
                </PortfolioBox>
              ))}
          </div>
        </div>
        <Divider />
        <div style={{ padding: "0 16px", width: "100%" }}>
          <Title
            style={{
              ...TYPOGRAPHY.h4["bold"],
            }}
          >
            지난 프로젝트
          </Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {(myCloseProjectData || []).length === 0 && "없음"}
            {myCloseProjectData &&
              (myCloseProjectData || []).length > 0 &&
              myCloseProjectData?.map((project, index) => (
                <PortfolioBox
                  key={index}
                  onClick={() => router.push("/search/project/0")}
                >
                  <FlexRow style={{ gap: 6 }}>
                    <div
                      style={{
                        ...TYPOGRAPHY.caption["medium"],
                        color: COLORS.grayscale[100],
                        backgroundColor: COLORS.grayscale[1300],
                        padding: "2px 6px",
                      }}
                    >
                      {project.genre || "분야 없음"}
                    </div>
                    <div
                      style={{
                        ...TYPOGRAPHY.body2["semiBold"],
                      }}
                    >
                      {project.title || "공연명"}
                    </div>
                  </FlexRow>
                  <FlexRow
                    style={{
                      ...TYPOGRAPHY.body2["regular"],
                    }}
                  >
                    {project.endDate || "2023.09.21"}
                  </FlexRow>
                </PortfolioBox>
              ))}
          </div>
        </div>
        <ButtonBox>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            로그아웃
          </Button>
        </ButtonBox>
      </OuterBox>
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "20px",
          zIndex: 10,
          width: "48px",
          height: "48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.primary[500],
          borderRadius: "24px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
        onClick={() => {
          router.push("/stage/create");
        }}
      >
        <PlusIcon fill="white" opacity={1} />
      </div>
      <GNB />
      <Modal style={{ display: open ? "flex" : "none" }}>
        <MessageBox>
          <div>정말 로그아웃 하시겠어요?</div>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <MessageBoxButton
              style={{
                ...TYPOGRAPHY.body1.medium,
                backgroundColor: COLORS.grayscale[500],
                color: COLORS.grayscale[1300],
              }}
              onClick={() => {
                setOpen(false);
              }}
            >
              취소
            </MessageBoxButton>
            <MessageBoxButton
              style={{
                ...TYPOGRAPHY.body1.medium,
                backgroundColor: COLORS.grayscale[1100],
                color: COLORS.grayscale[100],
              }}
              onClick={() => {
                logout();
                setOpen(false);
                window.location.href = "/";
              }}
            >
              확인
            </MessageBoxButton>
          </div>
        </MessageBox>
      </Modal>
    </Container>
  );
};

export default StagePage;

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
  padding-bottom: 60px;
`;

const ShadowHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
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
  padding-top: 24px;
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
  padding: 12px 0px;
`;

const PortfolioBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid ${COLORS.grayscale[500]};
  padding: 12px 14px;
  cursor: pointer;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SnsCard = styled.div`
  width: 190px;
  height: object-fit;
  border: 0.7px solid ${COLORS.grayscale[500]};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const ImageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const VideoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const OuterBox = styled.div`
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  padding-bottom: 120px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 26px;
`;

const MessageBox = styled.div`
  width: 324px;
  background-color: white;
  color: ${COLORS.grayscale[1300]};
  padding: 32px 18px 18px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 24px;
`;

const MessageBoxButton = styled.div`
  flex: 1;
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
`;
