"use client";
import styled from "@emotion/styled";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import InstagramIcon from "@/components/svg/InstagramIcon";
import YoutubeIcon from "@/components/svg/YoutubeIcon";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import { ArtistDetailResponseType } from "@/type";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getLinkPreview } from "@/utils";

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

const ArtistCard = ({
  artist,
}: {
  artist: {
    score: string;
    grade: string;
    name: string;
    image: string;
    categoryName: string;
  };
}) => {
  return (
    <ArtistCardContainer>
      <div style={{ position: "relative", width: "140px", height: "140px" }}>
        <Image
          src={artist.image}
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
          <span
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[100],
              backgroundColor: COLORS.primary[500],
              padding: "2px 6px",
              marginRight: 4,
            }}
          >
            {artist.categoryName}
          </span>
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
          {artist.grade}/ {artist.score}
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

const ArtistPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const [imageOverlayVisible, setImageOverlayVisible] = useState(false);
  const [videoOverlayVisible, setVideoOverlayVisible] = useState(false);

  const { data, isLoading } = useQuery<ArtistDetailResponseType>({
    queryKey: ["artist", id],
    queryFn: async () => {
      const response = await customAxios.get(`/api/stage/getStage`, {
        params: { stageId: id },
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    enabled: !!id,
  });

  const handleConnection = () => {
    router.push(`/connection/artist/${id}/send`);
  };

  useEffect(() => {
    if (status === "connected") {
      setOpen(true);
    }
  }, [status]);

  if (isLoading) {
    return (
      <Container>
        <ShadowHeader>
          <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
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
      <ShadowHeader>
        <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
          <LeftChevronIcon fill="#FFFFFF" />
        </div>
      </ShadowHeader>
      <ImageWrapper
        style={{
          backgroundColor: COLORS.grayscale[400],
        }}
      >
        {data?.image && (
          <Image
            src={data.image}
            alt={data.name}
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
          {data?.grade || "Unknown"} | {data?.score}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.h2["bold"],
          }}
        >
          {data?.name}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              cursor:
                data?.youtubeLink !== "https://" ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (data?.youtubeLink === "https://") return;
              if (!data?.youtubeLink) return;
              router.push(data.youtubeLink || "");
            }}
          >
            <YoutubeIcon />
          </div>
          <div
            style={{
              cursor:
                data?.instagramLink !== "https://" ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (data?.instagramLink === "https://") return;
              if (!data?.instagramLink) return;
              router.push(data.instagramLink || "");
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
            {data?.birthDate ? data?.birthDate.slice(0, 10) : "알 수 없음"}
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
          <div>{data?.height ? `${data.height} cm` : "알 수 없음"}</div>
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
          <div>{data?.weight ? `${data.weight} kg` : "알 수 없음"}</div>
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
            {Array.isArray(data?.specialty)
              ? data.specialty.join(", ")
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
            {data?.genreList.length === 0 && "없음"}
            {data &&
              data.genreList.length > 0 &&
              data.genreList.map((genre, index) => (
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
        </Title>
        <HorizontalThemeScrollContainer>
          {data?.snsList.length === 0 && "없음"}
          {data &&
            data.snsList.length > 0 &&
            data.snsList.map(async (sns) => {
              const preview = await getLinkPreview(sns.url);
              console.log(sns.title, sns.url, preview);
              // type: 1 = youtube, 2 = instagram
              if (sns.type === "1") {
                return (
                  <SnsCard key={sns.id}>
                    <div
                      style={{
                        position: "relative",
                        width: "190px",
                        height: "210px",
                        backgroundColor: COLORS.grayscale[500],
                      }}
                      // onClick={() => {
                      //   setImageOverlayVisible(true);
                      // }}
                    >
                      {preview.valid && preview.thumbnail && (
                        <Image
                          src={preview.thumbnail}
                          alt="Instagram"
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
                        onClick={() => {
                          if (sns.url === "https://") return;
                          if (!sns.url) return;
                          router.push(sns.url || "");
                        }}
                      >
                        <YoutubeIcon width={20} height={20} />
                      </div>
                    </FlexRow>
                  </SnsCard>
                );
              } else {
                return (
                  <SnsCard key={sns.id}>
                    <div
                      style={{
                        position: "relative",
                        width: "190px",
                        height: "210px",
                        backgroundColor: COLORS.grayscale[500],
                      }}
                      // onClick={() => {
                      //   setVideoOverlayVisible(true);
                      // }}
                    >
                      {preview.valid && preview.thumbnail && (
                        <Image
                          src={preview.thumbnail}
                          alt="Instagram"
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
                        Instagram
                      </div>
                      <div
                        onClick={() => {
                          if (sns.url === "https://") return;
                          if (!sns.url) return;
                          router.push(sns.url || "");
                        }}
                      >
                        <InstagramIcon width={20} height={20} />
                      </div>
                    </FlexRow>
                  </SnsCard>
                );
              }
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
          {data?.portfolioList.length === 0 && "없음"}
          {data &&
            data.portfolioList.length > 0 &&
            data.portfolioList.map((portfolio) => (
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
                    {portfolio.title || "공연명"}
                  </div>
                </FlexRow>
                <FlexRow
                  style={{
                    ...TYPOGRAPHY.body2["regular"],
                  }}
                >
                  {portfolio.startDate} ~ {portfolio.endDate}
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
          AI 추천 유사 아티스트
        </Title>
        <HorizontalThemeScrollContainer>
          {(!data?.artistList || data.artistList.length === 0) && "없음"}
          {data?.artistList &&
            data.artistList?.map((artist, index) => (
              <ArtistCard key={index} artist={artist} />
            ))}
        </HorizontalThemeScrollContainer>
      </div>
      {user?.category === 2 && (
        <ButtonBox>
          <Button onClick={handleConnection}>연결 보내기</Button>
        </ButtonBox>
      )}
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
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              autoPlay
            />
          </div>
        </VideoOverlay>
      )}
      <Modal style={{ display: open ? "flex" : "none" }}>
        <MessageBox>
          <div>
            연결이 성공적으로
            <br />
            전송되었습니다
          </div>
          <MessageBoxButton
            style={{
              ...TYPOGRAPHY.body1.medium,
              backgroundColor: COLORS.grayscale[1100],
              color: COLORS.grayscale[100],
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            확인
          </MessageBoxButton>
        </MessageBox>
      </Modal>
    </Container>
  );
};

export default ArtistPage;

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
  position: absolute;
  top: 0;
  left: 0;
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
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.div`
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
