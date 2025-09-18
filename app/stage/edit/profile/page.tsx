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

const ProfileEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [artist, setArtist] = useState<ArtistType>({
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
    affiliationType: "무소속",
  });

  if (user.category === 1) {
    return (
      <Container>
        <ShadowHeader>
          <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
            <LeftChevronIcon fill="#FFFFFF" />
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
            padding: "30px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
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
                value={artist.name}
                onChange={(e) => {
                  setArtist({ ...artist, name: e.target.value });
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
              Instagram 링크
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
                placeholder="인스타그랩을 입력해주세요."
                value={artist.instagramUrl || ""}
                onChange={(e) => {
                  setArtist({ ...artist, instagramUrl: e.target.value });
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
              Youtube 링크
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
                placeholder="유튜브 채널주소를 입력해주세요."
                value={artist.youtubeUrl || ""}
                onChange={(e) => {
                  setArtist({ ...artist, youtubeUrl: e.target.value });
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
              생년월일
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
                value={artist.birthDate}
                onChange={(e) => {
                  setArtist({ ...artist, birthDate: e.target.value });
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
              신장
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
                value={artist.height}
                onChange={(e) => {
                  setArtist({ ...artist, height: Number(e.target.value) });
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
              체중
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
                placeholder="체중을 입력해주세요."
                value={artist.weight || ""}
                onChange={(e) => {
                  setArtist({ ...artist, weight: Number(e.target.value) });
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
              소속여부
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
                placeholder="소속여부를 입력해주세요."
                value={artist.affiliationType}
                onChange={(e) => {
                  setArtist({ ...artist, affiliationType: e.target.value });
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
              특기
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
                placeholder="특기를 입력해주세요."
                value={artist.specialty?.join(", ") || ""}
                onChange={(e) => {
                  setArtist({
                    ...artist,
                    specialty: e.target.value.split(", "),
                  });
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
              분야
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
                placeholder="분야를 입력해주세요."
                value={artist.tags.join(", ")}
                onChange={(e) => {
                  setArtist({ ...artist, name: e.target.value });
                }}
              />
            </FlexRow>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderWithTitle>
        <div
          onClick={() => router.back()}
          style={{ cursor: "pointer", left: 16 }}
        >
          <LeftChevronIcon fill="#111111" />
        </div>
        <div>프로젝트명</div>
        <EditorIcon fill="#111111" />
      </HeaderWithTitle>
      <ImageWrapper
        style={{
          backgroundColor: COLORS.grayscale[200],
        }}
      >
        <Image
          src={"/images/square-profiles/thumbnail/cd-bg.png"}
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
          padding: "30px 16px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
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
              value={artist.name}
              onChange={(e) => {
                setArtist({ ...artist, name: e.target.value });
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "0px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            소속
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
              value={artist.name}
              onChange={(e) => {
                setArtist({ ...artist, name: e.target.value });
              }}
            />
          </FlexRow>
        </div>
      </div>
    </Container>
  );
};

export default ProfileEditPage;

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

const FlexRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderWithTitle = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;
