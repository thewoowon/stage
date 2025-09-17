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
import EditorIcon from "@/components/svg/EditorIcon";

const AI_RECOMMENDED_ARTISTS: ArtistType[] = [
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
    name: "이뮤지션",
    profileImage: "/images/square-profiles/women/woman-1.png",
    thumbnailImage: "/images/square-profiles/woman-1.png",
    description: "안녕하세요. 저는 음악을 좋아하는 이뮤지션입니다.",
    followersCount: 980,
    isFollowing: true,
    level: 4,
    score: 1200,
    tags: ["록", "인디"],
    height: 165,
    weight: 50,
    birthDate: "1995-03-22",
    specialty: ["배우", "보컬"],
  },
  {
    id: 2,
    name: "박댄서",
    profileImage: "/images/square-profiles/women/woman-2.png",
    thumbnailImage: "/images/square-profiles/woman-2.png",
    description: "안녕하세요. 저는 춤을 좋아하는 박댄서입니다.",
    followersCount: 1500,
    isFollowing: false,
    level: 6,
    score: 1800,
    tags: ["힙합", "팝"],
    height: 175,
    weight: 65,
    birthDate: "1992-05-15",
    specialty: ["댄서"],
  },
  {
    id: 3,
    name: "최성악가",
    profileImage: "/images/square-profiles/women/woman-3.png",
    thumbnailImage: "/images/square-profiles/woman-3.png",
    description: "안녕하세요. 저는 성악을 전공한 최성악가입니다.",
    followersCount: 800,
    isFollowing: false,
    level: 3,
    score: 900,
    tags: ["클래식", "오페라"],
    height: 170,
    weight: 55,
    birthDate: "1988-11-30",
    specialty: ["성악"],
  },
];

const ArtistCard = ({ artist }: { artist: ArtistType }) => {
  const router = useRouter();
  return (
    <ArtistCardContainer
      onClick={() => router.push(`/search/artist/${artist.id}`)}
    >
      <div style={{ position: "relative", width: "140px", height: "140px" }}>
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
          padding: "0 10px 10px 10px",
        }}
      >
        <div>
          {artist.tags.slice(0, 1).map((tag, index) => (
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

const ArtistCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 13px;
  cursor: pointer;
  border: 0.7px solid ${COLORS.grayscale[500]};
`;

const StagePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const [imageOverlayVisible, setImageOverlayVisible] = useState(false);
  const [videoOverlayVisible, setVideoOverlayVisible] = useState(false);

  const artist = ARTIST_DATA.find((artist) => artist.id === 0);

  useEffect(() => {
    if (status === "connected") {
      setOpen(true);
    }
  }, [status]);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  if (user.role === "AR") {
    return (
      <Container>
        <ShadowHeader>
          <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
          </div>
          <div
            onClick={() => router.push("/stage/edit/profile")}
            style={{ cursor: "pointer" }}
          >
            <EditorIcon />
          </div>
        </ShadowHeader>
        <ImageWrapper
          style={{
            backgroundColor: COLORS.grayscale[200],
          }}
        >
          <Image
            src={artist.profileImage}
            alt={artist.name}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority
          />
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
            레벨
            {artist.level} | {artist.score}
          </div>
          <div
            style={{
              ...TYPOGRAPHY.h2["bold"],
            }}
          >
            {artist.name}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <InstagramIcon />
            <YoutubeIcon />
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
            <div>{artist.birthDate}</div>
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
            <div>{artist.height} cm</div>
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
            <div>{artist.weight} kg</div>
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
              {Array.isArray(artist.specialty)
                ? artist.specialty.join(", ")
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
              {artist.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[100],
                    backgroundColor: COLORS.primary[500],
                    padding: "2px 6px",
                  }}
                >
                  {tag}
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
              <EditorIcon />
            </div>
          </Title>
          <HorizontalThemeScrollContainer>
            <SnsCard
              onClick={() => {
                setImageOverlayVisible(true);
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "190px",
                  height: "210px",
                }}
              >
                <Image
                  src="/images/oblong-profiles/men/man-1.png"
                  alt="Instagram"
                  fill
                  sizes="100%"
                  style={{ objectFit: "cover" }}
                  priority
                />
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
                  Instagram
                </div>
                <InstagramIcon width={20} height={20} />
              </FlexRow>
            </SnsCard>
            <SnsCard
              onClick={() => {
                setVideoOverlayVisible(true);
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "190px",
                  height: "210px",
                }}
              >
                <Image
                  src="/images/oblong-profiles/men/man-1.png"
                  alt="Instagram"
                  fill
                  sizes="100%"
                  style={{ objectFit: "cover" }}
                  priority
                />
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
                <YoutubeIcon width={20} height={20} />
              </FlexRow>
            </SnsCard>
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
                  연극
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.body2["semiBold"],
                  }}
                >
                  공연명
                </div>
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                2023.09.21 ~ 2023.09.21
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                공연장명: 대학로 아트홀
              </FlexRow>
            </PortfolioBox>
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
                  연극
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.body2["semiBold"],
                  }}
                >
                  공연명
                </div>
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                2023.09.21 ~ 2023.09.21
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                공연장명: 대학로 아트홀
              </FlexRow>
            </PortfolioBox>
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
                  연극
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.body2["semiBold"],
                  }}
                >
                  공연명
                </div>
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                2023.09.21 ~ 2023.09.21
              </FlexRow>
              <FlexRow
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                공연장명: 대학로 아트홀
              </FlexRow>
            </PortfolioBox>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ShadowHeader>
        <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
          <LeftChevronIcon fill="#FFFFFF" />
        </div>
        <div
          onClick={() => router.push("/stage/edit/profile")}
          style={{ cursor: "pointer" }}
        >
          <EditorIcon />
        </div>
      </ShadowHeader>
      <ImageWrapper
        style={{
          backgroundColor: COLORS.grayscale[200],
        }}
      >
        <Image
          src={artist.profileImage}
          alt={artist.name}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          priority
        />
      </ImageWrapper>
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
          소속사명
          {artist.level}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.h2["bold"],
          }}
        >
          {artist.name}
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
          <PortfolioBox onClick={() => router.push("/search/project/0")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
          <PortfolioBox onClick={() => router.push("/search/project/1")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
          <PortfolioBox onClick={() => router.push("/search/project/2")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
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
          <PortfolioBox onClick={() => router.push("/search/project/0")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
          <PortfolioBox onClick={() => router.push("/search/project/1")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
          <PortfolioBox onClick={() => router.push("/search/project/2")}>
            <FlexRow style={{ gap: 6 }}>
              <div
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.grayscale[1300],
                  padding: "2px 6px",
                }}
              >
                연극
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["semiBold"],
                }}
              >
                공연명
              </div>
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              2023.09.21 ~ 2023.09.21
            </FlexRow>
            <FlexRow
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              공연장명: 대학로 아트홀
            </FlexRow>
          </PortfolioBox>
        </div>
      </div>
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
  justify-content: space-between;
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
  position: absolute;
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
  position: absolute;
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
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
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
